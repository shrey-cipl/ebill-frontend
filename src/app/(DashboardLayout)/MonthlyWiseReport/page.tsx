"use client"
import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid"

import {
  Box,
  Button,
  MenuItem,
  FormControl,
  Select,
  Stack,
  InputLabel,
  Typography,
} from "@mui/material"

import axiosApi from "@/Util/axiosApi"
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import CustomGrid from "../components/CustomGrid"
import {
  InputMonthly,
  InputFormerName,
  InputBillType,
  InputYearly,
} from "../components/InputComponents/InputComponents"
import FilterTable from "../components/filterTable/FilterTable"

const DashboardNew = dynamic(() => import("../components/shared/DashboardNew"))
const PageContainer = dynamic(
  () => import("../components/container/PageContainer")
)

const TABLE_HEADERS = [
  "Diary No.",
  "Name",
  "Type",
  "Admissible Amount",
  "Sanctioned Amount",
  "Status",
]

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 10px",
  wordBreak: "break-all",
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  display: "block",
  // textAlign: 'center', // Ce
}))

const MonthlyWiseReport = () => {
  const auth: any = useAuth()
  const [get, setGet]: any = useState(false)
  const [allReports, setAllReports]: any = useState([])
  const [allReportsByfilter, setAllReportsByfilter]: any = useState([])
  const [formData, setFormData] = useState<any>({
    name: "",
    billtype: "",
    month: "",
    year: "",
  })

  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 30 // Adjust the range as needed
  const years = Array.from({ length: 31 }, (_, index) => startYear + index)

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
      const url = `/api/claim/getall?billType=${formData.billtype}&month=${
        formData.month
      }&year=${formData.year}&name=${
        formData.name == "All" ? "" : formData.name
      }`
      const method = "GET"
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${auth.user.token}`,
      }
      const res = await axiosApi(url, method, headers)
      console.log(res, "allReports")
      for (let item of res.data) {
        item.id = item._id
        // item.name = item.former.name
        // item.designation = item.former.designation
        // item.phone = item.former.phone
      }
      setAllReportsByfilter([...res.data])

      // console.log(posts,"abhi props");
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
      <DashboardNew title="Monthly Report" titleVariant="h5">
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

              <InputMonthly formData={formData} handleChange={handleChange} />
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

              <InputYearly formData={formData} handleChange={handleChange} />
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

export default MonthlyWiseReport
