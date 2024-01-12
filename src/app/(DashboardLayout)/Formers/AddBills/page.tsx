"use client"

import React, { useState, useRef } from "react"

import { Button, Box, Grid, Typography, Input } from "@mui/material"
import PageContainer from "../../components/container/PageContainer"
import DashboardNew from "../../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"

const AddBills = () => {
  const auth: any = useAuth()
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [notification, setNotification] = useState(false)
  const [notificationError, setNotificationError] = useState(false)

  const inputFileRef: any = useRef()

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    setSelectedFile(file)
  }

  async function fileUpload() {
    if (selectedFile) {
      // Example: Send the file using the Fetch API
      const formData = new FormData()
      formData.append("billFilePath", selectedFile)

      try {
        const url = `/api/bill/create`
        const method = "POST"
        const headers = {
          authorization: `Bearer ${auth.user.token}`,
        }
        const res = await axiosApi(url, method, headers, formData)
        if (res.success != true || !res) {
          console.log("Bad Request")
          return
        }

        inputFileRef.current.value = null

        setSelectedFile(null)
        setNotification(true)
        setTimeout(() => {
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
  return (
    <PageContainer title="Add Bills" description="Manage Former data here">
      <DashboardNew title="Add Bills" titleVariant="h5">
        <>
          <Grid
            sx={{
              p: 4,
            }}
          >
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
              // accept=".doc,.docx,application/pdf"
              // id="icon-button-file1"
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
              // value={selectedFile}
            />

            <Button
              variant="contained"
              color="primary"
              // onClick={handleUpload}
              // disabled={!selectedFile}
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
            something went wrong please try again
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
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default AddBills
