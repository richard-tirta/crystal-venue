import React, { useState } from "react";

export default function Login2(props) {
    const [isVisible, togglePasswordVis] = useState(false);
    const [formData, handleFormChange] = useState({ userName: '', password: '' });
    
    const handleSubmit = (event) => {
        event.preventDefault();
        // onSubmit.username ? alert('hmmm', onSubmit.userName): null;
        // onSubmit.password ? handleFormChange({...formData, password: onSubmit.password}) : null;
        //onSubmit.userName = formData.userName;
        //onSubmit.password = formData.password;
        //props.onSubmit(formData.userName, formData.password);
        props.onSubmit(formData.userName, formData.password);

        
    }

    return (<div>
        <form onSubmit={handleSubmit}>
    
        <input type="text" id="username-input" name="username" minLength="5" placeholder="Username" required
            onChange={event => handleFormChange({...formData, userName: event.target.value})} value={formData.userName}
        />
        <input type="password" id="password-input" name="password" minLength="5" placeholder="Password" required 
            onChange={event => handleFormChange({...formData, password: event.target.value})} value={formData.password}
        />
        <button id="login-button" disabled={!formData.userName ||!formData.password ? true : false}>
            Submit
        </button>
          </form>
          
      </div>);
}