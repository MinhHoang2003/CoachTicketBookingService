const pool = require('./coonection_pool')


function Location() { }

Location.prototype = {

    findPickLocation: async function (routeId) {
        let query = "select * from stop_stations where route_id = ? " +
            "and ( stop_station_type = 0 or stop_station_type = 1) order by ordering"
        return pool.query(query, routeId)
    },

    findDestination: async function (routeId) {
        let query = "select * from stop_stations where route_id = ? " +
            "and ( stop_station_type = 2 or stop_station_type = 3) order by ordering"
        return pool.query(query, routeId)
    }

}

module.exports = Location