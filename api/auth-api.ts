// import { supabase } from "@/lib/supabaseClient";

import { supabase } from "@/utils/SupaLegend";

// ✅ Step 1: Send OTP to the user's phone
export const sendOTP = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({ email, });

  if (error) {
    console.error("Error sending OTP:", error.message);
    return false;
  }

  console.log("OTP sent successfully!");
  return true;
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
    throw { message: "You need to be signed in to update your password.", type: "warning" };
  }

  // Attempt to update the password
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.log("Update Password Error:", error.status, error.message);

    // Custom error messages based on Supabase response
    const errorMessages: Record<string, { message: string; type: "danger" | "warning" }> = {
      "400": { message: "Invalid password format. Please choose a stronger password.", type: "warning" },
      "401": { message: "Session expired. Please sign in again to update your password.", type: "danger" },
      "403": { message: "You don't have permission to change this password.", type: "danger" },
      "429": { message: "Too many attempts. Try again later.", type: "warning" },
      "Invalid login credentials": { message: "Incorrect current password. Please try again.", type: "danger" },
    };

    // Get a custom error message or a default one
    const customError =
      errorMessages[error.message] ||
      errorMessages[error.status?.toString() || ""] || {
        message: error.message,
        type: "warning",
      };

    throw customError;
  }

  return data; // Return only necessary data
};




export const signIn = async (email: string, password: string) => {
  // console.log(email, password);

  // Step 1: Check if the email exists in the database
  const { data: userExists, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();
  console.log(userExists,userError);
  
  if (!userExists) {
    throw { message: "No account found. Please sign up first.", type: "warning" };
  }

  // Step 2: Attempt sign-in with password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Login Error:", error.status, error.message);

    const errorMessages: Record<string, { message: string; type: "danger" | "warning" }> = {
      "401": { message: "Unauthorized access. Please check your credentials.", type: "danger" },
      "403": { message: "Access denied. Contact support if this is a mistake.", type: "danger" },
      "429": { message: "Too many login attempts. Try again later.", type: "warning" },
      // "Invalid login credentials": { message: "Incorrect password. Try again.", type: "danger" },
      "Email not confirmed": { message: "Please confirm your email before signing in.", type: "warning" },
    };

    const customError =
      errorMessages[error.message] ||
      errorMessages[error.status?.toString() || ""] || {
        message: error.message,
        type: "danger",
      };

    throw customError; // Throw the custom error object
  }

  return data;
};

