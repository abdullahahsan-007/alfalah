import express from "express";
import { handshake, doTransaction } from "../utils/services/alfa.service.js";

const router = express.Router();

router.post("/create-payment", async (req, res) => {
  try {
    const orderId = `TEST-${Date.now()}`;
    console.log("🧾 ORDER ID:", orderId);

    const authToken = await handshake(orderId);

    const parsedAuth = JSON.parse(authToken); // ✅ FIXED

    const txnResponse = await doTransaction({
      orderId,
      authToken: parsedAuth.AuthToken,
      amount: "100",
      mobile: "03115148471",
      account: "930003009542301",
      country: "164",
      email: "abbbas@gmail.com",
    });

    console.log("Transaction response:", txnResponse);

    return res.json({
      success: true,
      orderId,
      message: "OTP sent to customer",
      txnResponse,
    });

  } catch (err) {
    console.error("❌ PAYMENT ERROR:", err); // add this

    res.status(500).json({
      success: false,
      error: "Payment initiation failed",
    });
  }
});


router.post("/confirm-payment", (req, res) => {
  res.json({
    success: true,
    message: "OTP verification will be added next",
  });
});

router.post("/listener", (req, res) => {
  console.log("🔔 IPN RECEIVED:", req.body);
  res.sendStatus(200);
});

export default router;
