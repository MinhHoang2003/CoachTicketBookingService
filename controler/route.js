const { route } = require('../routes/route_routes');
const pool = require('./coonection_pool');
const { asyncForEach, dateNow } = require('./utils');

const Location = require('./location')
const location = new Location()
function Route() { }

Route.prototype = {

    find: async function (pickLocation, destination, date) {
        let routes = await this.getRoutes(pickLocation, destination)
        await asyncForEach(routes, async (element, index) => {
            let remain = await this.remainingPosition(element.id, date)
            if (remain.length > 0) {
                routes[index]['remain'] = remain[0].pick
            } else {
                routes[index]['remain'] = 0
            }

            let start = await location.getMinTimeOfLocation(element.id)
            let end = await location.getMaxTimeOfLocation(element.id)

            if (typeof start !== 'undefined' && start.length > 0) {
                routes[index]['start_time'] = start[0].time
                routes[index]['start_address'] = start[0].detail_location
            }

            if (typeof end !== 'undefined' && end.length > 0) {
                routes[index]['estimate_end_time'] = end[0].time
                routes[index]['end_address'] = end[0].detail_location
            }
        });
        var today = new Date();
        var time =
          (today.getHours() < 10 ? '0' : '') +
          today.getHours() +
          ':' +
          (today.getMinutes() < 10 ? '0' : '') +
          today.getMinutes() +
          ':' +
          '00';
        let dateToday = dateNow();
        if (dateToday === date) {
            routes = routes.filter(item => item['start_time'] >= time)
        }
        return routes
    },
    getRoutes: async function (pickLocation, destination) {
        let query = "select routes.*, coachs.number_position " +
            "from routes, coachs where routes.id " +
            "in (SELECT  distinct route_id FROM coachticketbookingdb.stop_stations where city like ? and stop_station_type = 1) " +
            "and routes.id in (select distinct route_id from stop_stations where city like ? and stop_station_type = 2) " +
            "and coachs.coach_id = routes.coach_id ;"
        let pick = '%' + pickLocation + '%'
        let des = '%' + destination + '%'
        return pool.query(query, [pick, des])
    },

    remainingPosition: async function (id, date) {
        let query = "select count(id) as pick from tickets where route_id = ? and date = ? and has_paid = 1 group by route_id"
        return pool.query(query, [id, date])
    },
    getPosition: async function (route_id, date) {
        let query = "select tickets.has_paid, position_of_ticket.position_code from tickets, position_of_ticket " +
            "where route_id = ? and date = ? and tickets.id = position_of_ticket.ticket_id;"
        return pool.query(query, [route_id, date])
    },

    getRoutesForDriver: async function (phoneNumber, date) {
        let query = "select routes.*, coachs.number_position " +
            " from coachs, routes " +
            " where coachs.coach_id = routes.coach_id " +
            " and coachs.driver_id = ?;"
        let routes = await pool.query(query, phoneNumber)
        console.log(routes)
        await asyncForEach(routes, async (value, index) => {
            let bookPosition = await this.remainingPosition(value.id, date)
            if (bookPosition.length > 0) {
                routes[index]['remain'] = bookPosition[0].pick
            } else {
                routes[index]['remain'] = 0
            }

            let start = await location.getMinTimeOfLocation(value.id)
            let end = await location.getMaxTimeOfLocation(value.id)

            if (typeof start !== 'undefined' && start.length > 0) {
                routes[index]['start_time'] = start[0].time
                routes[index]['start_address'] = start[0].detail_location
            }

            if (typeof end !== 'undefined' && end.length > 0) {
                routes[index]['estimate_end_time'] = end[0].time
                routes[index]['end_address'] = end[0].detail_location
            }
        })
        return routes
    },

    findAll: async function () {
        let query = "select routes.*, " +
            "coachs.number_position " +
            "from coachs, routes " +
            "where coachs.coach_id = routes.coach_id; "
        let routes = await pool.query(query)
        await asyncForEach(routes, async (value, index) => {
            let start = await location.getMinTimeOfLocation(value.id)
            let end = await location.getMaxTimeOfLocation(value.id)
            if (typeof start !== 'undefined' && start.length > 0) {
                routes[index]['start_time'] = start[0].time
                routes[index]['start_address'] = start[0].detail_location
            }

            if (typeof end !== 'undefined' && end.length > 0) {
                routes[index]['estimate_end_time'] = end[0].time
                routes[index]['end_address'] = end[0].detail_location
            }
        })

        return routes
    },

    finById: async function (id) {
        let query = "select routes.* from routes where routes.id = ? ;  "

        let route = await pool.query(query, id)
        if (route.length > 0) {
            let routeData = route[0]
            let start = await location.getMinTimeOfLocation(routeData.id)
            let end = await location.getMaxTimeOfLocation(routeData.id)
            console.log(start, end)

            if (typeof start !== 'undefined' && start.length > 0) {
                routeData['start_time'] = start[0].time
                routeData['start_address'] = start[0].detail_location
            }

            if (typeof end !== 'undefined' && end.length > 0) {
                routeData['estimate_end_time'] = end[0].time
                routeData['end_address'] = end[0].detail_location
            }
            return routeData
        } else return Error("Wrong id of route")
    },

    update: async function (body, oldId) {
        let query = "UPDATE routes SET coach_id = ?, price =? WHERE id = ?;"
        return pool.query(query, [body.coach_id, body.price, oldId])
    },

    add: async function (body) {
        let query = "INSERT INTO routes(coach_id, price ) VALUES(?,?);"
        return pool.query(query, [body.coach_id, body.price])
    },

    checkCanRemoveRoute: async function (routeId) {
        let today = new Date().toISOString().slice(0, 10)
        let query = "select id from tickets where date >= ? and route_id = ?;"
        return pool.query(query, [today, routeId])
    },

    remove : async function (id) {
        let canRemove = await this.checkCanRemoveRoute(id)
        if (typeof canRemove != undefined && canRemove.length <= 0) {
            let query = "DELETE FROM routes WHERE id = ?";
            return pool.query(query, id)
        } else throw new Error("Cannot remove this routes")
    }

}

module.exports = Route