// components/StripeContainer.js
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const StripeContainer = ({ children }: any) => {
  const stripePromise = loadStripe('your stripe public key');

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeContainer;
