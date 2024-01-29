"use client"
import React, { useState, useRef } from "react"
import {
  Button,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material"
import PageContainer from "../../components/container/PageContainer"
import DashboardNew from "../../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import { useRouter } from "next/navigation"

import { FORMER_ADD_BILL_FIELDS } from "../../../../config/constants"

const initialFieldState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of FORMER_ADD_BILL_FIELDS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""
}

const FormerAddBill = () => {
  const [formerFieldState, setFormerFieldState] = useState(initialFieldState)

  const authCtx: any = useAuth()
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [notification, setNotification] = useState(false)
  const [notificationError, setNotificationError] = useState(false)

  const inputFileRef: any = useRef()
  const router = useRouter()

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    setSelectedFile(file)

    // Create preview URL
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  async function fileUpload() {
    if (selectedFile) {
      const formData = new FormData()

      formData.append("billFilePath", selectedFile)

      try {
        const url = `/api/bill/create`
        const method = "POST"
        const headers = {
          // authorization: `Bearer ${auth.user.token}`,
        }

        const res = await axiosApi(url, method, headers, formData)
        if (res.success !== true || !res) {
          console.log("Bad Request")
          return
        }

        inputFileRef.current.value = null
        setNotification(true)
        setTimeout(() => {
          router.push("/Formers/ViewBill")
          setNotification(false)
        }, 10000)
      } catch (error) {
        setNotificationError(true)
        setTimeout(() => {
          setNotificationError(false)
        }, 10000)
        setSelectedFile(null)
        console.error("Error fetching ", error)
      }
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Prepare FormData object for file upload
    const formDataToSend = new FormData()

    const fieldKeysArr = Object.keys(formerFieldState)

    formDataToSend.append(fieldKeysArr[0], formerFieldState[fieldKeysArr[0]])
    formDataToSend.append(fieldKeysArr[1], formerFieldState[fieldKeysArr[1]])
    formDataToSend.append(fieldKeysArr[2], formerFieldState[fieldKeysArr[2]])
    formDataToSend.append(fieldKeysArr[3], formerFieldState[fieldKeysArr[3]])
    formDataToSend.append(fieldKeysArr[4], formerFieldState[fieldKeysArr[4]])

    console.log("baka:", formDataToSend)

    try {
      const config = {
        url: `/api/bill/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user.token}`,
        },
        data: formDataToSend,
      }

      const res: any = await axiosApi(
        config.url,
        config.method,
        config.headers,
        config.data
      )
    } catch (err) {
      console.log(err)
    }
  }

  const handleFieldChange = (e: any) => {
    const { name, value, type, files } = e.target

    setFormerFieldState((prevState: any) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }))
  }

  return (
    <PageContainer title="Add Bills" description="Manage Former data here">
      <DashboardNew title="Add Bills" titleVariant="h5">
        <>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {FORMER_ADD_BILL_FIELDS.map((field, i) => {
              return (
                <FormControl key={i}>
                  <Typography
                    fontWeight={600}
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: "13px",
                      lineHeight: "12px",
                    }}
                    mb={1}
                  >
                    {field.fieldName}
                  </Typography>
                  {field.type === "select" ? (
                    <Select
                      name={field.id}
                      size="small"
                      value={formerFieldState[field.id]}
                      onChange={(e) => handleFieldChange(e)}
                      sx={{ width: "100%" }}
                    >
                      {field.selectOptions?.map((option, i) => (
                        <MenuItem value={option} key={i}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : field.type === "file" ? (
                    <TextField
                      name={field.id}
                      type={field.type}
                      size="small"
                      onChange={(e) => handleFieldChange(e)}
                      sx={{ width: "100%" }}
                    />
                  ) : (
                    <TextField
                      name={field.id}
                      type={field.type}
                      size="small"
                      value={formerFieldState[field.id]}
                      onChange={(e) => handleFieldChange(e)}
                      sx={{ width: "100%" }}
                    />
                  )}
                </FormControl>
              )
            })}
            <button type="submit">Submit</button>
          </form>
          <Grid sx={{ p: 4 }}>
            <Typography
              sx={{
                paddingLeft: "5px",
                color: "black",
                display: "flex",
                justifyContent: "left",
              }}
            >
              Upload File
            </Typography>
            <input
              ref={inputFileRef}
              type="file"
              style={{
                border: "2px solid #5d87ff",
                padding: "10px",
                height: "40px",
                borderRadius: "8px",
              }}
              onChange={(e) => {
                handleFileChange(e)
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                m: 2,
                mt: 1.5,
              }}
              onClick={fileUpload}
            >
              Upload
            </Button>
          </Grid>

          <Typography
            sx={{
              width: "100%",
              textAlign: "center",
              display: notificationError ? "inline" : "none",
              color: "red",
            }}
          >
            Something went wrong. Please try again.
          </Typography>

          <Typography
            sx={{
              width: "100%",
              textAlign: "center",
              display: notification ? "inline" : "none",
              color: "green",
            }}
          >
            File uploaded successfully
          </Typography>

          {previewUrl && (
            <Box
              sx={{
                ml: 6,
              }}
            >
              <h2>Preview:</h2>
              {selectedFile.type.startsWith("image/") ? (
                // Display image preview
                <img
                  src={previewUrl}
                  alt="File Preview"
                  style={{ maxWidth: "100%", maxHeight: "600px" }}
                />
              ) : (
                // Display PDF using iframe
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  width="100%"
                  height="600px"
                />
              )}
            </Box>
          )}
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default FormerAddBill
