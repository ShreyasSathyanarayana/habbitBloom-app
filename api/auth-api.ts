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

export const updatePassword = async (password: string) => {
  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Check if user is signed in
  if (!user || userError) {
    throw new Error("You need to be signed in to update your password.");  
  }

  // Attempt to update the password
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.log("Update Password Error:", error.status, error.message);

    // Custom error messages based on Supabase response
    const errorMessages: Record<string, string> = {
      "400": "Invalid password format. Please choose a stronger password.",
      "401": "Session expired. Please sign in again to update your password.",
      "403": "You don't have permission to change this password.",
      "429": "Too many attempts. Try again later.",
      "Invalid login credentials": "Incorrect current password. Please try again.",
    };

    // Find a matching error message or use a default
    const customMessage =
      
      errorMessages[error.status?.toString()||""] ||errorMessages[error.message] ||
      "Failed to update password. Please try again.";

    throw new Error(customMessage);
  }

  return data; // Return only necessary data
};



export const signIn = async (email: string, password: string) => {
  console.log(email,password);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Login Error:", error.status, error.message);

    // Custom error messages based on Supabase error responses
    const errorMessages: Record<string, string> = {
      "400": "No account found. Please sign up first.",
      "401": "Unauthorized access. Please check your credentials.",
      "403": "Access denied. Contact support if this is a mistake.",
      "429": "Too many login attempts. Try again later.",
       "Invalid login credentials": "Incorrect email or password. Try again.",
      "Email not confirmed": "Please confirm your email before signing in.",
    };

    // Check if the error message exists in our custom map
    const customMessage =  errorMessages[error.status?.toString()||""] ||errorMessages[error.message] || "An unexpected error occurred.";

    throw new Error(customMessage);
  }

  return data; // Return only user data
};

