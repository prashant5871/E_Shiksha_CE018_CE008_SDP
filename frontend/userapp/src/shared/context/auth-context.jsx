import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userMail: null,
  login: () => {},
  logout: () => {},
  isStudent : true,
  setIsStudent : () => {},
  token: null,
  user : null,
  isEnabled : false
});
