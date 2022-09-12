const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    _id: {
        require: true,
        type: Object
    },
    id: {
        require: true,
        type: String
    },
    title: {
        require: true,
        type: String
    },
    dir: {
        require: true,
        type: String
    },
    platform: {
        require: true,
        type: String
    }
}, { collection: 'Streaming' })

module.exports = mongoose.model('Movie', movieSchema)