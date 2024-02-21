"use client"
import { useEffect, useState } from "react"
import {
  Box,
  styled,
  Typography,
  TextField,
  Button,
  Tooltip,
} from "@mui/material"

import LockIcon from "@mui/icons-material/Lock"
import { useRouter } from "next/router"

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { enqueueSnackbar } from "notistack"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

const Heading1 = styled(Typography)({
  font: "Nunito",
  fontWeight: "600",
  fontSize: "17px",
  lineHeight: "36.83px",
  alignItem: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#FFFFFF",
  paddingTop: "15px",
})

const GreenBox = styled(Box)({
  width: "100%",
  height: "54px",
  display: "flex",
  justifyContent: "center",
})

const SBox = styled(Box)({
  // padding: '15px 35px',
  display: "flex",
  flex: 1,
  flexDirection: "column",
  "& > div": {
    marginTop: "30px",
  },
  // margin-left: '47px',
})

// const Text = styled(TextField)`
//     font-family: 'Nunito', sans-serif;
// `;

// const SendOTP = styled(Button)`
// text- transform : none;
// font-family: "Nunito", sans-serif;
// background: #3E7D60;
// color: #fff;
// font-size:18px;
// font-weight:600;
// border-radius: 2px;
// height: 54px;
// width:130px;
// &:hover{
//   background-color:#E15A11
// }
// `;

const Round = styled(Box)({
  width: "100%",
  borderRadius: "50%",
  position: "relative",
})

// const NewRegistration = styled(Button)`
//     width: 145px;
//     height: 62px;
//     background: #e15a11;
//     color: white;
//     font-family: 'Nunito', sans-serif;
//     font-weight: 700;
//     font-size: 24px;
//     line-height: 33px;
//     text-transform: none;
//     box-shadow: 0px 0px 19px -10px rgba(215, 215, 215, 0.25);
//     &:hover {
//         background-color: #e15a11;
//     }
// `;

const LoginButton = styled(Button)({
  width: "121px",
  height: "42px",
  background: "#e15a11",
  fontWeight: 600,
  fontFamily: '"Nunito", sans-serif',
  fontSize: "auto",
  textTransform: "none",
  boxShadow: "0px 0px 19px -10px rgba(215, 215, 215, 0.25)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgb(255, 141, 1)",
  },
})

const Box1 = styled(Box)({
  width: "fit-content",
  margin: "10px auto",
})

const Heading = styled(Typography)({
  width: "100%",
  textAlign: "center",
  alignItems: "center",
  fontFamily: '"Nunito", sans-serif',
  fontStyle: "normal",
  fontWeight: 800,
  fontSize: "24px",
  color: "#eaf2f9",
  marginLeft: "auto",
  marginRight: "auto",
})

