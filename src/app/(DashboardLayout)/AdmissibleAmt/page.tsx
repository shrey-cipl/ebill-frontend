"use client"
import React, { useEffect, useState } from "react"
import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { InputFormerName } from "../components/InputComponents/InputComponents"

import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import { enqueueSnackbar } from "notistack"

const AdmissibleAmt = () => {
  const authCtx: any = useAuth()

  const [admiss, setAdmiss] = useState<any>([])

  const [flag, setFlag] = useState(false)

  const initialFieldState: any = admiss.map((ele: any) => {
    return {
      billType: ele.billType ? ele.billType : "",
      totalAdmissibleAmount: ele.totalAdmissibleAmount
        ? ele.totalAdmissibleAmount
        : "",
    }
  })

  const [formData, setFormData] = useState<any>(initialFieldState)

  useEffect(() => {
    const initialFieldState = admiss.map((ele: any) => {
      return {
        billType: ele.billType ? ele.billType : "",
        totalAdmissibleAmount: ele.totalAdmissibleAmount
          ? ele.totalAdmissibleAmount
          : "",
      }
    })
    setFormData(initialFieldState)
  }, [admiss])

  const handleFieldChange = (e: any, index: any) => {
    const { name, value, type, files } = e.target

    setFormData((prevState: any) => {
      const newState = [...prevState]

      if (index >= 0) {
        newState[index] = {
          ...newState[index],
          [name]: value,
        }
      }

      return newState
    })
  }

  const getData = async () => {
    const config = {
      url: `/api/amount/get`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user?.token}`,
      },
    }

    const res: any = await axiosApi(config.url, config.method, config.headers)

    setAdmiss(res?.data)
  }

  const handleSubmit = async (e: any, index: any) => {
    e.preventDefault()

    try {
      const config = {
        url: `/api/amount/updateAmount`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user?.token}`,
        },
        data: formData[index],
      }

      const res: any = await axiosApi(
        config.url,
        config.method,
        config.headers,
        config.data
      )

      console.log(res)

      if (res) {
        enqueueSnackbar(res.message, {
          preventDuplicate: true,
          variant: "success",
        })
        setFlag(true)
      }
      return res
    } catch (error: any) {
      enqueueSnackbar(error.message, {
        preventDuplicate: true,
        variant: "error",
      })
    }
  }

  useEffect(() => {
    getData()
  }, [authCtx.user?.token])

  return (
    <PageContainer title="Admissible Amount" description="Admiss Amt">
      <DashboardNew title="Admissible Amount" titleVariant="h5">
        <>
          <Box
            sx={{
              //   display: "grid",
              //   gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // justifyContent:"",
                margin: "auto",
                width: "45%",
              }}
            >
              <Typography
                fontWeight={600}
                component="label"
                sx={{
                  display: "block",
                  fontSize: "13px",
                  lineHeight: "12px",
                  mr: 18,
                }}
                mb={1}
              >
                {"Bill Type"}
              </Typography>

              <Typography
                fontWeight={600}
                component="label"
                sx={{
                  display: "block",
                  fontSize: "13px",
                  lineHeight: "12px",
                  //   ml:15
                }}
                mb={1}
              >
                {"Admissible Amount"}
              </Typography>
            </Box>
            {initialFieldState.map((ele: any, i: any) => {
              return (
                <Box
                //   sx={{
                //     display: "flex",
                //     alignItems: "center",
                //     justifyContent: "center",
                //   }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl>
                      <TextField
                        name={"billType"}
                        type={"text"}
                        placeholder={"Bill Type"}
                        size="small"
                        value={formData[i]?.billType || ""}
                        // id="outlined-error"
                        onChange={(e) => handleFieldChange(e, i)}
                        sx={{ width: "100%" }}
                      />
                    </FormControl>

                    <FormControl>
                      <TextField
                        name={"totalAdmissibleAmount"}
                        type={"number"}
                        placeholder={"Enter Admissible Amt"}
                        size="small"
                        value={formData[i]?.totalAdmissibleAmount || ""}
                        // id="outlined-error"
                        onChange={(e) => handleFieldChange(e, i)}
                        sx={{ width: "100%" }}
                      />
                    </FormControl>

                    <Box>
                      <Button
                        onClick={(e) => handleSubmit(e, i)}
                        type="submit"
                        size="small"
                        variant="contained"
                        disabled={
                          flag ||
                          JSON.stringify(formData[i]) ===
                            JSON.stringify(initialFieldState[i])
                        }
                      >
                        Update
                      </Button>

                      <Button
                        sx={{ ml: 2 }}
                        type="submit"
                        size="small"
                        variant="contained"
                        onClick={() => setFormData(initialFieldState)}
                        disabled={
                          flag ||
                          JSON.stringify(formData[i]) ===
                            JSON.stringify(initialFieldState[i])
                        }
                      >
                        Reset
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default AdmissibleAmt
