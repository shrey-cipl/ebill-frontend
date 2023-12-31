"use client"
import { useEffect, useState } from "react"

import axios from "axios"
import dayjs from "dayjs"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Box from "@mui/material/Box"
import Fab from "@mui/material/Fab"
import { styled } from "@mui/system"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import Pagination from "../components/Pagination/Pagination"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import Link from "next/link"

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid"

const LIST_OF_BILLS_HEADERS = [
  "S.No",
  "Name",
  "Diary No.",
  "Bill Type",
  "Receiving Date",
  "Claimed Amount",
  "Sanctioned Amount",
  "Bill Status",
  "Pending Branch",
  "Updated on",
  "Forward To",
  "Channel Log",
]

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 5px",
}))

const ListOfAllBills = () => {
  const [billList, setBillList] = useState([])

  const authCtx: any = useAuth()

  const handleFetchBills = async () => {
    const config = {
      url: `/api/claim/getall`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx?.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      for (let item of res.data) {
        item.id = item._id
      }

      setBillList(res.data)
      // if (String(res.status).charAt(0) === "2") {
      // }
    } catch (err: any) {
      console.log(err.message)
    }
  }

  // collect bills and updates list
  useEffect(() => {
    handleFetchBills()
  }, [authCtx?.user?.token])

  const columns: GridColDef[] = [
    {
      field: "ranodm_1", // confirm this
      headerName: "S.No",
      valueGetter: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "name", headerName: "Name" },
    { field: "diaryNumber", headerName: "Diary No." },
    { field: "billType", headerName: "Bill Type" },
    {
      field: "claimReceivingDate",
      headerName: "Receiving Date",
      valueFormatter: (params) => {
        return dayjs(params.value).format("YYYY-MM-DD")
      },
    },
    { field: "totalClaimedAmount", headerName: "Claimed Amount" },
    { field: "sanctionedAmount", headerName: "Sanctioned Amount" },
    { field: "currentStatus", headerName: "Bill Status" },
    {
      field: "pendingBranch",
      headerName: "Pending Branch",
      valueFormatter: (params) => {
        return `Pending at ${params.value}`
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated On",
      valueFormatter: (params) => {
        return dayjs(params.value).format("YYYY-MM-DD")
      },
    },
    { field: "lastForwardedTo", headerName: "Forward To" },
    {
      field: "random_2",
      headerName: "Channel Log",
      renderCell: (params) => {
        return (
          <Link
            style={{
              color: "#4C7AFF",
              textDecoration: "none",
            }}
            href={`/Bills/View?bill_id=${params.row._id}`}
          >
            Log
          </Link>
        )
      },
    },
  ]

  return (
    <PageContainer title="List" description="List">
      <DashboardNew title="All Bills Report" titleVariant="h5">
        <>
          <DataGrid
            rows={billList}
            columns={columns}
            density="compact"
            sx={{
              ".bg-light": {
                bgcolor: "#eee",
                // "&:hover": {
                //   bgcolor: "darkgrey",
                // },
              },
              ".bg-dark": {
                bgcolor: "#fff",
              },
              ".text-green": {
                color: "green",
              },
              ".text-red": {
                color: "red",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#4C7AFF",
                color: "#ffffff",
                // fontWeight: "600",
                // fontSize: "16px",
              },
            }}
            getRowClassName={(params) => {
              return (params.indexRelativeToCurrentPage + 1) % 2 === 0
                ? "bg-light"
                : "bg-dark"
            }}
            getCellClassName={(params) => {
              if (params.field === "currentStatus") {
                return params.row.currentStatus === "Open"
                  ? "text-green"
                  : "text-red"
              }

              return ""
            }}
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            pageSizeOptions={[25, 50, 100]}
          />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default ListOfAllBills
