"use client"
import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid"

import {
  Box,
  Button,
  Select,
  Stack,
  Typography,
  TextField,
} from "@mui/material"
import axiosApi from "@/Util/axiosApi"
import { styled } from "@mui/material/styles"
import TableCell from "@mui/material/TableCell"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import FilterTable from "../components/filterTable/FilterTable"
import {
  InputBillType,
  InputFormerName,
} from "../components/InputComponents/InputComponents"

const DashboardNew = dynamic(() => import("../components/shared/DashboardNew"))
const PageContainer = dynamic(
  () => import("../components/container/PageContainer")
)

const DateWiseReport = () => {
  const auth: any = useAuth()
  const [get, setGet]: any = useState(false)
  const [allReports, setAllReports]: any = useState([])
  const [allReportsByfilter, setAllReportsByfilter]: any = useState([])
  const [formData, setFormData] = useState<any>({
    name: "",
    billtype: "",
    month: "",
    year: "",
    from: "",
    to: "",
  })

  async function getReports() {
    try {
      const url = "/api/claim/getall"
      const method = "GET"
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${auth.user.token}`,
      }
      const res = await axiosApi(url, method, headers)
      setAllReports([...res.data])
      if (res.success != true || !res) {
        console.log("Bad Request")
      } else {
        console.log("200")
      }
    } catch (error) {
      console.error("Error fetching ", error)
    }
  }
  async function getReportsbyfilter() {
    setGet(true)
    try {
      const url = `/api/claim/getall?billType=${formData.billtype}&dateFrom=${
        formData.from
      }&dateTo=${formData.to}&name=${
        formData.name == "All" ? "" : formData.name
      }`
      const method = "GET"
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${auth.user.token}`,
      }
      const res = await axiosApi(url, method, headers)
      for (let item of res.data) {
        item.id = item._id
        // item.name = item.former.name
        // item.designation = item.former.designation
        // item.phone = item.former.phone
      }
      setAllReportsByfilter([...res.data])
      if (res.success != true || !res) {
        console.log("Bad Request")
      } else {
        console.log("200")
      }
    } catch (error) {
      console.error("Error fetching ", error)
    }
  }

  const handleChange = (e: any) => {
    const val = e.target.value
    setFormData({ ...formData, [e.target.name]: val })
  }

  useEffect(() => {
    getReports()
  }, [auth.user.token])

  return (
    <>
      <DashboardNew title=" Date Wise Report" titleVariant="h5">
        <>
          <Box
            sx={{
              display: {
                xs: "block",
                sm: "flex",
                md: "flex",
              },
              m: "auto",
            }}
          >
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                },
                mr: 2,
                mb: 2,
              }}
            >
              <InputFormerName
                formData={formData}
                allReports={allReports}
                handleChange={handleChange}
              />
              <Typography
                variant="subtitle1"
                fontWeight={700}
                component="label"
                htmlFor="location"
                mb="5px"
                mt="15px"
              >
                Date From
              </Typography>

              <TextField
                type="date"
                size="small"
                value={formData.from}
                onChange={(e: any) => {
                  let val = e.target.value
                  setFormData({ ...formData, from: val, minDate: e })
                }}
              ></TextField>
            </Stack>
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                },
              }}
            >
              <InputBillType formData={formData} handleChange={handleChange} />

              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="designation"
                mb="5px"
                mt="15px"
              >
                To
              </Typography>

              <TextField
                type="date"
                size="small"
                InputProps={{
                  inputProps: {
                    min: formData.from,
                  },
                }}
                value={formData.to}
                onChange={(e: any) => {
                  let val = e.target.value
                  setFormData({ ...formData, to: val })
                }}
              ></TextField>
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              my: 2,
              width: "200px",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              fullWidth
              onClick={getReportsbyfilter}
            >
              <Typography
                sx={{
                  fontWeight: 750,
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                GET
              </Typography>
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              fullWidth
              onClick={() => {
                setFormData({
                  name: "",
                  billtype: "",
                  month: "",
                  year: "",
                  from: "",
                  to: "",
                })
                setAllReportsByfilter([])
                setGet(false)
              }}
            >
              <Typography
                sx={{
                  fontWeight: 750,
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                CLEAR
              </Typography>
            </Button>
          </Box>
        </>
      </DashboardNew>

      <br />

      <FilterTable allReportsByfilter={allReportsByfilter} get={get} />
    </>
  )
}

export default DateWiseReport
