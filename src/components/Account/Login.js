import React, { useRef, useState, Fragment } from 'react';
import {
  Avatar, Button, Divider, FormControl,
  Container, Typography, Box
} from '@mui/material';

import { useAuthDispatch } from '../../context/auth';
import { Link } from 'react-router-dom';

import { ValidationError } from 'yup';
import { AxiosError } from 'axios';

import toast from 'react-hot-toast';
import ReCAPTCHA from "react-google-recaptcha";

import accountStyles from '../../utils/style/Account';
import { loginValidate } from '../../utils/validate/Account';
import { CustomerAPI } from '../../apis/customer';

import TxtField from '../Common/Field/TxtField';
import PasswordField from '../Common/Field/PasswordField';

export default function Login({ changeAction }) {
  const classes = accountStyles();
  const dispatch = useAuthDispatch();
  const captchaRef = useRef(null);

  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const captchaValue = captchaRef.current.getValue();
      if (!captchaValue) {
        throw new ValidationError([{ path: 'captcha', message: 'Please complete the CAPTCHA' }]);
      }

      captchaRef.current.reset();
      const data = { ...values, captcha: captchaValue };

      await loginValidate(data);
      const response = await CustomerAPI.get(data);
      dispatch({ type: 'LOGIN', payload: response });

    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors = {};
        err.inner.forEach(({ path, message }) => {
          fieldErrors[path] = message;
          if (path === 'captcha') toast.error(message, { duration: 6000 });
        });
        setErrors(fieldErrors);
      } else if (err instanceof AxiosError) {
        const { statusText, data } = err.response;
        toast.error(`${statusText} - ${data.message}`, { duration: 6000 });
      } else {
        toast.error('Something went wrong. Please try again.', { duration: 6000 });
      }
    }
  };

  return (
    <Fragment>
      <Container maxWidth="sm" className={classes.body} sx={{ mt: 9 }}>
        <Box className={classes.accountBox}>
          <Container align='center'>
            <Avatar 
              src="https://res.cloudinary.com/chatql/image/upload/person_n65lbm.png"
              sx={{ width: 70, height: 70 }}
              alt="User Avatar"
            />
            <Typography variant="h6" className={classes.header}>
              Sign in to e-Wallet
            </Typography>
          </Container>

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <TxtField
                name="email"
                label="Email"
                autoFocus
                error={errors.email}
                handleChange={handleChange}
              />
            </FormControl>

            <FormControl fullWidth sx={{ my: 3 }}>
              <PasswordField
                name="password"
                label="Password"
                error={errors.password}
                handleChange={handleChange}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3, alignItems: 'center' }}>
              <ReCAPTCHA
                sitekey='6LcgdEwpAAAAANriCXwPDx2EDHhovBUTjjAsHXE4'
                ref={captchaRef}
              />
            </FormControl>

            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
              <Button
                className={classes.button}
                onClick={() => changeAction('REGISTER')}
              >
                Create account
              </Button>

              <Button
                type="submit"
                variant="contained"
                disableElevation
                className={classes.button}
                sx={{ background: "linear-gradient(#42a1ec,#0070c9)" }}
              >
                Sign In
              </Button>
            </Box>
          </form>

          <Container sx={{ mt: 4, textAlign: 'center' }}>
            <Divider variant="middle" sx={{ mb: 1.5 }} />
            <Link to="/password/verify" className={classes.forgotLink}>
              Forgotten your password?
            </Link>
          </Container>
        </Box>
      </Container>
    </Fragment>
  );
}
