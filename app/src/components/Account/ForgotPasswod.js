import { Fragment, useState } from 'react'
import { Avatar, Button, Divider, 
        TextField, Container, Link as MuiLink, 
        Typography, AppBar, Toolbar, Alert} from '@mui/material'


import { useAuthDispatch } from '../../context/auth'

import Box from '@mui/material/Box';
import accountStyles from '../../utils/style/Account'

import { Grid } from '@mui/material'


export default function ForgotPassword() {
    const classes = accountStyles()
    const [ values, setValues ] = useState({
        username: '',
    })

    const dispatch = useAuthDispatch();

    // const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    //   onError: (err) => {
    //     const serverErrors = err.graphQLErrors[0].extensions.errors
    //   },
    //   onCompleted(data) {
    //       dispatch({ type: 'LOGIN', payload: data.login })
    //       window.location.href = '/dashboard'
    //   },
    // })

    const handleSubmit = async (event) => {
      event.preventDefault()
      // loginUser({ variables: values })
    }

    return (
        <Fragment>
           <AppBar elevation={0} position="static" sx={{ bgcolor: "#232526" }}>
              <Toolbar variant="dense" >
                <Avatar alt="company logo" sx={{ height: 25, width: 25  }} src="https://res.cloudinary.com/chatql/image/upload/chat--v3_j7wurk.png" /> 
              </Toolbar>
            </AppBar>
    
            <Container maxWidth="sm" sx={{ p: 0 }}>
              <Toolbar variant="dense" >
                <Typography variant='body1' sx={{  color: "#000000", opacity: .88, fontWeight: 600, flexGrow: 1  }}>
                  Chat ID  
                </Typography>
                       
                <MuiLink variant="caption" underline="none" href="/account/login" sx={{  color: "#000000", opacity: .88, fontWeight: 500  }}>   
                  Sign in       
                </MuiLink>      
              </Toolbar>

              <Divider />
         
              <Box sx={{ mt: 3, p: 1, py:2, backgroundColor: "#ffffff"}}>
                <Alert icon={false} severity="info">
                  <Grid container my={2} spacing={1}>
                    <Grid item md={2} xs={3} sm={2} pt={0}>
                      <Avatar src="https://appleid.cdn-apple.com/iforgot/static/bin/cb7953610/dist/assets/profile.svg" sx={{ width: 70, height: 70 }}/>
                    </Grid>

                    <Grid item md={10} xs={9} sm={10} sx={{ p: 0}}>
                      <Typography sx={{ fontSize: "15px", color: '#6e6e73',
                        lineHeight: 1.42859,
                        fontWeight: 400,
                        letterSpacing: "-.016em",
                        fontFamily: "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif" }}
                      >
                        You have come to the right place to reset a forgotten password. For your security, 
                        we will ask you a few questions to verify that you are the owner of this account. 
                      </Typography>
                    </Grid>
                  </Grid>
                </Alert>

              <Container sx={{ px: 1}}>

                <div style={{ marginTop: '32px'}} className={classes.header }  >
                  Are you having trouble signing in?
                </div>
              
              <Typography  sx={{  mt: 5, 
        lineHeight: 1.16667,
        fontWeight: 500,
        letterSpacing: '.009em',
        color: '#1d1d1f',
        fontSize: '16px',
        }}  >
                Please enter you Chat ID to get started.
                </Typography>

                      <TextField
                      
                      sx={{ mt: 2, p: 0,}}
                        name="first"
                        label="Chat ID"
                        fullWidth
                        inputProps={{
                          style: {
                            height: "40.19px",
                            padding: '5px 12px',
                          },
                      }}
                      
                        />

                   

<Button variant="contained" type="submit" disableElevation className={classes.button} sx={{ mt: 4, mb: 5}}>
                      Continue
                  </Button>

               

      
</Container>
                    </Box>
        </Container>    
        
      </Fragment>
    )
}
