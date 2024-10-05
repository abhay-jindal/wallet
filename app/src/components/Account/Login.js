import { Fragment, useState } from 'react'
import {
  Avatar, Button, Divider, FormControl,
  Container, Typography
} from '@mui/material'

import { useAuthDispatch } from '../../context/auth'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box';
import { ValidationError } from 'yup';
import accountStyles from '../../utils/style/Account'
import { loginValidate } from '../../utils/validate/Account';

import toast from 'react-hot-toast'
import { CustomerAPI } from '../../apis/customer'
import { AxiosError } from 'axios'
import TxtField from '../Common/Field/TxtField'
import PasswordField from '../Common/Field/PasswordField'

import ReCAPTCHA from "react-google-recaptcha"
import React, { useRef } from 'react'


export default function Login(props) {
  const classes = accountStyles()
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const captchaRef = useRef(null);
  const [errors, setErrors] = useState({})
  const dispatch = useAuthDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      values.captcha = captchaRef.current.getValue();
      captchaRef.current.reset();

      await loginValidate(values)
      const response = await CustomerAPI.get(values)
      dispatch({ type: 'LOGIN', payload: response })
    } catch (err) {
      if (err instanceof ValidationError) {
        var e = {}
        err.inner.forEach(({ path, message }) => {
          e[path] = message
          if (path === 'captcha') toast.error(message, { duration: 6000 });
        })
        setErrors(e)
      } else if (err instanceof AxiosError) {
        const error = err.response.data;
        toast.error(`${err.response.statusText} - ${error.message}`, { duration: 6000 });
      }
    }
  }

  const handleChange = (event) => {
    let { name, value } = event.target
    setValues({ ...values, [name]: value.trim() })
    setErrors(errors => ({ ...errors, [name]: null }))
  };

  return (
    <Fragment>

      <Container maxWidth="sm" className={classes.body} sx={{ mt: 9 }}>
        <Box className={classes.accountBox} >

          <Container align='center'>
            <Avatar src="https://res.cloudinary.com/chatql/image/upload/person_n65lbm.png" sx={{ width: 70, height: 70 }} />
            <Typography className={classes.header} >
              Sign in to e-Wallet
            </Typography>
          </Container>

          <form autoComplete='off' onSubmit={handleSubmit}>

            <FormControl sx={{ mt: 3 }} fullWidth >
              <TxtField
                handleChange={handleChange}
                label="email"
                name="email"
                autoFocus
                error={errors.email}
              />
            </FormControl>

            <FormControl sx={{ my: 3 }} fullWidth >
              <PasswordField
                handleChange={handleChange}
                label='password'
                name='password'
                error={errors.password}
              />
            </FormControl>

            <FormControl sx={{ mb: 3, alignItems: 'center' }} fullWidth >
              <ReCAPTCHA sitekey='6LcgdEwpAAAAANriCXwPDx2EDHhovBUTjjAsHXE4' ref={captchaRef} />
            </FormControl>

            <Button className={classes.button} onClick={() => props.changeAction('REGISTER')} >
              Create account
            </Button>
            <Button
              variant="contained"
              type="submit"
              disableElevation
              className={classes.button}
              sx={{ float: 'right', background: "linear-gradient(#42a1ec,#0070c9)" }}
            >
              Sign In
            </Button>
          </form>

          <Container sx={{ mt: 4, textAlign: 'center' }}>
            <Divider variant='middle' sx={{ mb: 1.5 }} />
            <Link to="/password/verify" className={classes.forgotLink} >
              Forgotten your password?
            </Link>
          </Container>
        </Box>
      </Container>
    </Fragment>
  )
}
