import React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Select,
  MenuItem,
  Typography,
  styled,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

import { useUser } from "../../../../../context/UserContext/UserContext.provider"
import { useAuth } from "../../../../../context/JWTContext/AuthContext.provider"
import callApi from "@/Util/axiosApi"
import axios from "axios"

const GreenBox = styled(Box)`
  width: 874px;
  height: 64px;
  background: #3e7d60;
  border: 0.5px solid #3e7d60;
  display: flex;
`

const Heading = styled(Typography)`
  width: 221px;
  font-family: "Nunito", sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #eaf2f9;
  margin-top: 22px;
  margin-left: auto;
  margin-right: auto;
`

const SBox = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex: 1;
  flex-direction: column;
  & > div,
  & > button,
  & > p {
    margin-top: 40px;
  }
  margin-left: 47px;
`

const NewRegistration = styled(Button)`
  width: 254px;
  height: 62px;
  background: #e15a11 !important;
  box-shadow: 0px 0px 19px -10px rgba(215, 215, 215, 0.25) !important;
  color: white;
  margin-right: 280px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 18px;
  &:hover {
    background-color: #e15a11 !important;
  }
`

const LoginButton = styled(Button)`
  width: 131px;
  height: 62px;
  background: #e15a11 !important;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  box-shadow: 0px 0px 19px -10px rgba(215, 215, 215, 0.25) !important;
  color: white !important;
  &:hover {
    background-color: #e15a11 !important;
  }
`

const ResendOTP = styled(Typography)`
  width: 150px;
  height: 22px;
  font-family: "Nunito", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  text-decoration-line: underline;
  color: #1e88e5;
  cursor: pointer;
  margin-left: auto;
`

const ErrorTypography = styled(Typography)`
  color: #ff0000;
  font-size: 12px;
  margin-top: 10px !important;
`

const emailValidationRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/
const mobileValidationRegex =
  /^((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}$/

function Login() {
  const auth = useAuth()
  const router = useRouter()
  const [branch, setBranch] = useState<any>("")
  const [userName, setUserName] = useState<any>("")
  const [allUser, setAllUser] = useState<any>([])
  const [tryagain, setTryagain] = useState<any>(false)
  const [password, setPassword]: any = useState(null)
  // const [alert, setAlert]:any = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const user = useUser()
  console.log(
    auth,
    "---------------------------------------------------------------------------s-s-----------"
  )
  const loginUser = (email: any) => {
    if (emailValidationRegex.test(email)) {
      auth.signIn(email, password)
    } else if (mobileValidationRegex.test(email)) {
      auth.signIn(email, password)
    } else {
      auth.signIn(email, password)
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

    // postData({
    //   name: "Abhijeet Kumar",
    //   email: "abhijezxet@gmail.com",
    //   designation: "Member",
    //   status: "Ex",
    //   isActive: "Active",
    //   bankAccountNumber: "255482871374",
    //   phone: "95676993725",
    // })
    // async function postData(postData: any) {
    //   try {
    //     const url = "/api/former/create"
    //     const method = "POST"
    //     const headers = {
    //       "Content-Type": "application/json",
    //       Authorization:

    //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Il9pZCI6IjY0ZDQ4Yjg5OTA3ZjRmZmU0NGZiMmYyMSIsIm5hbWUiOiJUYXJ1biIsInBob25lIjoiODgyNjEwNzkzNiIsImVtYWlsIjoidGFydW5AZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTIkalFtRENkbmlPT2kxNElQcmJIeVFsT1Vxay94bkt6ZERlSFdTdDBUUVh3c3kyeDVzd1JtUy4iLCJicmFuY2giOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjp7Il9pZCI6IjY0ZDQ3M2I0MTk2ZGIyODA1M2FiYTcxNSIsImlkIjoxNywibmFtZSI6IlN5c3RlbSBBZG1pbiJ9LCJjcmVhdGVkQXQiOiIyMDIzLTA4LTEwVDA3OjAyOjMzLjM1NVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA4LTEwVDA3OjAyOjMzLjM1NVoiLCJfX3YiOjB9LCJpYXQiOjE2OTIxMzYwMTgsImV4cCI6MTY5Mjc0MDgxOH0.hVuNM-dRL-uuEBYXSijuty2TThIFaMWbpItIMGu0k0Y",
    //     }
    //     const response = await callApi(url, method, headers, postData)

    //     console.log(response, "abhi props")
    //     if (response.success != true || !response) {
    //       console.log("Bad Request")
    //     } else {
    //       console.log("200")
    //     }
    //   } catch (error) {
    //     console.error("Error fetching ", error)
    //   }
    // }
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
      // console.log(posts,"abhi props");
      if (posts.success != true || !posts) {
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
      "Under Secretary",
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
      "Secretary Office",
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
  const userNameOptions = branchOptions[branch] || ["select Branch !!!"]
  console.log(allUser)
  useEffect(() => {
    getData()
  }, [])
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          width: "auto",
          height: "100vh",
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
            <LoginButton
              onClick={handleLogin}
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
                onClick={() => {
                  console.log(branch)
                  // router.push("/forgot")
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
