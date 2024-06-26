"use client"
import { useContext, useEffect, useState } from "react"

import dayjs from "dayjs"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/system"
import { useRouter } from "next/navigation"

import Link from "next/link"

import { GridColDef } from "@mui/x-data-grid"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import CustomModal from "../components/CustomModal/CustomModal"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import DownloadIcon from "@mui/icons-material/Download"
import { BILL_MODES } from "@/config/constants"
import CustomGrid from "../components/CustomGrid"
import { exportDataToExcel, exportDataToPDF } from "@/Util/commonFunctions"
import {
  CosmeticContext,
  useCosmetic,
} from "@/context/CosmeticContext/UseCosmetic.Provider"

const BoxWrapper = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0 10px",
  margin: "10px 0",
  "& > p": {
    fontSize: "12px",
  },
}))

const dataToExport = (data: any, visibleColumns: any) => {
  return data.map((item: any, i: any) => {
    let obj: any

    // Checks column's visibility state before printing
    // if (visibleColumns.sNo) obj = { ...obj, "S.No": i + 1 }
    if (visibleColumns.diaryNumber)
      obj = { ...obj, "Diary No.": item.diaryNumber }
    if (visibleColumns.name) obj = { ...obj, "User Name": item.name }
    if (visibleColumns.billType) obj = { ...obj, "Bill Type": item.billType }
    if (visibleColumns.billNumber) obj = { ...obj, "Bill No.": item.billNumber }
    if (visibleColumns.totalClaimedAmount)
      obj = { ...obj, "Claimed Amt.": item.totalClaimedAmount }
    if (visibleColumns.currentStatus)
      obj = { ...obj, Status: item.currentStatus }
    if (visibleColumns.lastForwardedTo)
      obj = { ...obj, "Forward To": item.lastForwardedTo }

    return obj
  })
}

const Bills = () => {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  const [billList, setBillList] = useState([])
  // Default state MUST match data grid's column's 'field' property
  const [columnVisibilityState, setColumnVisibilityState] = useState({
    diaryNumber: true,
    name: true,
    billType: true,
    billNumber: true,
    totalClaimedAmount: true,
    currentStatus: true,
    lastForwardedTo: true,
  })

  // Modal states
  const [modalState, setModalState] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>({})

  const router = useRouter()
  const authCtx: any = useAuth()

  const cosmeticContext = useContext(CosmeticContext)
  const { billType, setBillType, userbill } = cosmeticContext

  const handleFetchBills = async () => {
    let userRole = encodeURIComponent(authCtx?.user?.data?.role?.name)
    const config = {
      url: `/api/claim/getall?lastForwardedToOfficerOrLinkOfficer=${userRole}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx?.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      if (res && res.data) {
        for (let item of res?.data) {
          item.id = item._id
          item.billFilePath = item.bill.billFilePath
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

  const handleViewBill = (id: any) => {
    const filteredBill = billList.find((bill: any) => bill._id === id)

    if (filteredBill) {
      setSelectedBill(filteredBill)
      setModalState(true)
    }
  }

  const columns: GridColDef[] = [
    {
      field: "s.no", // confirm this
      headerName: "S.No",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "diaryNumber", headerName: "Diary No." },
    {
      field: "name",
      headerName: "Name",
      // renderCell: (params) => (
      //   <div style={{ whiteSpace: "break-spaces" }}>{params.value}</div>
      // ),
    },
    { field: "billType", headerName: "Bill Type" },
    { field: "billNumber", headerName: "Bill No." },
    { field: "totalClaimedAmount", headerName: "Claimed Amt." },
    // {
    //   field: "totalAdmissibleAmount",
    //   headerName: "ADMISSIBLE AMOUNT",
    // },
    // { field: "sanctionedAmount", headerName: "SANCTIONED AMOUNT" },
    { field: "currentStatus", headerName: "Status" },
    { field: "lastForwardedTo", headerName: "Forward To" },
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
    {
      field: "random_2",
      headerName: "Action",
      renderCell: (params) => {
        if (params.row.pendingBranch) {
          return (
            <Link
              style={{
                color: "#4C7AFF",
                textDecoration: "none",
              }}
              href={`/Bills/ManageBill?bill_id=${params.row._id}&mode=${BILL_MODES.update}`}
            >
              Update
            </Link>
          )
        } else {
          return (
            <button
              style={{
                background: "none",
                border: "none",
                color: "#4C7AFF",
                fontSize: "13px",
                padding: 0,
                cursor: "pointer",
              }}
              onClick={() => handleViewBill(params.row._id)}
            >
              View
            </button>
          )
        }
      },
    },
    {
      field: "Download",
      headerName: "Download",
      renderCell: (params) => {
        const downloadLink = params.row.billFilePath

        return downloadLink ? (
          <>
            <DownloadIcon
              sx={{
                color: "#4C7AFF",
              }}
            />
            <a
              href={`${backendBaseUrl}/uploads/${downloadLink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#4C7AFF",
                textDecoration: "none",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Download
            </a>
          </>
        ) : (
          <span style={{ color: "gray" }}>No file</span>
        )
      },
    },
  ]

  return (
    <PageContainer title="Claims" description="List of all the bills">
      <DashboardNew title="Claims" titleVariant="h5">
        <>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
          >
            {userbill && (
              <Button
                sx={{ background: "#9C27B0" }}
                variant="contained"
                size="small"
                onClick={() =>
                  router.push(`/Bills/ManageBill?mode=${BILL_MODES.add}`)
                }
              >
                Add New
              </Button>
            )}

            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              disabled={billList.length === 0}
              onClick={() =>
                exportDataToPDF(
                  dataToExport(billList, columnVisibilityState),
                  "Claims"
                )
              }
            >
              PDF
            </Button>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              disabled={billList.length === 0}
              onClick={() =>
                exportDataToExcel(
                  dataToExport(billList, columnVisibilityState),
                  "Claims"
                )
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
            onColumnVisibilityModelChange={(model: any) =>
              setColumnVisibilityState((prevState) => ({
                ...prevState,
                ...model,
              }))
            }
          />

          {/* BILL MODAL */}
          <CustomModal modalState={modalState} setModalState={setModalState}>
            <>
              <BoxWrapper>
                <Typography fontWeight={600}>Diary No:</Typography>
                <Typography>{selectedBill.diaryNumber}</Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Name:</Typography>
                <Typography>{selectedBill?.former?.name}</Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Claim Receiving Date:</Typography>
                <Typography>
                  {dayjs(selectedBill.claimReceivingDate).format("DD-MM-YYYY")}
                </Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Claim Period From:</Typography>
                <Typography>
                  {dayjs(selectedBill.claimPeriodFrom).format("DD-MM-YYYY")}
                </Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Claim Period To:</Typography>
                <Typography>
                  {dayjs(selectedBill.claimPeriodTo).format("DD-MM-YYYY")}
                </Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Type:</Typography>
                <Typography>{selectedBill.billType}</Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Claimed Amount:</Typography>
                <Typography>{selectedBill.totalClaimedAmount}</Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Admissible Amount:</Typography>
                <Typography>{selectedBill.totalAdmissibleAmount}</Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Sanctioned Amount:</Typography>
                <Typography>{selectedBill.sanctionedAmount}</Typography>
              </BoxWrapper>
              <BoxWrapper>
                <Typography fontWeight={600}>Status:</Typography>
                <Typography>{selectedBill.currentStatus}</Typography>
              </BoxWrapper>
            </>
          </CustomModal>
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Bills
