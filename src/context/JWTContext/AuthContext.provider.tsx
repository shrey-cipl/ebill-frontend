import React, { createContext, useEffect, useReducer, useMemo } from "react"

import { useRouter, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()
  let xml: any = searchParams.get("xml")
  console.log(xml, "xxx")

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

  // useEffect(() => {
  //   const func = async () => {
  //     try {
  //       if (localStorage.getItem("login")) {
  //         const data: any = JSON.parse(localStorage.getItem("login") || "")
  //         const token: any = localStorage.getItem("accessToken")
  //         dispatch({
  //           type: INITIALIZE,
  //           payload: {
  //             isInitialized: true,
  //             user: { data, token },
  //           },
  //         })
  //         pathname == "/" && router.push("/Home")
  //       } else if (xml) {
  //         signInOnHome()
  //       } else {
  //         signOut()
  //       }
  //     } catch (err: any) {
  //       console.log(err, "error on First Render")
  //       signOut()
  //     }
  //   }
  //   func()
  // }, [])

  const signInOnHome = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_SSO_BASE_URL}/api/v1/user/session/${xml}`
      )
      console.log(response, "resp")
      const { token, data }: any = response.data.data.body
      if (response.data.data.status == false) {
        signOut()
        return
      }
      localStorage.setItem("login", JSON.stringify(data))

      localStorage.setItem("xml", JSON.stringify(xml))

      setSession(token)
      dispatch({
        type: SIGN_IN,
        payload: {
          user: { data, token },
          isAuthenticated: true,
        },
      })
      router.push("/Home")
    } catch (err: any) {
      console.log(err, "errrrrrrrrrrrrrr")
      signOut()
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

  const signIn = async (email: any, password: any) => {
    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      })

      const { token, data } = response.data
      localStorage.setItem("login", JSON.stringify(response.data))
      setSession(token)
      console.log(token, data, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
      dispatch({
        type: SIGN_IN,
        payload: {
          user: { data, token },
          isAuthenticated: true,
        },
      })

      router.push("/")
      return response
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
      return response
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
  // const signOut = async () => {
  //   setSession(null)
  //   // console.log("Current Path:", pathname)
  //   router.push("/login")
  //   dispatch({ type: SIGN_OUT })

  //   // localStorage.setItem("login", "logout")
  //   localStorage.removeItem("login")
  // }
  const signOut = async () => {
    const rawData = localStorage.getItem("xml")
    let info

    if (rawData) {
      try {
        info = JSON.parse(rawData)
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKEND_SSO_BASE_URL}/api/v1/user/session/${info}`
          )
          console.log(response)
          router.push(`${process.env.NEXT_PUBLIC_SSO_URL}`)
          setSession(null)
          dispatch({ type: SIGN_OUT })
          localStorage.clear()
        } catch (err: any) {
          console.log(err, "error")
        }
      } catch (error) {
        console.error("Error parsing JSON:", error)
        // Handle the error appropriately, such as displaying a message to the user or providing a default value for 'info'
      }
    } else {
      // Handle case where no data is present in localStorage
      router.push(`${process.env.NEXT_PUBLIC_SSO_URL}`)
      dispatch({ type: SIGN_OUT })
      localStorage.clear()
    }
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
