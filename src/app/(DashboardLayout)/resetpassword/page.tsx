//
"use client"
import { Box, styled, Typography, TextField, Button } from "@mui/material"
import LockIcon from "@mui/icons-material/Lock"
import { useRouter, useSearchParams } from "next/navigation"

import { useState } from "react"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axios from "axios"

const GreenBox = styled(Box)`
  width: 874px;
  height: 64px;
  background: #3e7d60;
  border: 0.5px solid #3e7d60;
  display: flex;
`

const SBox = styled(Box)`
  padding: 15px 35px;
  display: flex;
  flex: 1;
  flex-direction: column;
  & > div {
    margin-top: 40px;
  }
  margin-left: 47px;
`

const Text = styled(TextField)`
  font-family: "Nunito", sans-serif;
`

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

const Round = styled(Box)`
  width: 98.91px;
  height: 98.91px;
  background: #3e7d60;
  border: 0.5px solid #eeeeee;
  border-radius: 50%;
  position: relative;
`

const NewRegistration = styled(Button)`
  width: 145px;
  height: 62px;
  background: #e15a11;
  color: white;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 33px;
  text-transform: none;
  box-shadow: 0px 0px 19px -10px rgba(215, 215, 215, 0.25);
  &:hover {
    background-color: #e15a11;
  }
`

const LoginButton = styled(Button)`
  width: 131px;
  height: 62px;
  background: #e15a11;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  text-transform: none;
  box-shadow: 0px 0px 19px -10px rgba(215, 215, 215, 0.25);
  color: white;
  &:hover {
    background-color: #e15a11;
  }
`

const Box1 = styled(Box)`
  width: fit-content;
  margin: 30px auto;
`

const Heading = styled(Typography)`
  width: 216px;
  height: 20px;
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
import { useEffect } from "react"
import { usePathname } from "next/navigation"

const SetPassword = () => {
  const router = useRouter()
  const auth = useAuth()
  const [t, setToken] = useState("")
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    const splitUrl = url.split("t=")
    if (splitUrl.length === 2) {
      const extractedToken = splitUrl[1]
      setToken(extractedToken) // Store the extracted token in the state
    }
  }, [pathname, searchParams])
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value)
    // Check if passwords match when the new password is changed
    setPasswordsMatch(event.target.value === confirmPassword)
  }
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value)
    // Check if passwords match when the confirm password is changed
    setPasswordsMatch(event.target.value === newPassword)
  }
  const submitResetPassword = async () => {
    const resetPasswardData = await auth.resetPassword(
      confirmPassword,
      "password"
    )

    // if (resetPasswardData) {
    if (newPassword === confirmPassword) {
      // Here you can implement your logic to update the password on the server
      // console.log('New password submitted:', newPassword);
    } else {
      console.log("Passwords do not match")
    }
    // setError(resetPasswardData);
  }
  // };
  // function checkPassword(str: any) {
  //   var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  //   return re.test(str);
  // }
  function checkPassword(str: any) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return re.test(str)
  }
  const options = {
    headers: {
      Authorization: `bearer ${t}`,
    },
  }
  const handleSubmit = async () => {
    if (newPassword == confirmPassword) {
      try {
        let res: any = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/resetPassword`,
          {
            password: newPassword,
          },
          options
        )
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } catch (error: any) {
        // setError(error)
        console.log(error.response.data.error)
        // setErrormessage(error.response.data.error)
      }
    }
  }
  return (
    <Box>
      <Box
        sx={{
          width: "874px",
          height: "582px",
          background: "#F0F7F4",
          border: "0.5px solid #E1E1E1",
          margin: "auto",
          boxShadow: "-1px 0px 14px 2px rgba(219, 219, 219, 0.25)",
        }}
      >
        <GreenBox>
          <Heading sx={{ width: "100%", textAlign: "center" }}>
            Set New Password
          </Heading>
        </GreenBox>
        <Box1>
          <Round>
            <LockIcon
              sx={{
                color: "white",
                fontSize: "50px",
                position: "absolute",
                top: "20px",
                left: "22px",
              }}
            />
          </Round>
        </Box1>
        <SBox>
          <Text
            id="outlined-basic"
            placeholder="Set New Password"
            variant="outlined"
            type="password"
            sx={{
              width: "707px",
              height: "56px",
              paddingRight: "0px",
              background: "white",
            }}
            value={newPassword}
            onChange={handlePasswordChange}
          />

          <TextField
            id="outlined-basic"
            placeholder="Confirm New Password"
            variant="outlined"
            type="password"
            sx={{
              width: "707px",
              background: "white",
              height: "56px",
            }}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <Box>
            <Box
              sx={{
                paddingTop: "15px",
                display: "flex",
                justifyContent: "space-around",
                paddingRight: "45px",
              }}
            >
              <LoginButton onClick={handleSubmit} disabled={!passwordsMatch}>
                Submit
              </LoginButton>
            </Box>
          </Box>
        </SBox>
      </Box>
    </Box>
  )
}

export default SetPassword
