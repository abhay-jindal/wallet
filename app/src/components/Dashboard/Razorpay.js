import { RazorpayAPI } from '../../apis/razorpay';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default async function Razorpay(props, setValues) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  // creating a new order
  try {
    const result = await RazorpayAPI.order({ amount: props.amount })

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { order_id, amount } = result;
    const options = {
      key: "rzp_test_0DqsVb6cb8KC42", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: 'INR',
      name: "e-Wallet Corp",
      description: props.description,
      image: 'https://res.cloudinary.com/chatql/image/upload/chat--v3_j7wurk.png',
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await RazorpayAPI.payment(data);
        setValues({ response: result.message })
      },
      prefill: {
        // name: "Soumya Dey",
        // email: "SoumyaDey@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#474E5A",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (err) {
    setValues({ response: 'Razorpay payment failed! Try again later.' })
  }
}
