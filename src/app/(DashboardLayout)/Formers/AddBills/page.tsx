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
import { enqueueSnackbar } from "notistack"

import { FORMER_ADD_BILL_FIELDS } from "../../../../config/constants"

const initialFieldState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of FORMER_ADD_BILL_FIELDS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""
}

const FormerAddBill = () => {
  const [formerFieldState, setFormerFieldState] = useState(initialFieldState)

  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const authCtx: any = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Prepare FormData object for file upload
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
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
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
