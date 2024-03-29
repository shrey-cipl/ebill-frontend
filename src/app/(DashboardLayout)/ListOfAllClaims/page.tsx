"use client"
import { useEffect, useState } from "react"

import dayjs from "dayjs"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import Link from "next/link"
import Button from "@mui/material/Button"

import { GridColDef } from "@mui/x-data-grid"
import CustomGrid from "../components/CustomGrid"
import { exportDataToExcel, exportDataToPDF } from "@/Util/commonFunctions"
import { Box, Dialog, DialogContent } from "@mui/material"
import ViewLog from "../components/View/ViewLog"

const dataToExport = (data: any) => {
  return data.map((item: any, i: any) => ({
    "S.No": i + 1,
    Name: item.name,
    "Diary No.": item.diaryNumber,
    "Bill Type": item.billType,
    "Bill No.": item.billNumber,
    // "Receiving Date": dayjs(item.claimReceivingDate).format("DD-MM-YYYY"),
    "Claimed Amount": item.totalClaimedAmount,
    // "Sanctioned Amount": item.sanctionedAmount,
    // "Claim From": dayjs(item.claimPeriodFrom).format("DD-MM-YYYY"),
    // "Claimed To": dayjs(item.claimPeriodTo).format("DD-MM-YYYY"),
    // "Admissible Amount": item.totalAdmissibleAmount,
    Status: item.currentStatus,
    "Pending Branch": item.pendingBranch,
    "Forward To": item.lastForwardedTo,
  }))
}

const ListOfAllClaims = () => {
  const [billList, setBillList] = useState([])
  const [id, setId] = useState("")

  const [open, setOpen] = useState(false)
  const handleOpenPopup: any = () => {
    setOpen(true)
  }
  const handleClosePopup: any = () => {
    setOpen(false)
  }

  const authCtx: any = useAuth()

  const handleFetchBills = async () => {
    let userRole = encodeURIComponent(authCtx?.user?.data?.role?.name)
    const config = {
      url: `/api/claim/getall?claimAccesedByUser=${userRole}`,
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

  const DialogBox = {
    padding: "10px 20px",
  }

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
    // {
    //   field: "claimReceivingDate",
    //   headerName: "RECEIVING DATE",
    //   valueFormatter: (params) => {
    //     return dayjs(params.value).format("YYYY-MM-DD")
    //   },
    // },
    { field: "totalClaimedAmount", headerName: "CLAIMED AMOUNT" },
    // { field: "sanctionedAmount", headerName: "SANCTIONED AMOUNT" },
    { field: "currentStatus", headerName: "STATUS" },
    {
      field: "pendingBranch",
      headerName: "PENDING BRANCH",
      valueFormatter: (params) => {
        return `Pending at ${params.value}`
      },
    },
    // {
    //   field: "createdAt",
    //   headerName: "CREATED AT",

    //   valueFormatter: (params) => {
    //     return dayjs(params.value).format("DD-MM-YYYY h:mm A")
    //   },
    // },
    // {
    //   field: "updatedAt",
    //   headerName: "UPDATED ON",

    //   valueFormatter: (params) => {
    //     return dayjs(params.value).format("DD-MM-YYYY h:mm A")
    //   },
    // },
    { field: "lastForwardedTo", headerName: "FORWARD TO" },
    {
      field: "random_2",
      headerName: "CHANNEL LOG",
      renderCell: (params) => {
        return (
          <Button
            style={{
              color: "#4C7AFF",
              textDecoration: "none",
            }}
            onClick={() => {
              setId(params.row._id)
              handleOpenPopup()
            }}
            // href={`/Bills/View?bill_id=${params.row._id}`}
          >
            Log
          </Button>
        )
      },
    },
  ]

  return (
    <PageContainer title="List of all Claims" description="List">
      <DashboardNew title="List of all Claims" titleVariant="h5">
        <>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
          >
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                exportDataToPDF(dataToExport(billList), "List of all Claims")
              }
            >
              PDF
            </Button>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                exportDataToExcel(dataToExport(billList), "List of all Claims")
              }
            >
              Excel
            </Button>
          </div>
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
          {open && (
            <Dialog
              fullWidth
              sx={DialogBox}
              open={open}
              onClose={handleClosePopup}
            >
              <ViewLog Id={id} />
            </Dialog>
          )}
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default ListOfAllClaims
