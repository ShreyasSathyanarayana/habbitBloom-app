// import { supabase } from "@/lib/supabaseClient";

import { supabase } from "@/utils/SupaLegend";

// ✅ Step 1: Send OTP to the user's phone
export const sendOTP = async (phone: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) throw error;

    return { success: true, message: "OTP sent successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// ✅ Step 2: Verify OTP and log in the user
export const verifyOTP = async (phone: string, otp: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
