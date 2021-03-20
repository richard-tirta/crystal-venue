import React, { useState } from "react";
import Login2 from './Login2';

class ToDoTest2 extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTaskComplete = this.handleTaskComplete.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit(this);
        this.state = {
            toDo: '',
            toDoList: [],
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value,
        })
    }

    handleSubmit(event) {

        event.preventDefault();

        if (this.state.toDo) {
            const newToDo = this.state.toDo;
            const obj = { 'task': newToDo, 'isComplete': false };
            this.setState({
                toDoList: [...this.state.toDoList, obj],
                toDo: '',
            });
        }
    }

    handleTaskComplete(index, event) {
        event.preventDefault();
        const toDoList = this.state.toDoList;
        toDoList[index].isComplete = !toDoList[index].isComplete;

        this.setState({
            toDoList: toDoList,
        });
    }

    handleLoginSubmit(username, password) {
        console.log('HAHAHAHA', username, password);
    }

    render() {
        let completedTask = 0;
        this.state.toDoList.forEach(task => task.isComplete === true ? completedTask++ : null);
        const taskList = this.state.toDoList.length > 0 ? this.state.toDoList.map((list, index) => (
            <li key={'list' + index}>
                <a href="#" onClick={this.handleTaskComplete.bind(this, index)} style={list.isComplete ? { textDecoration: 'line-through' } : null }>
                    {list.task}
                </a>
            </li>
        )) : null;
        return (
            <>
                <form>
                    <input
                        type="text"
                        id="form-todo"
                        name="toDo"
                        minLength="3"
                        placeholder="To do"
                        required
                        onChange={this.handleInputChange}
                        value={this.state.toDo}
                    />
                    <button type="submit" className="form-submit" onClick={this.handleSubmit}>Submit</button>
                </form>
                <div>
                    <h2>
                        {completedTask} task{completedTask > 1 ? 's': null} completed out of {this.state.toDoList.length}.
                    </h2>
                    <ul>
                        {taskList}
                    </ul>
                </div>
                <Login2/>
                <style>{`
                    .is-done {
                        text-decoration: line-through;
                    }
                `}</style>
            </>
        );
    }
}

export default ToDoTest2;