import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar"

import RefreshIcon from "@mui/icons-material/Refresh"

import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  styled,
  TextField,
  Tooltip,
} from "@mui/material"

import { Visibility, VisibilityOff } from "@mui/icons-material"

import { useAuth } from "../../../../../context/JWTContext/AuthContext.provider"
import { enqueueSnackbar } from "notistack"

const emailValidationRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/
const mobileValidationRegex =
  /^((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\{5}([- ]*)\d{6}$/

function Formers() {
  const auth = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState<any>("")
  const [password, setPassword]: any = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [inputCaptcha, setInputCaptcha] = useState<any>("")
  const [captchaCode, SetCaptchaCode] = useState<any>("")
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const [toast, setToast] = useState<any>({
    open: false,
    severity: "",
    message: "",
  })

  const loginUser = async () => {
    if (password === "" || inputCaptcha === "") {
      SetCaptchaCode(Math.random().toString(36).substr(2, 6))
      enqueueSnackbar("Please fill all fields", {
        autoHideDuration: 3000,
        variant: "error",
      })
      return
    } else if (captchaCode !== inputCaptcha) {
      SetCaptchaCode(Math.random().toString(36).substr(2, 6))

      enqueueSnackbar("Please Enter Correct Captcha", {
        autoHideDuration: 3000,
        variant: "error",
      })
      return
    }

    let ress: any = await auth.signInFor(email, password)

    console.log(ress, "RESSSSSSSSS")

    if (ress.data?.success) {
      if (emailValidationRegex.test(email)) {
        enqueueSnackbar(ress.data?.message, {
          autoHideDuration: 3000,
          variant: "success",
        })
      }
    } else {
      enqueueSnackbar(ress?.error, {
        autoHideDuration: 3000,
        variant: "error",
      })
    }
  }
  useEffect(() => {
    SetCaptchaCode(Math.random().toString(36).substr(2, 6))
  }, [])

  const refreshCapcha = () => {
    SetCaptchaCode(Math.random().toString(36).substr(2, 6))
  }
  const Heading1 = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1),
    color: "black",
    fontFamily: "Nunito, sans-serif",
    lineHeight: "41.72px",
    fontWeight: 700,
  }))

  const LoginButton = styled(Button)`
    width: auto;
    height: auto;

    background: #e15a11;
    font-weight: 600;
    font-family: "Nunito", sans-serif;
    font-size: 20px;
    box-shadow: 0px 0px 19px -10px rgba(215, 215, 215, 0.25);
    color: white;
    &:hover {
      background-color: #e15a11;
    }
  `

  const ResendOTP = styled(Typography)`
    width: 150px;
    height: 22px;
    font-family: "Nunito", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 10px;
    line-height: 22px;
    text-decoration-line: underline;
    color: #1e88e5;
    cursor: pointer;
    margin: auto;
    text-align: center;
    justify-content: center;
  `

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }
  const handleClose = () => {
    setToast({
      open: false,
      severity: "",
      message: "",
    })
  }
  return (
    <Box sx={{ height: "100%" }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toast.open}
        onClose={handleClose}
        key={"top" + "center"}
        autoHideDuration={2000}
      >
        <Alert
          severity={toast.severity}
          sx={{
            backgroundColor: toast.severity == "error" ? "#EF5350" : "green",
            color: "white",
            fontWeight: 700,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>{toast.message}</Typography>
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          width: "auto",
          height: "100vh",
          // height: "100%",
          overflow: "auto",
          top: "4px",
          backgroundImage: `url(/Banner.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Box
          sx={{
            background: "#000000b3",
            width: "auto",
            height: "100vh",
            top: "0",
            left: "0",
            borderRadius: "0",
            color: "#ffffff",
            padding: "40px",
            zIndex: "777",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/Gov_Logo_912e861f02.png"
              width={50}
              height={70}
              alt={""}
            />
          </Box>

          <Box
            sx={{
              // flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Heading1
              sx={{
                color: "#fff900",
                lineHeight: "28px",
                fontSize: {
                  xs: "11.26",
                  sm: "11.26",
                  md: "15.26px",
                  lg: "17.26px",
                  xl: "17.26px",
                },
              }}
            >
              UNION PUBLIC SERVICE COMMISSION
            </Heading1>
          </Box>
          <Typography
            sx={{
              letterSpacing: "0em",
              textAlign: "center",
              lineHeight: "30px",

              justifyContent: "center",
            }}
          >
            (ONLINE BILL MONITORING PORTAL)
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Nunito",
                fontSize: "20px",
                fontWeight: "600",
                lineHeight: "19px",
                letterSpacing: "0em",
                textAlign: "center",
                justifyContent: "center",
                marginTop: "7px",
                mb: 2,
                color: "#fff900",
              }}
            >
              Former Login
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ lineHeight: "9px", mt: 1 }}>
              Email
            </Typography>

            <OutlinedInput
              // id="outlined-adornment-weight"
              type="text"
              placeholder="email"
              size="small"
              value={email}
              sx={{
                width: "100%",
                background: "white",
                marginBottom: "8px",
                mt: 2,
              }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Typography variant="body1" sx={{ lineHeight: "9px", mt: 1 }}>
              Password
            </Typography>

            <OutlinedInput
              // id="outlined-adornment-weight"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              size="small"
              value={password}
              sx={{
                width: "100%",
                background: "white",
                marginBottom: "8px",
                mt: 2,
              }}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Box
              sx={{
                width: "500px",
                display: "flex",
                justifyContent: "space-between",
                mt: "20px",
              }}
            >
              <Box
                sx={{
                  width: "40%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  borderRadius: "40px",
                }}
              >
                <Box
                  sx={{
                    fontWeight: 600,
                    height: "100%",
                    width: "80%",
                    backgroundColor: "grey",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "not-allowed",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      p: 1.2,
                      fontSize: "20px",
                      width: "fit-content",
                      margin: "auto",
                      height: "45px",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "not-allowed",
                    }}
                    fontFamily="Nunito"
                  >
                    {captchaCode}
                  </Typography>
                </Box>
                <Tooltip title="Refresh Captcha">
                  <RefreshIcon
                    onClick={refreshCapcha}
                    sx={{
                      fontSize: "33px",
                      color: "#E15A11",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>
              <TextField
                id="outlined-basic"
                placeholder="Enter Captcha"
                autoComplete="off"
                // variant="outlined"
                type="text"
                onPaste={(event: any) => {
                  event.preventDefault()
                  return false
                }}
                onDrop={(event: any) => {
                  event.preventDefault()
                  return false
                }}
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    // handleLogin()
                  }
                }}
                value={inputCaptcha}
                sx={{ width: "55%", background: "white", borderRadius: "4px" }}
                onChange={(event) => {
                  setInputCaptcha(event.target.value)
                }}
                inputProps={{
                  style: {
                    height: "45px",
                    padding: "0 14px",
                  },
                }}
              ></TextField>
            </Box>
            <LoginButton
              onClick={loginUser}
              size="small"
              sx={{ fontSize: "15px", py: 1, width: "100%", mt: 2 }}
            >
              Login
            </LoginButton>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "auto",
                color: "#ffffff",
              }}
            >
              <ResendOTP
                sx={{
                  color: "#ffffff",
                  fontSize: "12px",
                  textDecoration: "none",
                  mt: 2,
                }}
                variant="body1"
              >
                Forgot Password ?
              </ResendOTP>
            </Box>
            <ResendOTP
              sx={{
                color: "#fff900",
                fontSize: "12px",
                textDecoration: "none",
                mt: 2,
              }}
              variant="body1"
              onClick={() => {
                router.push("/login")
              }}
            >
              Login for User
            </ResendOTP>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Formers
