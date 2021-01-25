const pool = require('./coonection_pool')
const bcrypt = require('bcrypt')
const { result } = require('lodash')

function User() { }

User.prototype = {
    find: async function (phoneNumber) {
        let sql = 'SELECT * FROM users WHERE phone_number = ?'
        return pool.query(sql, phoneNumber)
    },

    findPassword: async function (phone) {
        let sql = 'SELECT users.password FROM users WHERE phone_number = ?'
        return pool.query(sql, phone)
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

    login: async function (username, password) {
        let user = await this.find(username)
        if (typeof user != undefined && user.length > 0) {
            let isLogin = await bcrypt.compareSync(password, user[0].password)
            if (isLogin) {
                return user[0]
            } else throw new Error("Wrong password")
        } else throw new Error('Wrong phone number')
    },

    findAll: async function (type) {
        let query = "SELECT * FROM users WHERE role = ?;"
        return pool.query(query, type)
    },

    findOne: async function (id) {
        let query = "SELECT * FROM users WHERE phone_number = ?;"
        let user = await pool.query(query, id)
        if (user.length > 0) {
            return user[0]
        } else return Error("Wrong id of coach")
    },

    update: async function (body, oldId) {
        let query = "UPDATE users SET phone_number = ?, name = ?, avatar_url = ?, email = ?, address =?, role =? WHERE phone_number = ?"
        let result = await pool.query(query, [body.phone_number, body.name, body.avatar_url, body.email, body.address, body.role, oldId])
        return result
    },

    updateWithPassword: async function (body, oldPassword, oldId) {
        let pwd = body.password
        console.log('new pass',pwd)
        body.password = await bcrypt.hash(pwd, 10)
        let dataPassword = await this.findPassword(oldId)
        console.log(dataPassword)
        let currentPass = ''
        if (typeof dataPassword !== undefined && dataPassword.length > 0) {
            currentPass = dataPassword[0]['password']
        } else return new Error('Wrong id of user')
        console.log(currentPass)
        let isSame = await bcrypt.compareSync(oldPassword, currentPass)
        if (isSame) {
            let query = "UPDATE users SET phone_number = ?, password = ?, name = ?, avatar_url = ?, email = ?, address =?, role =? WHERE phone_number = ?"
            return pool.query(query, [body.phone_number, body.password, body.name, body.avatar_url, body.email, body.address, body.role, oldId])
        } else return new Error('Wrong passwrod')
    }
}

module.exports = User