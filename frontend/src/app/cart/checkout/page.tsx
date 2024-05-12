"use client"
/* eslint-disable */
import StripeContainer from "@/components/stripeComponent/stripeComponent";
import Checkout from "@/components/Checkout/Checkout";


export default function CheckoutWrapper() {
    return (
      <StripeContainer>
        <Checkout />
      </StripeContainer>
    );
  }
