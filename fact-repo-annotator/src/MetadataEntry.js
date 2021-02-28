import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';


function MetadataEntry(props) {

    const [theValue, setTheValue] = useState(props.key_value);

    const handleChange = (event) => {
            setTheValue(event.target.value);
            let key = event.target.name
            let newValue = event.target.value
            props.handler(key, newValue);
        }

    return (
        <Form.Input name={props.key_name} label={props.key_name} placeholder={props.key_name} value={theValue} width={16} onChange={handleChange}/>
    )
}

export default MetadataEntry;
