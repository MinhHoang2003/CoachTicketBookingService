const { Error } = require('mongoose')
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
        console.log(requestTicket)
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

    createTicketData: async function (ticket) {
        let query = "INSERT INTO tickets(route_id, date, has_paid, price, pick_id, destination_id, user_id) values(?,?,?,?,?,?,?);"
        return pool.query(query, [ticket.route_id, ticket.date, ticket.has_paid, ticket.price, ticket.pick_id, ticket.destination_id, ticket.user_id])
    },

    createPosition: async function (positionCode, ticketId) {
        let query = "INSERT INTO position_of_ticket(ticket_id, position_code) values(?,?);"
        return pool.query(query, [ticketId, positionCode])
    },

    getTickets: async function (phoneNumber) {
        let query = "select distinct tickets.id, tickets.route_id, tickets.date, a.city as start , b.city as end" +
            " from tickets, (select * from stop_stations where stop_station_type = 0 ) as a , (select * from stop_stations where stop_station_type = 3) as b" +
            " where tickets.user_id = ? and tickets.route_id = a.route_id order by date desc;"

        let tickets = await pool.query(query, phoneNumber)

        await asyncForEach(tickets, async (value, index) => {
            const positions = await this.getPositionOfTicket(value.id)
            const positionsCode = positions.map(value => value.position_code)
            let date = formatDate(value.date)
            tickets[index]['position_code'] = positionsCode
            tickets[index]['date'] = date
        })
        return tickets;
    },

    getPositionOfTicket: async function (id) {
        let query = "select position_of_ticket.position_code from position_of_ticket where position_of_ticket.ticket_id = ?;"
        let result = pool.query(query, id)
        return result
    },

    getTicketDetail: async function (ticketId) {
        let query = "select tickets.*, a.city as start, b.city as end from tickets, " +
        " (select * from stop_stations where stop_station_type = 0 ) as a , " +
        " (select * from stop_stations where stop_station_type = 3) as b " +
        " where tickets.id = ? and tickets.route_id = a.route_id and a.route_id = b.route_id;"
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
            return ticket
        } else throw new Error('wrong id request.')
    },

    getLocationById: async function (id) {
        let query = "select * from stop_stations where id = ?;"
        return pool.query(query, id)
    }
}

module.exports = Ticket