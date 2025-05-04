import { Fragment, useState } from 'react'

import { ValidationError } from 'yup'
import accountStyles from '../../utils/style/Account'

import {
  Box, Container, Button, FormControl, Grid
} from '@mui/material';

import { transferValidate } from '../../utils/validate/Account';
import FormErrorText from '../Common/FormErrorText';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import PasswordField from '../Common/Field/PasswordField';
import TxtField from '../Common/Field/TxtField';
import { TransactionAPI } from '../../apis/transaction';


export default function Transfer(props) {
  const classes = accountStyles()
  const [values, setValues] = useState({
    email: '',
    amount: 0,
    password: '',
    description: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await transferValidate(values)
      values.destination = values.email;
      const response = await TransactionAPI.transfer(values);
      toast.success(response.message, { duration: 5000 });
      setTimeout(() => window.location.reload(), 3000)
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
    setValues({ ...values, [name]: value })
    setErrors(errors => ({ ...errors, [name]: null }))
  };

  return (
    <Fragment>
      <Container maxWidth="md" sx={{ my: 2 }} >
        {/* <Divider sx={{ mt: 1 }} /> */}
        <Box >

          <form onSubmit={handleSubmit}>
            {/* <div style={{ my: 2 }} className={classes.header}  >
              Transfer money
            </div> */}

            {/* <Button
              variant="contained"
              type="submit"
              disableElevation
              className={classes.button}
              sx={{ float: 'right', my: 3, background: "linear-gradient(#42a1ec,#0070c9)" }}
            >
              Pay
            </Button> */}

            <Grid container marginTop={1} spacing={2}>
              <Grid item md={6} xs={12}>
                <TxtField
                  name="email"
                  label="transfer by email"
                  fullWidth
                  error={errors.email}
                  handleChange={handleChange}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <TxtField
                    name="amount"
                    label="amount"
                    type='number'
                    default={1}
                    error={errors.amount}
                    handleChange={handleChange}
                  />
                  <FormErrorText error={errors.amount} />
                </FormControl>
              </Grid>
            </Grid>

            <FormControl sx={{ mt: 2, mb: 3 }} fullWidth>
              <TxtField
                handleChange={handleChange}
                label="what's this for?"
                name='description'
                default={values.description}
              />
            </FormControl>
            <FormControl fullWidth>
              <PasswordField
                handleChange={handleChange}
                label='password'
                name='password'
                type='password'
                error={errors.password}
              />
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              disableElevation
              
              sx={{ float: 'right', my: 2, width: '100%', background: "linear-gradient(#42a1ec,#0070c9)" }}
            >
              Pay
            </Button>
          </form>
        </Box>
        <Container sx={{ mb: 10 }}></Container>
      </Container>
    </Fragment>
  )
}