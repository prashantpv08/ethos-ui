import React, { useState, useEffect } from 'react';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

type ICheckoutSession = {
  clientSecret: string;
  stripeAccountId: string;
};
export default function CheckoutSession({
  clientSecret,
  stripeAccountId,
}: ICheckoutSession) {
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);

  useEffect(() => {
    const setupStripePromise = async () => {
      const stripePromiseInit = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_KEY as string,
        {
          stripeAccount: stripeAccountId,
        },
      );
      setStripePromise(await stripePromiseInit);
    };
    setupStripePromise();
  }, []);

  return (
    <div id="checkout">
      {stripePromise && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}
