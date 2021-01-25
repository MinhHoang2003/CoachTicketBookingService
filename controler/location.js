const pool = require('./coonection_pool')
const Ticket = require('./ticket')
const { asyncForEach } = require('./utils')
const ticket = new Ticket()
function Location() { }

Location.prototype = {

    findPickLocation: async function (routeId) {
        let query = "select * from stop_stations where route_id = ? " +
            "and stop_station_type = 1 order by time"
        return pool.query(query, routeId)
    },

    findDestination: async function (routeId) {
        let query = "select * from stop_stations where route_id = ? " +
            "and stop_station_type = 2 order by time"
        return pool.query(query, routeId)
    },

    findPickLocationWithTickets: async function (routeId, date) {
        let locations = await this.findPickLocation(routeId)
        console.log(locations)
        await asyncForEach(locations, async (value, index) => {
            let number = await ticket.countTicketOfPickLocation(value.id, date)
            console.log(number)
            locations[index]['number'] = number[0].number
        })
        return locations
    },

    findDestinationLocationWithTickets: async function (routeId, date) {
        let locations = await this.findDestination(routeId)
        console.log(locations)
        await asyncForEach(locations, async (value, index) => {
            let number = await ticket.countTicketOfDestinationLocation(value.id, date)
            console.log(number)
            locations[index]['number'] = number[0].number
        })
        return locations
    },

    findAllLocation: async function (routeId) {
        let query = "SELECT * FROM stop_stations WHERE route_id = ? ORDER BY time;"
        return pool.query(query, routeId)
    },

    findOne: async function (id) {
        console.log(id)
        let query = "SELECT * FROM stop_stations WHERE id = ?;"
        let location = await pool.query(query, id)
        if (location.length > 0) {
            return location[0]
        } else return new Error("Wrong id location")
    },

    getMaxTimeOfLocation: async function (routeId) {
        let query = "SELECT stop_stations.* FROM stop_stations WHERE stop_stations.time = (select max(time) from stop_stations where route_id = ?);"
        return pool.query(query, [routeId])
    },

    getMinTimeOfLocation: async function (routeId) {
        let query = "SELECT stop_stations.* FROM stop_stations WHERE stop_stations.time = (select min(time) from stop_stations where route_id = ?);"
        return pool.query(query, [routeId])
    },

    checkSameTimeOfLocation: async function (routeId, time, id) {
        let query = "SELECT * from stop_stations WHERE route_id = ? AND time = ? AND id != ?;"
        let result = await pool.query(query, [routeId, time, id])
        if (result.length > 0) {
            return true
        }
        return false
    },

    updateLocation: async function (location) {
        if (await this.checkSameTimeOfLocation(location.route_id, location.time, location.id) === true) {
            console.log("in check same")
            throw new Error("Wrong time setting when update location")
        }
        let locationType = location.stop_station_type
        if (locationType === 1) {
            let maxTime = await this.getMaxTimeOfLocation(location.route_id)
            console.log("in check max", maxTime)

            if (location.time > maxTime.time) {
                return new Error("Wrong time setting when update location")
            }
        } else {
            let minTime = await this.getMinTimeOfLocation(location.route_id)

            console.log("in check min", minTime)

            if (location.time < minTime.time) {
                console.log("in check min err", location.time < minTime)
                return new Error("Wrong time setting when update location")
            }
        }
        let query = "UPDATE stop_stations SET city = ? ,detail_location = ?,  longitude = ?, latitude = ?, stop_station_type = ?, time = ? WHERE id = ?;"
        return pool.query(query, [location.city, location.detail_location, location.longitude, location.latitude, location.stop_station_type, location.time, location.id])
    },

    addLocation: async function (location) {
        if (await this.checkSameTimeOfLocation(location.route_id, location.time, location.id) === true) {
            console.log("in check same")
            throw new Error("Wrong time setting when update location")
        }
        let locationType = location.stop_station_type
        if (locationType === 1) {
            let maxTime = await this.getMaxTimeOfLocation(location.route_id)
            console.log("in check max", maxTime)

            if (location.time > maxTime.time) {
                return new Error("Wrong time setting when update location")
            }
        } else {
            let minTime = await this.getMinTimeOfLocation(location.route_id)

            console.log("in check min", minTime)

            if (location.time < minTime.time) {
                console.log("in check min err", location.time < minTime)
                return new Error("Wrong time setting when update location")
            }
        }
        let query = "INSERT INTO stop_stations(route_id,city,detail_location,longitude,latitude,stop_station_type,time) VALUES(?,?,?,?,?,?,?);"
        return pool.query(query, [location.route_id, location.city, location.detail_location, location.longitude, location.latitude, location.stop_station_type, location.time])
    },

    remove: async function (id) {
        let canRemove = await this.checkCanRemoveLocation(id)

        if (typeof canRemove != undefined && canRemove.length <= 0) {
            let query = "DELETE FROM stop_stations WHERE id = ?";
            return pool.query(query, id)
        } else throw new Error("Cannot remove this location")
    },

    checkCanRemoveLocation: async function (id) {
        let today = new Date().toISOString().slice(0, 10)
        let query = "select id from tickets where date >= ? and (pick_id = ? or destination_id = ?);"
        return pool.query(query, [today, id, id])
    }

}

module.exports = Location