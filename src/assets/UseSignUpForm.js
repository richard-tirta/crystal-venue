import React, {useState} from "react";
import ErrorBoundary from './ErrorBoundary'

const useSignUpForm = (initialValues, callback) => {
    console.log('HELLO', initialValues);
    const [inputs, setInputs] = useState(initialValues);
    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        callback();
    }

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    }
    return handleSubmit, handleInputChange, inputs;
}

export default useSignUpForm;