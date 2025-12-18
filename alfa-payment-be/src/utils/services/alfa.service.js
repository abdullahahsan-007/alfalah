import axios from "axios";
import CryptoJS from "crypto-js";

// 🔹 BASE URL
const BASE = "https://sandbox.bankalfalah.com";

// 🔹 AES KEYS (provided by bank)
const KEY1 = "buabMXbKEP5rE7Hv";          // Encryption key
const KEY2 = "2105376784022585";          // IV

// 🔹 STATIC MERCHANT CONFIG
const CONFIG = {
  ChannelId: "1002",
  MerchantId: "223804",
  StoreId: "437452",
  MerchantHash: "OUU362MB1uqehKjhFzQ2oxUP0D57r63DAus8b/e3z0xKxiQRAmnkjJ7vWGfCi+Hw",
  MerchantUsername: "faqoxu",
  MerchantPassword: "GOvnh5elf31vFzk4yqF7CA==",
  ReturnURL: "https://ostravel.pk/bookingconfirmation",
};

// 🔹 FUNCTION TO GENERATE AES HASH
export function generateRequestHash(payload) {
  // Convert object to query string
  const mapString = Object.keys(payload)
    .map(key => `${key}=${payload[key]}`)
    .join("&");

  // Encrypt string using AES
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(mapString),
    CryptoJS.enc.Utf8.parse(KEY1),
    {
      keySize: 128 / 8,
      iv: CryptoJS.enc.Utf8.parse(KEY2),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString();
}

/* =========================
   🤝 HANDSHAKE
========================= */
export const handshake = async (orderId) => {
  const payload = {
    HS_ChannelId: CONFIG.ChannelId,
    HS_MerchantId: CONFIG.MerchantId,
    HS_StoreId: CONFIG.StoreId,
    HS_ReturnURL: CONFIG.ReturnURL,
    HS_MerchantHash: CONFIG.MerchantHash,
    HS_MerchantUsername: CONFIG.MerchantUsername,
    HS_MerchantPassword: CONFIG.MerchantPassword,
    HS_TransactionReferenceNumber: orderId,
  };

  // Generate request hash
  payload.HS_RequestHash = generateRequestHash(payload);

  // Make API call
  const { data } = await axios.post(`${BASE}/HS/api/HSAPI/HSAPI`, payload);

  return data;
};

export const doTransaction = async ({
  orderId,
  authToken,
  amount,
  mobile,
  account,
  country,
  email,
}) => {
  // Create payload
  const payload = {
    ChannelId: CONFIG.ChannelId,
    MerchantId: CONFIG.MerchantId,
    StoreId: CONFIG.StoreId,
    MerchantHash: CONFIG.MerchantHash,
    MerchantUsername: CONFIG.MerchantUsername,
    MerchantPassword: CONFIG.MerchantPassword,
    ReturnURL: CONFIG.ReturnURL,
    Currency: "PKR",
    AuthToken: authToken,
    TransactionTypeId: "1",
    TransactionReferenceNumber: orderId,
    TransactionAmount: amount,
    MobileNumber: mobile,
    AccountNumber: account,
    Country: country,
    EmailAddress: email,
  };


  // ✅ Generate RequestHash including all fields
  payload.RequestHash = generateRequestHash(payload);

  // Send API request
  const { data } = await axios.post(`${BASE}/HS/api/Tran/DoTran`, payload);
  return data;
};
