const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
    content: {type: String,required: true},
    date: {type: Date,default: Date.now},
    status : {type : Boolean},
})
    module.exports = mongoose.model('TodoTask',todoTaskSchema);
