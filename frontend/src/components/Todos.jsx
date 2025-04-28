import { useState } from "react";

export function Todos({todos, setTodos}) {

    
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function startEditing(todo) {
    setEditingTodo(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  }

  function updateTodo(id) {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editTitle, description: editDescription }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "Todo updated successfully") {

          // Update state: Replace old todo with updated one
          setTodos(todos.map((todo) => (todo._id === id ? data.todo : todo)));
          setEditingTodo(null); // Exit edit mode
        }
      })
      .catch((err) => console.error("Error updating todo:", err));
  }

    function markAsDone(id) {
        fetch(`http://localhost:3000/todos/completed`, {
            method: "PUT",
            body: JSON.stringify({id}),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then(() => {

              // Update state: Mark the clicked todo as completed
              setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                  todo._id === id ? { ...todo, completed: true } : todo
                )
              );
            })
    }

    function deleteTodo(id) {
      fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            
            setTodos(todos.filter((todo) => todo._id !== id));
          }
        })
        .catch((err) => console.error("Error deleting todo:", err));
    }


    return (
      <div>
        {todos.map((todo) => (
          <div key={todo._id}>
            {editingTodo === todo._id ? (
              <>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <button onClick={() => updateTodo(todo._id)}>Save</button>
                <button onClick={() => setEditingTodo(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h1>{todo.title}</h1>
                <h2>{todo.description}</h2>
                <button onClick={() => markAsDone(todo._id)} style={{color: "green"}}>
                  {todo.completed ? "Completed" : "Mark as Complete"}
                </button>
                <button onClick={() => startEditing(todo)} style={{marginLeft: 10, color: "blue"}}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)} style={{ marginLeft: 10, color: "red" }}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    );
}