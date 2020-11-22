const pool = require('./coonection_pool')


function Route() { }

Route.prototype = {

    find: async function (pickLocation, destination, date) {
        let routes = await this.getRoutes(pickLocation, destination)
        await routes.forEach(async (element, index) => {
            routes[index]['remain'] = await this.remainingPosition(element.id, date)
        });
        return routes
    },
    getRoutes: async function (pickLocation, destination) {
        let query = "select routes.*, coachs.number_position, a.detail_location as start_address, b.detail_location as end_address " +
            "from " +
            "routes, " +
            "coachs, " +
            "(select * from stop_stations where stop_station_type = 0) as a," +
            "(select * from stop_stations where stop_station_type = 3) as b " +
            "where routes.id in(select distinct route_id from stop_stations where city like ? and (stop_station_type = 2 or stop_station_type = 3) " +
            "and route_id in (SELECT  distinct route_id FROM coachticketbookingdb.stop_stations where city like ? and (stop_station_type = 0 or stop_station_type = 1)))" +
            "and routes.coach_id = coachs.coach_id " +
            "and a.route_id = routes.id " +
            "and b.route_id = routes.id " +
            "and a.route_id = b.route_id;"
        let pick = '%' + pickLocation + '%'
        let des = '%' + destination + '%'
        return pool.query(query, [des, pick])
    },

    remainingPosition: async function (id, date) {
        // let query = "select count(id) as pick from tickets where route_id = ? and date = ? group by route_id"
        // return pool.query(query, [id, date])
        return 33
    },
    getPosition: async function (route_id, date) {
        let query = "select tickets.has_paid, position_of_ticket.position_code from tickets, position_of_ticket " +
            "where route_id = ? and date = ? and tickets.id = position_of_ticket.ticket_id;"
        return pool.query(query, [route_id, date])
    }
}

module.exports = Route