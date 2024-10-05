import { InputAdornment, TextField } from "@mui/material";

export default function TxtField(props) {
    return (
        <TextField
            onBlur={props.handleChange}
            label={props.label}
            name={props.name}
            autoFocus={props.autoFocus}
            type={props.type || 'text'}
            defaultValue={props.default}
            inputProps={props.inputProps}
            fullWidth={props.fullWidth}
            error={props.error ? true : false} 
        />
    )
}