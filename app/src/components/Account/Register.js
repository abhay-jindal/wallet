import { Fragment, useState } from 'react'

import { ValidationError } from 'yup'
import accountStyles from '../../utils/style/Account'

import {
  Box, Container, Button, FormControl, Typography, 
  Grid, Divider, Link
} from '@mui/material';

import PasswordTooltip from '../Common/PasswordTooltip';
import { passwordInfo } from '../Common/TooltipInfo';
import { registerValidate } from '../../utils/validate/Account';
import FormErrorText from '../Common/FormErrorText';
import toast from 'react-hot-toast';
import { CustomerAPI } from '../../apis/customer';
import { AxiosError } from 'axios';
import PasswordField from '../Common/Field/PasswordField';
import TxtField from '../Common/Field/TxtField';


export default function Register(props) {
  const classes = accountStyles()
  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [showTip, setShowTip] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await registerValidate(values)
      await CustomerAPI.create(values);
      toast.success('Account registered successfully!', { duration: 6000 });
      props.changeAction('LOGIN')
    } catch (err) {
      if (err instanceof ValidationError) {
        let e = {}
        err.inner.forEach(({ path, message }) => e[path] = message)
        setErrors(e)
      } else if (err instanceof AxiosError) {
        const error = err.response.data;
        toast.error(`${err.response.statusText} - ${error.message}`, { duration: 6000 });
      }
    }
  }

  const handleChange = (event) => {
    let { name, value } = event.target
    setShowTip(false)
    setValues({ ...values, [name]: value })
    setErrors(errors => ({ ...errors, [name]: null }))
  };

  return (
    <Fragment>

      <Container maxWidth="sm" sx={{ my: 6 }} className={classes.body} >
        <Box className={classes.accountBox} >
          <Typography align='center' className={classes.header}>
            Create your e-Wallet account
          </Typography>

          <Container sx={{ mt: 1, textAlign: 'center' }}>
            Already have an account?
            <Link href="/account/login" paddingLeft={1} underline="hover" >
              Find it here
            </Link>
          </Container>

          <form onSubmit={handleSubmit}>
            <Grid container marginTop={1} spacing={2}>
              <Grid item md={6} xs={12}>
                <TxtField
                  name="first_name"
                  label="first name"
                  autoFocus
                  fullWidth
                  inputProps={{ style: { textTransform: 'capitalize' } }}
                  error={errors.first_name}
                  handleChange={handleChange}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <TxtField
                    name="last_name"
                    label="last name"
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    error={errors.last_name}
                    handleChange={handleChange}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <FormControl sx={{ mt: 3 }} fullWidth >
              <TxtField
                handleChange={handleChange}
                label="name@example.com"
                name="email"
                error={errors.email}
              />
              <FormErrorText error={errors.email} />
            </FormControl>

            <PasswordTooltip open={showTip} title={passwordInfo()} >
              <FormControl sx={{ mt: 2 }} fullWidth >
                <PasswordField
                  setShowTip={setShowTip}
                  handleChange={handleChange}
                  label='password'
                  name='password'
                  type='password'
                  error={errors.password}
                />
              </FormControl>
            </PasswordTooltip>

            <Divider sx={{ mt: 3 }} />

            <Container align='center'>
              <Box
                component="img"
                align='center'
                sx={{ mt: 3, height: 35, width: 45 }}
                alt="privacy icon"
                src="https://res.cloudinary.com/chatql/image/upload/privacy-icon_kdoel8.png"
              />
              <br />
              <Typography variant='caption' sx={{ mt: 1, color: "#666666", letterSpacing: "-.01em" }}>
                Your e-Wallet email information is used to allow you to sign in securely and access your data.
                e-Wallet records certain usage data for security and support purposes.
              </Typography>
            </Container>

            <Button sx={{ my: 3 }} variant="text" className={classes.button} onClick={() => props.changeAction('LOGIN')} >
              Sign in instead
            </Button>

            <Button
              variant="contained"
              type="submit"
              disableElevation
              className={classes.button}
              sx={{ float: 'right', my: 3, background: "linear-gradient(#42a1ec,#0070c9)" }}
            >
              Continue
            </Button>
          </form>
        </Box>
      </Container>
    </Fragment>
  )
}