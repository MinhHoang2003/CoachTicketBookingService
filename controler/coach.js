const pool = require('./coonection_pool')
const { asyncForEach } = require('./utils')
function Coach() { }

Coach.prototype = {

    findAll: async function () {
        let query = "SELECT * FROM coachs;"
        let coach = await pool.query(query)
        return coach
    },

    findOne: async function (id) {
        let query = "SELECT * FROM coachs WHERE coach_id = ?;"
        let coach = await pool.query(query, id)
        if (coach.length > 0) {
            return coach[0]
        } else return Error("Wrong id of coach")
    },

    update: async function (coach, oldId) {
        let query = "UPDATE coachs SET coach_id = ?, number_position = ?, number_floors = ?, driver_id = ?, car_brand = ?, images =?, rate =? WHERE coach_id = ?"
        return pool.query(query, [coach.coach_id, coach.number_position, coach.number_floors, coach.driver_id, coach.car_brand, coach.images, coach.rate, oldId])
    },

    create: async function (coach) {
        let query = "INSERT INTO coachs(coach_id, number_position, number_floors, driver_id, car_brand, images, rate) VALUE(?,?,?,?,?,?,?);"
        let result = await pool.query(query, [coach.coach_id, coach.number_position, coach.number_floors, coach.driver_id, coach.car_brand, coach.images, coach.rate])
        return result
    },

    remove : async function (id) {
        let query = "DELETE FROM coachs WHERE coach_id = ?"
        return pool.query(query, id)
    }

}

module.exports = Coach