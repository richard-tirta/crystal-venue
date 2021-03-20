import React, { useState } from "react";
import Login from './Login';

export default function ToDoTest(props) {
    const [currentInput, handleInput] = useState('');
    const [todoList, handleToDo] = useState([]);


    return (
        <section className="profile-section">
            <input type="text" id="form_todo" className="form-input" name="todo" minLength="3" maxLength="35" placeholder="What to do" required
                onChange={event => handleInput(event.target.value)}
                onKeyDown={event => { if (event.key === 'Enter') { handleToDo(todoList => [...todoList, event.target.value]); handleInput('') } }}
                value={currentInput} />
            <ul>
                {
                    todoList.map((list, index) => 
                        <li key={'list' + index}>{list}</li>
                    )
                }
            </ul>
                <Login/>
         </section>
    );
}