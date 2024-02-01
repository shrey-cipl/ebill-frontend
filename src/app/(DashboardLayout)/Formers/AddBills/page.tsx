"use client"
import React, { useState, useRef } from "react"
import {
  Button,
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
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { enqueueSnackbar } from "notistack"

import { FORMER_ADD_BILL_FIELDS } from "../../../../config/constants"

const initialFieldState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of FORMER_ADD_BILL_FIELDS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""
}

const FormerAddBill = () => {
  const [formerFieldState, setFormerFieldState] = useState(initialFieldState)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const authCtx: any = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const formDataToSend = new FormData()

    const fieldKeysArr = Object.keys(formerFieldState)

    fieldKeysArr.forEach((key) =>
      formDataToSend.append(key, formerFieldState[key])
    )

    try {
      const config = {
        url: `/api/bill/create`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
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

      if (res) {
        enqueueSnackbar(res.message, {
          preventDuplicate: true,
          variant: "success",
        })

        router.push("/Formers/ViewBill")
      }
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

    if (type === "file") setPreviewUrl(URL.createObjectURL(files[0]))
  }

  const fileInputRef: any = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click() // Click the hidden file input when the icon is clicked
  }

  return (
    <PageContainer title="Add Bills" description="Manage Former data here">
      <DashboardNew title="Add Bills" titleVariant="h5">
        <>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {FORMER_ADD_BILL_FIELDS.map((field, i) => {
                return (
                  <FormControl key={i} sx={{}}>
                    {field.type !== "file" && (
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
                    )}

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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "200%",
                          gap: "20px",
                          color: "#5d87ff",
                        }}
                        onClick={handleClick}
                        onChange={(e) => handleFieldChange(e)}
                      >
                        <Box
                          sx={{
                            mt: 4,
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid #5d87ff ",
                            width: "180px",
                            justifyContent: "center",
                            alignContent: "center",
                            textAlign: "center",
                            borderRadius: "10px",
                            px: 2,
                            py: 1,
                          }}
                        >
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
                          <label
                            htmlFor="file-input"
                            style={{ cursor: "pointer" }}
                          >
                            <UploadFileIcon
                              sx={{
                                fontSize: "50px",
                              }}
                            />
                          </label>

                          {/* Hidden File Input */}
                          <input
                            ref={fileInputRef}
                            name={field.id}
                            type={field.type}
                            style={{
                              position: "absolute",
                              opacity: 0,
                              width: 0,
                              height: 0,
                              overflow: "hidden",
                            }}
                          />
                        </Box>
                      </Box>
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
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <Button type="submit" size="small" variant="contained">
                Submit
              </Button>
            </div>{" "}
          </form>

          {previewUrl && (
            <Box
              sx={{
                ml: 6,
              }}
            >
              <h2>Preview:</h2>
              {formerFieldState.billFilePath.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="File Preview"
                  style={{ maxWidth: "100%", maxHeight: "600px" }}
                />
              ) : (
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
