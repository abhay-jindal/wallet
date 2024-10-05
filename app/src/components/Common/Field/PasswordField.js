import { TextField } from "@mui/material";

export default function PasswordField(props) {
    const setShowTip = () => {
        if (props?.setShowTip) props.setShowTip(true)
    }

    return (
        <TextField
            onClick={setShowTip}
            onBlur={props.handleChange}
            label={props.label}
            name={props.name}
            type='password'
            // inputProps={{
            //     autocomplete: "new-password",
            //   }}
            error={props.error ? true : false} 
        />
    )
}