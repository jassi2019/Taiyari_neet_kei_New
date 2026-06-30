type TEnv = {
  backendUrl: string;
  razorpayKeyId: string;
};

const env: TEnv = {
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || "",
  razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || "",
};

export default env;
