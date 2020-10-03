const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanySchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    address: {
        type: String,
        require: true
    },
    rate: {
        type: Number,
        require: true
    }

}, { timestamps: true })

const Company = mongoose.model('companys', CompanySchema)
module.exports = Company