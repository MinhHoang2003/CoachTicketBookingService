const pool = require('./coonection_pool')
const bcrypt = require('bcrypt')
const { result } = require('lodash')

function User() { }

User.prototype = {
    find: function (phoneNumber, callback) {
        // console.log('On find user by phone number : ', phoneNumber)
        let sql = 'SELECT * FROM users WHERE phone_number = ?'
        pool.query(sql, phoneNumber, callback)
    },

    create: function (body, callback) {
        let pwd = body.password
        body.password = bcrypt.hashSync(pwd, 10)
        var bind = []

        for (prop in body) {
            bind.push(body[prop])
        }

        let sql = 'INSERT INTO users(phone_number, name, avatar_url, email, password, address, role) VALUES(?,?,?,?,?,?,?)'
        // console.log('Inside create : ', bind)
        pool.query(sql, bind, callback)
    },

    login: function (username, password, callback) {
        this.find(username, (err, result) => {
            // console.log(result[0].password)
            if (err === null) {
                if (bcrypt.compareSync(password, result[0].password)) {
                    callback(result)
                    return
                }
            }
            callback(null)
        })
    }
}

module.exports = User