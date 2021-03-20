import React, { useState } from "react";

export default function Login(props) {
    const [isVisible, togglePasswordVis] = useState(false);
    const [formData, handleFormChange] = useState({ userName: '', email: '', password: '' });
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('do fetch here', formData);
    }

    return (
        <section className="profile-section">
            <form onSubmit={handleSubmit}>
                <input type="text" id="form_login_username" className="form-input" name="username" minLength="5" maxLength="35" placeholder="Username" required
                    onChange={event => handleFormChange({ ...formData, userName: event.target.value })} value={formData.userName}  />
                
                <input type="email" id="form_login_email" className="form-input" name="email" minLength="5" maxLength="35" placeholder="Email" required
                onChange={event => handleFormChange({ ...formData, email: event.target.value })} value={formData.email}  />
                <input
                    type={isVisible ? 'text' : 'password'}
                    id="form_login_password"
                    className="form-input"
                    name="password"
                    minLength="5"
                    maxLength="35"
                    placeholder="Password"
                    required
                    onChange={event => handleFormChange({ ...formData, password: event.target.value })}
                    value={formData.password}
                />

                <a href="#" className="form-submit" onClick={e => togglePasswordVis(!isVisible)}>Toggle Password Display</a>
                <button className="form-submit">Submit</button>
             </form>
         </section>
    );
}