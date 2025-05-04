import { Fragment, useState } from 'react'

import { ValidationError } from 'yup'
import accountStyles from '../../utils/style/Account'
import { PayPalButtons } from "@paypal/react-paypal-js";

import {
  Box, Container, Button, FormControl, Typography,
} from '@mui/material';

import FormErrorText from '../Common/FormErrorText';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import TxtField from '../Common/Field/TxtField';
import Razorpay from './Razorpay';


export default function Recharge(props) {
  const classes = accountStyles()
  const [values, setValues] = useState({
    amount: 1,
    description: '',
    response: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await Razorpay(values, setValues)
      // toast.success(response, { duration: 6000 })
      // await transferValidate(values)
      // values.destination = values.email;
      // const response = await TransactionAPI.transfer(values);
      // setValues({
      //   email: '',
      //   amount: 0,
      //   password: '',
      // })
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
      {values.response ? toast.success(values.response, { duration: 6000 }) : null}

      <Container maxWidth="sm" sx={{ my: 2 }}  >
        <Box >


          <form onSubmit={handleSubmit}>
            {/* <div style={{ my: 2, float: 'left' }} className={classes.header}  >
              Recharge card
            </div> */}

            <FormControl fullWidth sx={{ mt: 2 }}>
              <TxtField
                name="amount"
                label="Amount"
                type='number'
                default={1}
                error={errors.amount}
                handleChange={handleChange}
              />
              <FormErrorText error={errors.amount} />
            </FormControl>
            <FormControl sx={{ my: 2 }} fullWidth>
              <TxtField
                name="description"
                label="Description"
                handleChange={handleChange}
              />
            </FormControl>

            <Typography variant='caption' sx={{ color: "#666666", letterSpacing: "-.01em" }}>
                e-Wallet does not track or store your payment methods, default currency used for transactions is &#8377;
              </Typography>


            <Button
              variant="contained"
              type="submit"
              disableElevation
              
              sx={{ float: 'right', my: 2, width: '100%', background: "linear-gradient(#42a1ec,#0070c9)" }}
            >
              Razorpay
            </Button>
            <PayPalButtons style={{ color: "gold", disableMaxWidth: true, height: 37, label: "paypal", layout: "horizontal", shape: "rect", tagline: false }} />
          
          </form>
        </Box>
      </Container>
    </Fragment>
  )
}