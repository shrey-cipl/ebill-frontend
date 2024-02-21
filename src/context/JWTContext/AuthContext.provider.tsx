import React, { createContext, useEffect, useReducer, useMemo } from "react"

import { useRouter } from "next/navigation"
import axios from "../../config/axios"
import { isValidToken, setSession } from "../../Util/jwt"
import AuthReducer from "./AuthContext.reducer"
import { usePathname } from "next/navigation"

const INITIALIZE = "INITIALIZE"
const SIGN_IN = "SIGN_IN"
const SIGN_OUT = "SIGN_OUT"
const SIGN_IN_FOR = "SIGN_IN_FOR"
const SIGN_OUT_FOR = "SIGN_OUT_FOR"

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
  signOutFor: illegalStateFunction,
  signUp: illegalStateFunction,
  signInFor: illegalStateFunction,
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

  const pathname = usePathname()

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
              user: { data, token },
            },
          })
        } else {
          //http://localhost:3000/resetpassword
          // /resetpassword]

          dispatch({
            type: INITIALIZE,
            payload: {
              isInitialized: false,
              user: null,
            },
          })
          // console.log("logout");
          {
            pathname == "/Forgot" ||
            pathname == "/resetpassword" ||
            pathname == "/FormersLogin"
              ? null
              : router.push("/login")
          }
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
          user: { data, token },
          isAuthenticated: true,
        },
      })

      //  response;
      return router.push("/")
    } catch (err: any) {
      //   console.log(err, "errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
      // alert("Invalid email or invalid password please try again");
      dispatch({
        type: SIGN_IN,
        payload: {
          isAuthenticated: false,
          validationErrors: err.error,
        },
      })
      return err
    }
  }
  const signInFor = async (email: any, password: any) => {
    try {
      const response = await axios.post("/api/former/login", {
        email,
        password,
      })
      // console.log(response.data.data.firstTimeLogin, "response")
      if (response.data.data.firstTimeLogin) {
        console.log()
        router.push("/passwordReset")
      } else {
        router.push("/")
      }
      const { token, data } = response.data
      localStorage.setItem("login", JSON.stringify(response.data))
      setSession(token)
      dispatch({
        type: SIGN_IN_FOR,
        payload: {
          user: { data, token },
          isAuthenticated: true,
        },
      })

      //  response;
    } catch (err: any) {
      //   console.log(err, "errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
      // alert("Invalid email or invalid password please try again");
      dispatch({
        type: SIGN_IN,
        payload: {
          isAuthenticated: false,
          validationErrors: err.error,
        },
      })
      return err
    }
  }
  const signOut = async () => {
    setSession(null)
    // console.log("Current Path:", pathname)
    router.push("/login")
    dispatch({ type: SIGN_OUT })

    // localStorage.setItem("login", "logout")
    localStorage.removeItem("login")
  }
  const signOutFor = async () => {
    setSession(null)
    // console.log("Current Path:", pathname)
    router.push("/FormersLogin")
    dispatch({ type: SIGN_OUT_FOR })

    // localStorage.setItem("login", "logout")
    localStorage.removeItem("login")
  }

  // let logoutTimer: any

  // function startLogoutTimer() {
  //   logoutTimer = setTimeout(signOut, 30 * 60 * 1000)
  // }

  // function resetLogoutTimer() {
  //   clearTimeout(logoutTimer)
  //   startLogoutTimer()
  // }

  // const events = [
  //   "load",
  //   "mousemove",
  //   "mousedown",
  //   "click",
  //   "scroll",
  //   "keypress",
  // ]

  // useEffect(() => {
  //   Object.values(events).forEach((item) => {
  //     window.addEventListener(item, () => {
  //       resetLogoutTimer
  //     })
  //   })
  // }, [])

  // document.addEventListener(events, resetLogoutTimer)

  // startLogoutTimer()
  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          ...state,
          method: "jwt",
          signIn,
          signOut,
          signInFor,
          signOutFor,
        }),
        [state]
      )}
    >
      {children}
    </AuthContext.Provider>
  )
}
