const express = require("express");
const { createTodo, updateTodo } = require("./types");    // imported from file types.js
const { todo } = require("./db");
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors( // this for allow the local address to sent data or access to different host
    //if we want to restrict we can write here address
))

app.post("/todos", async (req, res) => {
    const createPayload = req.body;
    const parsePayload = createTodo.safeParse(createPayload);

    if (!parsePayload.success) {
        res.status(411).json({
            msg: "You sent the wrong inputs"
        })
        return;
    }
    // put it in mongodb
    await  todo.create({
        title: createPayload.title,
        description: createPayload.description,
        completed: false
    })

    res.json({
        msg: "Todo created"
    })
})

app.get("/todos", async (req, res) => {
    const todos = await todo.find({}, "_id title description completed");
    res.json(todos);

})

app.put("/completed", async (req, res) => {
    const updatePayload = req.body;
    const {id} = req.body;
    const parsePayload = updateTodo.safeParse(updatePayload);
    if (!parsePayload.success) {
        res.status(411).json({
            msg: "You sent the wrong inputs"
        })
        return;
    }

    const updatedTodo = await todo.findByIdAndUpdate(
        id,
        { completed: true },
        { new: true } 
    );
    res.json({
        msg: "Todo marked as completed", todo:updateTodo
    });
});

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updatedTodo = await todo.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        res.json({ msg: "Todo updated successfully", todo: updatedTodo });
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.delete("/todos/:id", async (req, res) => {
  try {
      const { id } = req.params;

    
      const deletedTodo = await todo.findByIdAndDelete(id);

      if (!deletedTodo) {
          return res.status(404).json({ msg: "Todo not found" });
      }

      res.json({ success: true, msg: "Todo deleted", id: deletedTodo._id });
  } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ msg: "Internal server error" });
  }
});


app.listen(3000);
