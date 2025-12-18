import { useState } from "react";
import { createPayment, confirmPayment } from "../api/alfa";

export default function PaymentForm() {
  const [step, setStep] = useState("FORM");
  const [otp, setOtp] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    setLoading(true);
    try {
      const res = await createPayment({
        amount: 100,
        mobile: "03350464567",
        accountNumber: "930003009542301",
        email: "hia393@gmail.com",
      });


      console.log(res);

      setOrderId(res.data.orderId);
      setStep("OTP");
    } catch (err) {
      console.log(err)
    }
    setLoading(false);
  };

  const submitOTP = async () => {
    setLoading(true);
    try {
      await confirmPayment({
        orderId,
        otp,
      });

      alert("Payment Successful 🎉");
      setStep("DONE");
    } catch (err) {
      alert("OTP failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      {step === "FORM" && (
        <>
          <h2>Alfa Wallet Payment</h2>
          <button onClick={startPayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Rs. 100"}
          </button>
        </>
      )}

      {step === "OTP" && (
        <>
          <h2>Enter OTP</h2>
          <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
          <button onClick={submitOTP} disabled={loading}>
            Confirm
          </button>
        </>
      )}

      {step === "DONE" && <h2>Payment Completed ✅</h2>}
    </div>
  );
}
