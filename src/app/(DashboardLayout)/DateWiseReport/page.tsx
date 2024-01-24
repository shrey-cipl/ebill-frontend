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
  TextField,
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
}))

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

  const columns: GridColDef[] = [
    {
      field: "s.no", // confirm this
      headerName: "S.No",
      valueGetter: (params:any) => params.api.getAllRowIds().indexOf(params.id) + 1,
      width: 100,
    },
    { field: "diaryNumber", headerName: "Diary No." },
    { field: "name", headerName: "Name" },
    { field: "billType", headerName: "Bill Type" },
    { field: "totalAdmissibleAmount", headerName: "Admissible Amount" },
    {
      field: "sanctionedAmount",
      headerName: "Sanctioned Amount"
    },
    {
      field: "currentStatus",
      headerName: "Status"
    },
  ]

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
              <FormControl></FormControl>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="name"
                mb="5px"
              >
                Name
              </Typography>
              <FormControl>
                <InputLabel size="small" id="demo-simple-select-label">
                  {" "}
                  Name{" "}
                </InputLabel>
                <StyledSelect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.name}
                  name="name"
                  label="Name"
                  onChange={handleChange}
                  size="small"
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem disabled>
                    <em>Name</em>
                  </MenuItem>
                  <MenuItem value="All">
                    <em>All</em>
                  </MenuItem>
                  {allReports.map((el: any, i: any) => {
                    return (
                      <MenuItem value={el.former.name} key={i}>
                        {el.former.name}
                      </MenuItem>
                    )
                  })}
                </StyledSelect>
              </FormControl>
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
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="status"
                mb="5px"
              >
                Bill Type
              </Typography>
              <FormControl>
                <InputLabel size="small" id="demo-simple-select-label">
                  Bill Type
                </InputLabel>
                <StyledSelect
                  type="text"
                  label="Bill Type"
                  value={formData.billtype}
                  name="billtype"
                  size="small"
                  onChange={handleChange}
                >
                  <MenuItem disabled value="ctfc">
                    <em>Bill Type</em>
                  </MenuItem>
                  <MenuItem value="Domestic Help">Domestic Help</MenuItem>
                  <MenuItem value="Medical Reimbursement">
                    Medical Reimbursement
                  </MenuItem>
                  <MenuItem value="F&Reimbursement for Defraying the Services of Orderly">
                    F&Reimbursement for Defraying the Services of Orderly
                  </MenuItem>
                  <MenuItem value="Resident Telephone/Mobile charges Reimbursement">
                    Resident Telephone/Mobile charges Reimbursement
                  </MenuItem>
                </StyledSelect>
              </FormControl>

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

     {get && allReportsByfilter.length != 0 && (
        // <DashboardNew>
        //   <PageContainer title="Bills" description="List of all the bills">
        //     <Box sx={{ overflow: "auto", width: { xs: "600px", sm: "100%" } }}>
        //       <TableContainer>
        //         <Table
        //           sx={{
        //             // display: "block",
        //             overflowX: "auto",
        //             // maxWidth: 500,
        //             minWidth: "500px",
        //             // "& .MuiTableCell-root": { border: "1px solid #333" },
        //           }}
        //           size="medium"
        //         >
        //           {get && allReportsByfilter.length != 0 && (
        //             <TableHead>
        //               <TableRow sx={{ background: "#4C7AFF" }}>
        //                 {TABLE_HEADERS.map((header, i) => (
        //                   <TableCell
        //                     key={i}
        //                     sx={{
        //                       color: "white",
        //                       padding: "15px 10px",
        //                     }}
        //                   >
        //                     {header}
        //                   </TableCell>
        //                 ))}
        //               </TableRow>
        //             </TableHead>
        //           )}

        //           <TableBody>
        //             {allReportsByfilter.map((bills: any, i: any) => {
        //               const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff"

        //               return (
        //                 <TableRow key={bills._id} sx={{ background: rowColor }}>
        //                   <TabelCellStyled>{bills.diaryNumber}</TabelCellStyled>
        //                   <TabelCellStyled>
        //                     {bills.former.name}
        //                   </TabelCellStyled>
        //                   <TabelCellStyled>{bills.billType}</TabelCellStyled>
        //                   <TabelCellStyled>
        //                     {bills.totalClaimedAmount}
        //                   </TabelCellStyled>
        //                   <TabelCellStyled>
        //                     {bills.totalAdmissibleAmount}
        //                   </TabelCellStyled>

        //                   <TabelCellStyled>
        //                     {bills.currentStatus}
        //                   </TabelCellStyled>
        //                 </TableRow>
        //               )
        //             })}
        //           </TableBody>
        //         </Table>
        //       </TableContainer>
        //     </Box>
        //   </PageContainer>
        // </DashboardNew>
        <CustomGrid   rows={allReportsByfilter}
            columns={columns}/>
      )}
      {get && allReportsByfilter.length == 0 && (
        <Typography
          sx={{
            color: "red",
          }}
        >
          No report found !!
        </Typography>
      )}
    </>
  )
}

export default DateWiseReport
