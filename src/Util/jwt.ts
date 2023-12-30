import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";
import axios from "../config/axios";

const isValidToken = (accessToken: any) => {
  if (!accessToken) {
    return false;
  }
  const decoded: any = jwtDecode(accessToken);
  console.log(decoded.exp);
  const currentTime = Date.now() / 1000;
  console.log(currentTime);
  return decoded.exp > currentTime;
};



const setSession = (accessToken: any) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { verify, sign, isValidToken, setSession };
