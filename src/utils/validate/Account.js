import * as yup from 'yup';

const loginSchema = yup.object().shape({
    email: yup.string().email('Enter a valid email address.').required(),
    password: yup.string().required(),
    captcha: yup.string().required('Error verifying reCAPTCHA!!'),
});

const registerSchema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email('Enter a valid email address.').required(),
    password: yup.string()
      .required()
      .min(8)
      .matches(RegExp('(.*[a-z].*)'), 'Lowercase')
      .matches(RegExp('(.*[A-Z].*)'), 'Uppercase')
      .matches(RegExp('(.*\\d.*)'), 'Number')
      .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), 'Special')
      // .matches(
      //   /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      //   "second match"
})

const transferSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email address.').required(),
  amount: yup.number().positive().required().min(1).max(5000),
  password: yup.string().required()
});


function loginValidate(values) {
  console.log(values)
    return loginSchema.validate(values, { abortEarly: false });
}

function registerValidate(values) {
  return registerSchema.validate(values, { abortEarly: false });
}

function transferValidate(values) {
  return transferSchema.validate(values, { abortEarly: false });
}

export { loginValidate, registerValidate, transferValidate };

