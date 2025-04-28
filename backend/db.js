const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:sarfaraz%409852@cluster0.7c6mr.mongodb.net/todos")
const todoSchema = mongoose.Schema({
    title: String,
    description: String,
    completed: {
        type: Boolean,
        default: false
    }
})

const todo = mongoose.model('todos', todoSchema);

module.exports = {
    todo
}