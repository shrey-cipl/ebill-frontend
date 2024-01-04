"use client";
// import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  formHelperTextClasses,
  styled,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LockIcon from "@mui/icons-material/Lock";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import { Box1, GreenBox, Heading, Round } from "./ResetPassword";
import Image from "next/image";
import Link from "next/link";
// import axios from "axios";

const GreenBox = styled(Box)({
  width: "100%",
  height: "54px",
  display: "flex",
  justifyContent: "center",
});

const Round = styled(Box)({
  width: "100%",
  borderRadius: "50%",
  position: "relative",
});
const Box1 = styled(Box)({
  width: "fit-content",
  margin: "10px auto",
});

const Heading1 = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  color: "black",
  fontFamily: "Nunito, sans-serif",
  fontSize: "20px",
  lineHeight: "31.72px",
  fontWeight: 600,

  textAlign: "center",
}));

const Heading = styled(Typography)({
  width: "100%",
  textAlign: "center",
  fontFamily: "Nunito",
  fontStyle: "normal",
  fontWeight: "800",
  fontSize: "24px",
  color: "#eaf2f9",
  marginLeft: "auto",
  marginRight: "auto",
});

const ErrorTypography = styled(Typography)({
  color: "#ff0000",
  fontSize: "12px",
  marginTop: "10px",
});

const SBox = styled(Box)({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "1em",
  alignItems: "center",
  width: "90%",
  margin: "auto",
});

const LoginButton = styled(Button)({
  width: "500px",
  height: "50px",
  background: "#e15a11",
  fontWeight: 600,
  textTransform: "none",
  fontFamily: "Nunito, sans-serif",
  fontSize: "15px",
  boxShadow: "0px 0px 19px -10px rgba(215, 215, 215, 0.25)",
  color: "white",
  "&:hover": {
    backgroundColor: "#e15a11",
  },
});

const ResendOTP = styled(Typography)({
  width: "150px",
  height: "22px",
  fontFamily: "Nunito",
  fontStyle: "normal",
  fontWeight: 700,
  fontSize: "22px",
  lineHeight: "22px",
  textDecorationLine: "underline",
  color: "#1e88e5",
  cursor: "pointer",
  marginLeft: "auto",
});

const Forgot = (props: any) => {
  const styles = {
    paperContainer: {
      backgroundImage: `url(/Banner.png)`,
    },
  };

  const { respdata } = props;
  const [id, setId] = useState<string>("");
  const [empId, setEmpId] = useState<any>("");
  const [error, setError] = useState<any>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(60);
  const [delay, setDelay] = useState(false);
  const [resendshow, setResendshow] = useState(false);

  //   const router = useRouter()

  const handleVerify = async () => {
    setLoader(true);

    if (id == "") {
      setError("Email Id is Required");
    }

    try {
      let res: any = await axios.post("https://bill-monitoring-api.onrender.com/api/user/forgotPassword", {
        email: id,
      });
      setError(res.data.msg);
      setOpen(true);
      setDelay(true);
      setResendshow(true);
      setTimeout(() => {
        setDelay(false);
        setTimer(60);
        setResendshow(false);
        clearInterval(myInterval);
      }, 1000 * 60);
      const myInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      // setTimeout(()=>{

      //   router.push("/")
      // },30000)
    } catch (error: any) {
      setError(error?.errorMsg);
      setOpen(true);
    }
    setLoader(false);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // if (reason === 'clickaway') {
    //   return;
    // }

    setOpen(false);
  };

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
        // maxHeight:"98vh",
        // border:"1px solid red",
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
          <Link href={"/login"}>
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
                xs: "10",
                // sm: "11.26
                md: "12px",
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
            ( ONLINE BILL MONITORING PORTALs)
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
          <Heading>Forgot Password</Heading>
        </GreenBox>
        <Box>
          <SBox sx={{ px: "40px" }}>
            <Typography
              sx={
                error == "Reset link successfully sent to this mail-id"
                  ? {
                      color: "#4BB543",
                      fontWeight: 550,
                      fontSize: "14px",
                      mt: 2,
                    }
                  : error == ""
                  ? {
                      color: "yellow",
                      fontWeight: 550,
                      fontSize: "14px",
                      mt: 2,
                    }
                  : { color: "red", fontWeight: 550, fontSize: "14px", mt: 2 }
              }
              variant="h6"
            >
              {error
                ? error
                : "Password reset link will be send to this mail id."}
            </Typography>

            <TextField
              value={id}
              id="outlined-basic"
              placeholder="Enter Email"
              variant="outlined"
              sx={{ background: "white" }}
              onChange={(e) => {
                setId(e.target.value);
              }}
              size="small"
              inputProps={{
                style: {
                  height: "30px",
                  padding: "0 14px",
                },
              }}
            />
            {!/\S+@\S+\.\S+/.test(id) && id.length > 0 && (
              <FormHelperText error> Enter a Valid Email.</FormHelperText>
            )}

            {/* <TextField
              value={empId}
              id="outlined-basic"
              placeholder="Enter Employee ID"
              variant="outlined"
              sx={{ background: "white" }}
              size="small"
              onChange={(e) => {
                setEmpId(e.target.value);
              }}
              inputProps={{
                style: {
                  height: "30px",
                  padding: "0 14px",
                },
              }}
            /> */}
            {/* {empId.length < 6 && empId.length > 0 && (
              <FormHelperText error> Enter valid Employee ID </FormHelperText>
            )} */}

            <Box
              sx={{
                display: resendshow ? "flex" : "none",
                justifyContent: "end",
                width: "500px",
              }}
            >
              <Typography
                sx={{ fontSize: "12px", color: "white", mt: 1, mr: 9 }}
              >
                haven&apos;t recieved yet? resend in 0:
                {timer > 10 ? timer : `0${timer}`}s
              </Typography>
            </Box>

            <LoginButton
              sx={
                delay
                  ? {
                      backgroundColor: "grey",
                      mt: 4,
                      mb: 4,
                      height: "35px",
                      width: "100%",
                      "&:hover": { cursor: "not-allowed" },
                    }
                  : { width: "100%", height: "35px", mt: 2.5 }
              }
              disabled={delay}
              onClick={handleVerify}
            >
              {!loader ? (
                "Verify Email Id"
              ) : (
                <CircularProgress
                  sx={{ color: "white", fontSize: "12px", p: "1%" }}
                />
              )}
            </LoginButton>
          </SBox>
          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            key={"top" + "center"}
          >
            <Alert
              onClose={handleClose}
              severity={
                error == "Reset link successfully sent to this mail-id"
                  ? "success"
                  : "error"
              }
              sx={{ width: "100%" }}
            >
              {/* This is a success message! */}
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default Forgot;
