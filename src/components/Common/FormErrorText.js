import { FormHelperText, Typography } from "@mui/material";
import accountStyles from "../../utils/style/Account";

export default function FormErrorText(props) {
    const classes = accountStyles()
    return (
        <FormHelperText style= {{ marginLeft: 0 }} >
            {props.error ? 
                <Typography className={classes.errorText} >
                    {props.error} 
                </Typography>
                : ''
            }
        </FormHelperText>
    )
}