
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./config";

// Authentication functions
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};