function ResetPassword() {
  const auth: any = useAuth()
  const [oldPass, setOldPass] = useState("")
  const [pass, setPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [token, setToken] = useState("")
  const [validationObject, setValidationobject] = useState({
    password: {
      error: false,
      errMessage: "",
    },
    confirmPassword: {
      error: false,
      errMessage: "",
    },
  })
  const clearInputs = () => {
    setOldPass("")
    setPass("")
    setConfirmPass("")
  }
  const getToken = async () => {
    const tkn: string = localStorage.getItem("accessToken") || ""
    setToken(tkn)
  }

  useEffect(() => {
    getToken()
  }, [])

  const handleChange = (e: any) => {
    // doValidation(e);

    setPass(e.target.value)
  }

  const onSubmit = async () => {
    try {
      // Check if the user is logged in
      if (!auth.user === null) {
        // Handle the case where the user is not logged in
        // You may redirect the user to the login page or display an error message
        return
      }

      if (pass !== confirmPass) {
        setValidationobject({
          ...validationObject,
          confirmPassword: {
            error: true,
            errMessage: "Password is different from new password",
          },
        })
        return
      }

      let res = await axios.post(
        `${BASE_URL}/api/former/resetPassword`,
        {
          oldPassword: oldPass,
          password: pass,
        },
        {
          headers: {
            authorization: `Bearer ${auth?.user?.token}`,
          },
        }
      )

      if (res?.data) {
        enqueueSnackbar(
          "Password Updated Successfully Redirecting you to Login Page!",
          {
            autoHideDuration: 3000,
            variant: "success",
          }
        )
        role ? auth.signOut() : auth.signOutFor()
      }
    } catch (e) {
      console.error(e)
    }

    clearInputs()
  }
  const role: any = auth?.user?.data?.role?.name
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        margin: "0",
        padding: "0",
        width: "full",
        height: "100vh",
        backgroundImage: `url(/Banner.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "33%",
          height: "100vh",
          // background: '#F0F7F4',
          //   border: "0.5px solid #E1E1E1",
          // margin: "auto",
          boxShadow: "-1px 0px 14px 2px rgba(219, 219, 219, 0.25)",
          background: "#000000b3",
          //   width: "35%",
          //   height: "100%",
          // top: "0",
          // left: "0",
          borderRadius: "0",
          color: "#ffffff",
          // paddingBottom: "3%",
          // px:"5%",
          pt: "1%",
          //   zIndex: "777",

          // verticalAlign: "center",
          // flexFlow: "column",
          // display: "inline-flex",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <Box sx={{ ml: 2 }}>
          <Link href={"/"}>
            <Tooltip title={"Back"} sx={{ cursor: "pointer" }}>
              <ArrowBackIosIcon />
            </Tooltip>
          </Link>
        </Box>
        <Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/Gov_Logo_912e861f02.png"
              width={50}
              height={70}
              alt={""}
              color="white"
            />
          </Box>
          <Heading1
            sx={{
              color: "#fff900 !important",
              lineHeight: "28px",
              fontSize: {
                xs: "20",
                // sm: "11.26
                md: "22px",
                // lg: "19.26px",
                // xl: "19.26px",
              },
            }}
          >
            UNION PUBLIC SERVICE COMMISSION
          </Heading1>
          <Typography
            sx={{
              letterSpacing: "0em",
              textAlign: "center",
              lineHeight: "30px",
              fontWeight: 700,
              fontSize: {
                xs: "12.26",
                // sm: "11.26
                md: "18.26px",
                // lg: "19.26px",
                // xl: "19.26px",
              },
              justifyContent: "center",
            }}
          >
            Bill Monitoring System
          </Typography>
        </Box>
        <Box1 sx={{ textAlign: "center" }}>
          <Round>
            <LockIcon
              sx={{
                color: "white",
                fontSize: "50px",
                // position: "absolute",
                // top: "20px",
                // left: "10px",
              }}
            />
          </Round>
        </Box1>
        <GreenBox>
          <Heading>Reset Password</Heading>
        </GreenBox>
        <SBox>
          <TextField
            name="oldPassword"
            id="outlined-a"
            placeholder="Enter Old Password"
            variant="outlined"
            size="small"
            value={oldPass}
            onChange={(e) => {
              //   doValidation(e);
              setOldPass(e.target.value)
            }}
            // error={validationObject.oldPassword.error}
            // helperText={validationObject.oldPassword.errMessage}
            type="password"
            sx={{
              width: "80%",
              //    / height: '30px',/
              margin: "auto",
              paddingRight: "0px",
              // background: "white",
            }}
            inputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
          />
          <TextField
            name="password"
            id="outlined-b"
            placeholder="Enter New Password"
            variant="outlined"
            size="small"
            value={pass}
            onChange={(e) => handleChange(e)}
            // error={pass.length < 8 && pass.length > 0}
            // helperText={
            //   pass.length < 8 && pass.length > 0
            //     ? "password should be greater than 8 characters"
            //     : ""
            // }
            type="password"
            sx={{
              width: "80%",
              margin: "auto",
              paddingRight: "0px",
            }}
            inputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
          />

          <TextField
            name="confirmPassword"
            id="outlined-c"
            placeholder="Confirm New Password"
            variant="outlined"
            size="small"
            value={confirmPass}
            onChange={(e) => {
              //   doValidation(e);
              setConfirmPass(e.target.value)
            }}
            error={validationObject.confirmPassword.error}
            helperText={validationObject.confirmPassword.errMessage}
            type="password"
            sx={{
              width: "80%",
              //    / height: '30px',/
              margin: "auto",
              paddingRight: "0px",
              // background: "white",
            }}
            inputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
          />
          <Box>
            <Box
              sx={{
                // paddingTop: '15px',
                display: "flex",
                justifyContent: "space-around",
                // paddingRight: '45px',
              }}
            >
              <LoginButton onClick={onSubmit}>Submit</LoginButton>
            </Box>
          </Box>
        </SBox>
      </Box>
    </Box>
  )
}

export default ResetPassword
