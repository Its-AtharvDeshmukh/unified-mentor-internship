import { createContext, useContext, useState } from "react";
import {
  readAccounts,
  registerAccount,
  signInAccount,
  removeAccount,
} from "../lib/auth";
const AuthContext = createContext(null);
const sessionKey = "haven-demo-session-v1";
const guest = { id: "demo", name: "Alex Morgan", email: "", role: "guest" };
function restoreSession() {
  try {
    const id = sessionStorage.getItem(sessionKey);
    if (id === "demo") return guest;
    const a = readAccounts().find((a) => a.id === id);
    return a
      ? { id: a.id, name: a.name, email: a.email, role: "member" }
      : null;
  } catch {
    return null;
  }
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreSession);
  const enter = (account) => {
    try {
      sessionStorage.setItem(sessionKey, account.id);
    } catch {
      /* In-memory sessions still work if storage is blocked. */
    }
    setUser(account);
  };
  const login = async (email, password) => {
    const account = await signInAccount(email, password);
    window.location.hash = "dashboard";
    enter(account);
  };
  const register = async (form) => {
    const account = await registerAccount(form);
    window.location.hash = "users";
    enter(account);
  };
  const logout = () => {
    try {
      sessionStorage.removeItem(sessionKey);
    } catch {
      /* Already signed out in memory. */
    }
    setUser(null);
    window.location.hash = "signin";
  };
  const deleteAccount = () => {
    if (user && user.role !== "guest") removeAccount(user.id);
    logout();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        enterDemo: () => {
          window.location.hash = "dashboard";
          enter(guest);
        },
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
