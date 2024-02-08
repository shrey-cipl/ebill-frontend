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
import CustomGrid from "../components/CustomGrid"

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

      if (res && res.data) {
        for (let item of res.data) {
          item.id = item._id
          item.billNumber = item.bill.billNumber
        }

        setBillList(res.data)
      }
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
      field: "s.no", // confirm this
      headerName: "S.NO",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "name", headerName: "NAME" },
    { field: "diaryNumber", headerName: "DAIRY NO." },
    { field: "billType", headerName: "BILL TYPE" },
    { field: "billNumber", headerName: "BILL NO." },
    {
      field: "claimReceivingDate",
      headerName: "RECEIVING DATE",
      valueFormatter: (params) => {
        return dayjs(params.value).format("YYYY-MM-DD")
      },
    },
    { field: "totalClaimedAmount", headerName: "CLAIMED AMOUNT" },
    { field: "sanctionedAmount", headerName: "SANCTIONED AMOUNT" },
    { field: "currentStatus", headerName: "BILL STATUS" },
    {
      field: "pendingBranch",
      headerName: "PENDING BRANCH",
      valueFormatter: (params) => {
        return `Pending at ${params.value}`
      },
    },
    {
      field: "createdAt",
      headerName: "CREATED AT",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A")
      },
    },
    {
      field: "updatedAt",
      headerName: "UPDATED ON",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A")
      },
    },
    { field: "lastForwardedTo", headerName: "FORWARD TO" },
    {
      field: "random_2",
      headerName: "CHANNEL LOG",
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
          <CustomGrid
            rows={billList}
            columns={columns}
            sx={{
              ".text-green": {
                color: "green",
              },
              ".text-red": {
                color: "red",
              },
            }}
            getCellClassName={(params: any) => {
              if (params.field === "currentStatus") {
                return params.row.currentStatus === "Open"
                  ? "text-green"
                  : "text-red"
              }

              return ""
            }}
          />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default ListOfAllBills
