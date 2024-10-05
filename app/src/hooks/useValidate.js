import { useEffect, useState } from "react";


export default function useValidate(callback, initialValues, errorValues) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(errorValues || {});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = event => {
        event.preventDefault();
        // setErrors(Validate(values)); 
        setSubmitted(true);   
    };

    
    const handleChange = (event) => {
        let { name, value } = event.target
       
        
        setValues(values => ({ ...values, [name]: value }))
        // setErrors(errors => ( { ...errors, [name]: null } ))
    };

    useEffect(() => {
        if (Object.keys(errors).length === 0 && submitted) {
            callback( { variables: values});
        };
    }, [submitted, errors]);

    return { handleChange, handleSubmit, values, errors }

}