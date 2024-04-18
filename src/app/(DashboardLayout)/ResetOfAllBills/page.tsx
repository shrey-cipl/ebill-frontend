"use client"
import { useEffect, useState } from "react"

import dayjs from "dayjs"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import Link from "next/link"

import { GridColDef } from "@mui/x-data-grid"
import CustomGrid from "../components/CustomGrid"
import { Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack"

const ResetOfAllBills = () => {
  const [billList, setBillList] = useState<any>([])

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
      headerName: "S.No",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "name", headerName: "Name" },
    { field: "diaryNumber", headerName: "Dairy No." },
    { field: "billType", headerName: "Bill Type TYPE" },
    { field: "billNumber", headerName: "Bill No." },
    {
      field: "claimReceivingDate",
      headerName: "Receiving Date",
      valueFormatter: (params) => {
        return dayjs(params.value).format("YYYY-MM-DD")
      },
    },
    { field: "totalClaimedAmount", headerName: "Claimed Amt." },
    { field: "sanctionedAmount", headerName: "Sanctioned Amt." },
    { field: "currentStatus", headerName: "Bill Status" },
    {
      field: "pendingBranch",
      headerName: "Pending Branch",
      valueFormatter: (params) => {
        return `Pending at ${params.value}`
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A")
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated On",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A")
      },
    },
    { field: "lastForwardedTo", headerName: "Forward To TO" },
    {
      field: "random_2",
      headerName: "Channel Log",
      renderCell: (params) => {
        console.log(params.row.bill.claim)
        return (
          <Typography
            sx={{
              color: "blue",
              cursor: "pointer",
            }}
            onClick={async () => {
              const config = {
                url: `/api/claim/resetClaimToLast`,
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${authCtx?.user?.token}`,
                },
                data: {
                  claimId: params.row.bill.claim,
                },
              }

              try {
                const res = await axiosApi(
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
                }
              } catch (err: any) {
                console.log(err.message)
              }
            }}
          >
            Roll back
          </Typography>
        )
      },
    },
  ]

  return (
    <PageContainer title="Reset Bill Status" description="List">
      <DashboardNew title="Reset Bill Status" titleVariant="h5">
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

export default ResetOfAllBills
