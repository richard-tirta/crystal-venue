import React, { useState } from "react";
import Login3 from './Login3'

export default function Login2() {
    
    const handleSubmit = (username, password) => {

        console.log('hello', username, 'hello', password);

        
    }

    return (<div>
        <Login3 onSubmit={handleSubmit}/>
          
      </div>);
}