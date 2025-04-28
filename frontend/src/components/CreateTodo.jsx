import { useState } from "react";


export function CreateTodo({setTodos, todos}) {
// react query
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

    function addTodo() {
        if (!title || !description) return alert("Both fields are required!");

        fetch("http://localhost:3000/todos" , {
            method: "POST",
            body: JSON.stringify({
                title: title,
                description: description
            }), headers: {
                "Content-type": "application/json"
            }
        }).then(async (res) => {
            const json = await res.json();
            alert("Todo added");

            setTodos([...todos, { _id: json._id, title, description, completed: false }]);

            // clear input fields
            setTitle("");
            setDescription("");
            
        })
    }

    return <div>
        <input id="title" style={{
            padding: 10,
            margin: 10
        }} type="text" placeholder="title" onChange={ function(e){
            const value = e.target.value;
            setTitle(e.target.value);
        }} ></input> <br/><br/>

        <input id="desc" style={{
            padding: 10, 
            margin: 10
        }} type="text" placeholder="description" onChange={ function(e){
            const value = e.target.value;
            setDescription(e.target. value);
        }}></input> <br/><br/>

        <button  style={{
            padding: 10,
            margin: 10
        }} onClick={addTodo}>Add a todo</button>
    </div>
}