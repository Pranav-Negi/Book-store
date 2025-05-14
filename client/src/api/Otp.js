import { Axios } from './Axios';

export const sendOtp = async (email) => {
  try {
    const response = await Axios.post("otp/send_otp", { email });
    return response;
  } catch (error) {
    throw error;
  }
}
export const verifyOtp = async (email, otp) => {
  try {
    const response = await Axios.post("otp/verify_otp", { email, otp });
    return response;
  } catch (error) {
    throw error;
  }
}