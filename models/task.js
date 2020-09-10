const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
},{
    timestamps: true
})

var Tasks = mongoose.model('Task', taskSchema);

module.exports = Tasks;