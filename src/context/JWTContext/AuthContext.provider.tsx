import React, { createContext, useEffect, useReducer, useMemo } from "react"

import { useRouter } from "next/navigation"
import axios from "../../config/axios"
import { isValidToken, setSession } from "../../Util/jwt"
import AuthReducer from "./AuthContext.reducer"
import { Alert } from "@mui/material"

// Note: If you're trying to connect JWT to your own backend, don't forget
// to remove the Axios mocks in the `/src/pages/_app.js` file.

const INITIALIZE = "INITIALIZE"
const SIGN_IN = "SIGN_IN"
const SIGN_OUT = "SIGN_OUT"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const illegalStateFunction = (...args: any) => {
  throw new Error("You must wrap your components in <AuthProvider />")
}
// let accessToken:any
// if (typeof window !== "undefined") {
//     accessToken = localStorage.getItem("accessToken") || ""
//   }
const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: {},
  signIn: illegalStateFunction,
  signOut: illegalStateFunction,
  signUp: illegalStateFunction,
  resetPassword: illegalStateFunction,
}

export const AuthContext = createContext(initialState)

interface AuthProviderProps {
  children: React.ReactNode
}

export const useAuth = () => React.useContext(AuthContext)
export default function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      try {
        // localStorage.getItem('login')
        if (localStorage.getItem("login")) {
          const info: any = JSON.parse(localStorage.getItem("login") || "")

          const { token, data } = info

          dispatch({
            type: INITIALIZE,
            payload: {
              isInitialized: true,
              user: {data ,token},
            
            },
          })
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isInitialized: false,
              user: null,
            },
          })
        }
      } catch (err) {
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        })
      }
    }

    initialize()
  }, [])

    const signIn = async (email: any, password: any) => {
      try {
        const response = await axios.post("/api/user/login", {
          email,
          password,
        })

        const { token, data } = response.data
        localStorage.setItem("login", JSON.stringify(response.data))
        setSession(token)
        dispatch({
          type: SIGN_IN,  
          payload: {
            user: {data ,token},
            isAuthenticated: true,
          },
        })

        //  response;
        return router.push("/")
      } catch (err: any) {
        console.log(err, "errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
      alert("Invalid email or invalid password please try again");
        dispatch({
          type: SIGN_IN,
          payload: {
            isAuthenticated: false,
            validationErrors: err.error,
          },
        })
      }
    }

  const signOut = async () => {
    setSession(null)
    dispatch({ type: SIGN_OUT })
    
    localStorage.setItem("login", "logout")
   
  }
  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          ...state,
          method: "jwt",
          signIn,
          signOut,
        }),
        [state]
      )}
    >
      {children}
    </AuthContext.Provider>
  )
}
