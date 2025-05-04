import { AppBar, Avatar, Divider, Link, Toolbar, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import Login from "../components/Account/Login";
import Register from "../components/Account/Register";


export default function Account({ match }) {
    const state = match?.params?.action.toUpperCase() || 'LOGIN'
    const [ action, setAction ] = useState( state === 'LOGIN' ? 'LOGIN' : 'REGISTER')

    /* change login, register component on the basis of action state defined above */
    const switchAuthComponent = () => {
        switch (action) {
            case 'LOGIN':
                return <Login changeAction={setAction}/>
            case 'REGISTER':
                return <Register changeAction={setAction}/>
            default:
                return 
        }
    }

    return (
        <Fragment>
            <AppBar elevation={0} position="static" sx={{ bgcolor: "#232526" }}>
                <Toolbar variant="dense" >
                    <Avatar alt="Remy Sharp" sx={{ height: 25, width: 25 }}src="https://res.cloudinary.com/chatql/image/upload/chat--v3_j7wurk.png" /> 
                </Toolbar>
            </AppBar>
            
            {switchAuthComponent()}
        </Fragment>    
    )
}

