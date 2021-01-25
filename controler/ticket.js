const pool = require('./coonection_pool')
const { asyncForEach, formatDate } = require('./utils')

function Ticket() { }

Ticket.prototype = {

    requestTicket: async function (ticket) {
        const requestTicket = {
            route_id: ticket.route_id,
            date: ticket.date,
            has_paid: ticket.has_paid,
            price: ticket.price,
            pick_id: ticket.pick_id,
            destination_id: ticket.destination_id,
            user_id: ticket.user_id
        }
        const positionCodes = ticket.position_code
        let positionCheckResult = await this.checkPositionOfTicket(positionCodes, ticket.route_id, ticket.date)
        if (!positionCheckResult) throw new Error("This position has been choose")
        try {
            let ticketResult = await this.createTicketData(requestTicket)
            console.log(ticketResult)
            await positionCodes.forEach(async element => {
                await this.createPosition(element, ticketResult.insertId)
            });
            return ticketResult.insertId
        } catch (err) {
            console.log("err: ", err)
            return -1
        }
    },

    checkPositionOfTicket: async function (positions, routeId, date) {
        let query = "select position_code from position_of_ticket where ticket_id " +
            "in (select id from tickets where route_id = ? and date = ?) " +
            "and position_code in (?); "
        let result = await pool.query(query, [routeId, date, positions])
        if (typeof result !== undefined && result.length > 0) return false
        else return true
    },

    createTicketData: async function (ticket) {
        let query = "INSERT INTO tickets(route_id, date, has_paid, price, pick_id, destination_id, user_id) values(?,?,?,?,?,?,?);"
        return pool.query(query, [ticket.route_id, ticket.date, ticket.has_paid, ticket.price, ticket.pick_id, ticket.destination_id, ticket.user_id])
    },

    createPosition: async function (positionCode, ticketId) {
        let query = "INSERT INTO position_of_ticket(ticket_id, position_code) values(?,?);"
        return pool.query(query, [ticketId, positionCode])
    },

    getTickets: async function (phoneNumber) {
        let query = "select * " +
            " from tickets " +
            " where tickets.user_id = ? and has_paid = 1;"

        let tickets = await pool.query(query, phoneNumber)

        await asyncForEach(tickets, async (value, index) => {
            const positions = await this.getPositionOfTicket(value.id)
            const positionsCode = positions.map(value => value.position_code)
            let date = formatDate(value.date)
            tickets[index]['position_code'] = positionsCode
            tickets[index]['date'] = date
            const pickLocation = await this.getLocationById(value['pick_id'])
            const destination = await this.getLocationById(value['destination_id'])
            tickets[index]['pick_location'] = pickLocation[0]
            tickets[index]['destination_location'] = destination[0]
            delete tickets[index].pick_id
            delete tickets[index].destination_id

            const startLocation = await this.getMaxTimeOfLocation(value.route_id)
            const endLocation = await this.getMinTimeOfLocation(value.route_id)

            // console.log(startLocation, value.id)
            tickets[index]['start'] = startLocation[0].detail_location
            tickets[index]['end'] = endLocation[0].detail_location

        })
        return tickets;
    },

    getPositionOfTicket: async function (id) {
        let query = "select position_of_ticket.position_code from position_of_ticket where position_of_ticket.ticket_id = ?;"
        let result = pool.query(query, id)
        return result
    },

    getTicketDetail: async function (ticketId) {
        let query = "select tickets.* from tickets " +
            " where tickets.id = ? ;"
        let result = await pool.query(query, ticketId)
        console.log(result)
        if (typeof result !== 'undefined' && result.length > 0) {
            let ticket = result[0]
            const pickLocation = await this.getLocationById(ticket['pick_id'])
            const destination = await this.getLocationById(ticket['destination_id'])
            ticket['pick_location'] = pickLocation[0]
            ticket['destination_location'] = destination[0]
            delete ticket.pick_id
            delete ticket.destination_id
            ticket.date = formatDate(ticket.date)
            const positions = await this.getPositionOfTicket(ticket.id)
            ticket['position_code'] = positions.map(value => value.position_code)


            const startLocation = await this.getMaxTimeOfLocation(ticket.route_id)
            const endLocation = await this.getMinTimeOfLocation(ticket.route_id)

            // console.log(startLocation, value.id)
            ticket['start'] = startLocation[0].detail_location
            ticket['end'] = endLocation[0].detail_location

            return ticket
        } else throw new Error('wrong id request.')
    },

    checkTicket: async function (ticketId, date) {
        let query = "select tickets.* from tickets " +
            "where tickets.id = ?  and tickets.date = ?;"
        let result = await pool.query(query, [ticketId, date])
        console.log(result)
        if (typeof result !== 'undefined' && result.length > 0) {
            let ticket = result[0]
            const pickLocation = await this.getLocationById(ticket['pick_id'])
            const destination = await this.getLocationById(ticket['destination_id'])
            ticket['pick_location'] = pickLocation[0]
            ticket['destination_location'] = destination[0]
            delete ticket.pick_id
            delete ticket.destination_id
            ticket.date = formatDate(ticket.date)
            const positions = await this.getPositionOfTicket(ticket.id)
            ticket['position_code'] = positions.map(value => value.position_code)
            return ticket
        } else throw new Error('wrong id request.')
    },

    getLocationById: async function (id) {
        let query = "select * from stop_stations where id = ?;"
        return pool.query(query, id)
    },

    getTicketsForRoute: async function (routeId, date) {
        let query = "select tickets.* from tickets where tickets.route_id = ? and tickets.date = ? and has_paid = 1;"
        let tickets = await pool.query(query, [routeId, date])
        if (typeof tickets !== 'undefined' && tickets.length > 0) {
            await asyncForEach(tickets, async (value, index) => {
                const pickLocation = await this.getLocationById(value['pick_id'])
                const destination = await this.getLocationById(value['destination_id'])
                tickets[index]['pick_location'] = pickLocation[0]
                tickets[index]['destination_location'] = destination[0]
                delete tickets[index].pick_id
                delete tickets[index].destination_id
                const positions = await this.getPositionOfTicket(value.id)
                tickets[index]['position_code'] = positions.map(value => value.position_code)
            })
        }
        return tickets
    },

    payTicket: async function (ticketId) {
        let query = "update tickets set has_paid = 1 where id = ?"
        return pool.query(query, ticketId)
    },

    countTicketOfPickLocation: async function (locationId, date) {
        let query = "select count(tickets.id) as number from tickets where tickets.pick_id = ? and date = ? and has_paid = 1;"
        return pool.query(query, [locationId, date])
    },

    countTicketOfDestinationLocation: async function (locationId, date) {
        let query = "select count(tickets.id) as number from tickets where tickets.destination_id = ? and date = ? and has_paid = 1;"
        return pool.query(query, [locationId, date])
    },

    getMaxTimeOfLocation: async function (routeId) {
        let query = "SELECT stop_stations.* FROM stop_stations WHERE stop_stations.time = (select max(time) from stop_stations where route_id = ?);"
        return pool.query(query, [routeId])
    },

    getMinTimeOfLocation: async function (routeId) {
        let query = "SELECT stop_stations.* FROM stop_stations WHERE stop_stations.time = (select min(time) from stop_stations where route_id = ?);"
        return pool.query(query, [routeId])
    },

    removeTicket: async function (ticketId) {
        let query = "DELETE FROM tickets WHERE id = ? AND has_paid = 0";
        return pool.query(query, ticketId)
    }
}

module.exports = Ticket