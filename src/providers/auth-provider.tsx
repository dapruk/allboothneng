import React from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { AuthError, Provider, Session, User } from "@supabase/supabase-js";

interface AuthReturn {
  success: boolean;
  data: {
    user?: User | undefined;
    session?: Session | null;
  } | null;
  message: string;
}

export interface AuthContextType {
  client: typeof supabaseClient;
  user: User | undefined;
  session: Session | null;
  isAuthenticated: boolean;
  isSignedIn: boolean;
  login: (username: string, password: string) => Promise<AuthReturn>;
  loginWithProviders: (provider?: Provider) => void;
  logout: () => Promise<AuthReturn>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const login = React.useCallback(
    async (username: string, password: string) => {
      try {
        const { data: getProfileData, error: getProfileError } =
          await supabaseClient
            .from("profiles")
            .select("email")
            .eq("username", username)
            .maybeSingle();

        if (getProfileError) {
          return {
            success: false,
            data: null,
            message: getProfileError?.message,
          };
        }

        const loginRes = await supabaseClient.auth.signInWithPassword({
          email: getProfileData?.email,
          password,
        });

        if (loginRes.error) {
          return {
            success: false,
            data: null,
            message: loginRes.error.message,
          };
        }

        setUser(loginRes.data.user);

        return {
          success: true,
          data: loginRes.data,
          message: "Login Successfully",
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          data: null,
          message: (err as AuthError).message,
        };
      }
    },
    [],
  );

  const loginWithProviders = React.useCallback(
    async (provider: Provider = "google") => {
      try {
        const loginRes = await supabaseClient.auth.signInWithOAuth({
          provider,
        });

        if (loginRes.error) {
          return {
            success: false,
            data: null,
            message: loginRes.error.message,
          };
        }

        return {
          success: true,
          data: loginRes.data,
          message: "Login Successfully",
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          data: null,
          message: (err as AuthError).message,
        };
      }
    },
    [],
  );

  const logout = React.useCallback(async () => {
    try {
      const logoutRes = await supabaseClient.auth.signOut();

      setSession(null);
      setUser(undefined);
      setIsSignedIn(false);

      if (logoutRes.error) {
        return { success: false, data: null, message: logoutRes.error.message };
      }

      return { success: true, data: null, message: "Logout Successfully" };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        data: null,
        message: (err as AuthError).message,
      };
    }
  }, []);

  React.useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data?.session);
      setUser(data?.session?.user);
    });

    const { data } = supabaseClient.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === "SIGNED_IN") {
          setIsSignedIn(true);
          setSession(newSession);
          setUser(newSession?.user);
        }
      },
    );

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = session ? true : false;

  return (
    <AuthContext.Provider
      value={{
        client: supabaseClient,
        user,
        session,
        isAuthenticated,
        isSignedIn,
        login,
        loginWithProviders,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
