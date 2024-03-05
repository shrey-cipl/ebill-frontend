"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import RefreshIcon from "@mui/icons-material/Refresh"

import Snackbar from "@mui/material/Snackbar"
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Select,
  MenuItem,
  Typography,
  styled,
  TextField,
  Tooltip,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

import { useUser } from "../../../../../context/UserContext/UserContext.provider"
import { useAuth } from "../../../../../context/JWTContext/AuthContext.provider"
import callApi from "@/Util/axiosApi"
import { enqueueSnackbar } from "notistack"

const emailValidationRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/
const mobileValidationRegex =
  /^((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}$/

function Login() {
  const auth = useAuth()
  const router = useRouter()
  const [branch, setBranch] = useState<any>("")
  const [userName, setUserName] = useState<any>("")
  const [inputCaptcha, setInputCaptcha] = useState<any>("")
  const [captchaCode, SetCaptchaCode] = useState<any>("")
  const [allUser, setAllUser] = useState<any>([])
  const [tryagain, setTryagain] = useState<any>(false)
  const [password, setPassword]: any = useState(null)
  const [toast, setToast] = useState<any>({
    open: false,
    severity: "",
    message: "",
  })
  // const [alert, setAlert]:any = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const user = useUser()

  const refreshCapcha = () => {
    SetCaptchaCode(Math.random().toString(36).substr(2, 6))
  }
  useEffect(() => {
    SetCaptchaCode(Math.random().toString(36).substr(2, 6))
  }, [])

  const loginUser = async (email: any) => {
    if (password === "" || inputCaptcha === "") {
      SetCaptchaCode(Math.random().toString(36).substr(2, 6))
      // setToast({
      //   message: "Please fill all fields",
      //   open: true,
      //   severity: "error",
      // })
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

    let ress: any = await auth.signIn(email, password)

    if (ress.data?.success) {
      // if (emailValidationRegex.test(email)) {
      enqueueSnackbar(ress.data?.message, {
        autoHideDuration: 3000,
        variant: "success",
      })
      // }
    } else {
      enqueueSnackbar(ress?.error, {
        autoHideDuration: 3000,
        variant: "error",
      })
    }
  }

  const handleLogin = async () => {
    let info = allUser.find((ele: any) => {
      if (ele?.role[0].name === userName) {
        return ele.email
      }
    })

    if (info != undefined) {
      loginUser(info.email)
    } else {
      setTryagain(true)
      setTimeout(() => {
        setTryagain(false)
      }, 2000)
    }
  }

  async function getData() {
    try {
      const url = "/api/user/getAll"
      const method = "GET"
      const headers = {
        "Content-Type": "application/json",
      }
      const posts = await callApi(url, method, headers)
      setAllUser([...posts.data])

      if (posts.data.success != true || !posts.data) {
        console.log("Bad Request")
      } else {
        console.log("200")
      }
    } catch (error) {
      console.error("Error fetching ", error)
    }
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
  const SBox = styled(Box)`
    display: flex;
    flex: 1;
    flex-direction: column;

    & > div,
    & > button,
    & > p {
      margin-top: 10px;
    }
    padding: 20px;
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

  // Define the options for each branch
  const branchOptions: any = {
    Administration: [
      "Asst. Section Officer Admin I",
      "Asst. Section Officer Admin IV",
      "Section Officer Admin I",
      "Section Officer Admin IV",
      "Under Secretary O&M",
      ,
      "Deputy Secretary Admin",
      "Joint Secretary Admin",
    ],
    General: [
      "Asst. Section Officer General II",
      "Section Officer General II",
      "Under Secretary General II",
      "Deputy Secretary General",
      "Joint Secretary General",
      // Add more options for General branch
    ],
    PAO: [
      "PAO",
      // Add more options for General branch
    ],
    "System Admin": [
      "System Admin",
      // Add more options for General branch
    ],
    "Super Access": [
      "Additional Secretary Office",
      "Secretary Office",
      "Chairman Office",
      // Add more options for General branch
    ],
    Accounts: [
      "Accounts I",
      "Accounts II",
      "Accounts IV",
      "F&BO",
      // Add more options for General branch
    ],
    // Add similar entries for other branches
  }
  const handleClose = () => {
    setToast({
      open: false,
      severity: "",
      message: "",
    })
  }

  const userNameOptions = branchOptions[branch] || ["select Branch !!!"]

  useEffect(() => {
    getData()
  }, [])
  return (
    <Box sx={{ height: "100%" }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toast.open}
        onClose={handleClose}
        // message="I love snacks"
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
              User Login
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ lineHeight: "9px" }}>
              Branch
            </Typography>

            <Select
              sx={{
                width: "100%",
                background: "white",
                color: "black",
                marginBottom: "8px",
                mt: 2,
              }}
              size="small"
              value={branch}
              // name='branch'
              inputProps={{ "aria-label": "Without label" }}
              onChange={(e: any) => {
                setBranch(e.target.value)
                setUserName("")
              }}
            >
              <MenuItem disabled value="">
                <em>Branch</em>
              </MenuItem>
              <MenuItem value="Administration">Administration</MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Accounts">Accounts</MenuItem>
              <MenuItem value="System Admin">System Admin</MenuItem>
              <MenuItem value="PAO">PAO</MenuItem>
              <MenuItem value="Super Access">Super Access</MenuItem>
            </Select>

            <Typography variant="body1" sx={{ lineHeight: "9px", mt: 1 }}>
              User Name
            </Typography>
            <Select
              sx={{
                width: "100%",
                background: "white",
                color: "black",
                marginBottom: "8px",
                mt: 2,
              }}
              size="small"
              value={userName}
              inputProps={{ "aria-label": "Without label" }}
              onChange={(e) => {
                setUserName(e.target.value)
              }}
            >
              <MenuItem disabled value="">
                <em>User Name</em>
              </MenuItem>

              {userNameOptions.map((option: any, index: number) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>

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
              onClick={handleLogin}
              size="small"
              sx={{ fontSize: "15px", py: 1, width: "100%", mt: 2 }}
            >
              Login
            </LoginButton>
            <ResendOTP
              sx={{
                color: "#fff900",
                fontSize: "12px",
                textDecoration: "none",
                mt: 2,
              }}
              variant="body1"
              onClick={() => {
                router.push("/FormersLogin")
              }}
            >
              Former Login
            </ResendOTP>
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
                onClick={() => {
                  router.push("/Forgot")
                }}
              >
                Forgot Password ?
              </ResendOTP>
            </Box>
            {tryagain && (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "red",
                  fontWeight: "800",
                }}
              >
                Invalid email or invalid password please try again
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
