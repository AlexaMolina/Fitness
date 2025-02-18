import React from "react";
import { useParams } from "react-router-dom";
import PayerBasic from "./PayerBasic";
import PayerStandard from "./PayerStandard";
import PayerPremium from "./PayerPremium";

const PaymentComponent = () => {
  const { planType } = useParams();

  return (
    <div>
      {planType === "basic" && <PayerBasic />}
      {planType === "standard" && <PayerStandard />}
      {planType === "premium" && <PayerPremium />}
    </div>
  );
};

export default PaymentComponent;
