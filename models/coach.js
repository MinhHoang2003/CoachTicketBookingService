const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CoachSchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'companys'
    },
    license_plates: {
        type: String,
        required: true,
        unique: true
    },
    number_position: {
        type: Number,
        required: true
    },

    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },

    car_brand: String,
    rate: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Coach = mongoose.model('coachs', CoachSchema)

module.exports = Coach