import { useState } from "react";
import { LoginFormSchema, RegisterFormSchema } from "@/types/auth";
import { supabaseClient } from "@/lib/supabase-client";

export function useLoginFn() {
  const [loading, setLoading] = useState(false);

  const loginUser = async (value: LoginFormSchema) => {
    try {
      setLoading(true);

      const { data: getProfileData, error: getProfileError } =
        await supabaseClient
          .from("profiles")
          .select("email")
          .eq("username", value.username)
          .maybeSingle();

      if (getProfileError) {
        return { error: { message: getProfileError?.message } };
      }

      const { data: authData, error: authError } =
        await supabaseClient.auth.signInWithPassword({
          email: getProfileData?.email,
          password: value.password,
        });

      if (authError) {
        return { error: { message: authError?.message } };
      }

      return { data: { authData }, error: null };
    } catch (e) {
      return { error: { message: e } };
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading };
}

export function useLogoutFn() {}

export function useRegisterFn() {
  const [loading, setLoading] = useState(false);

  const registerUser = async (value: RegisterFormSchema) => {
    const fileExt = value.image?.name.split(".").pop();
    const fileName = `${value.username}-${crypto.randomUUID()}.${fileExt}`;

    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabaseClient.auth.signUp({
          email: value.email,
          password: value.password,
          options: {
            data: {
              full_name: value.name,
              username: value.username,
              avatar_url: value.image ? fileName : null,
              email: value.email,
            },
          },
        });

      if (authError) {
        return { error: { message: authError?.message } };
      }

      if (value.image) {
        console.log("Uploading file to storage", value.image);
        const { data: _storageData, error: storageError } =
          await supabaseClient.storage
            .from("avatars")
            .upload(fileName, value.image);

        if (storageError) {
          console.log("storageError", storageError);
          return { error: { message: storageError?.message } };
        }
      }

      return { data: { authData }, error: null };
    } catch (e) {
      return { error: { message: e } };
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading };
}

export function useForgotPasswordFn() {
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (error) {
        return { error: { message: error?.message } };
      }

      return { data, error: null };
    } catch (e) {
      return { error: { message: e } };
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
}

export function useResetPasswordFn() {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        return { error: { message: error?.message } };
      }

      return { data, error: null };
    } catch (e) {
      return { error: { message: e } };
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}
