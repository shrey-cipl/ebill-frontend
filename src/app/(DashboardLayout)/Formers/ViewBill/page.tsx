"use client"
import { useEffect, useState, useContext } from "react"

import dayjs from "dayjs"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/system"
import { useRouter } from "next/navigation"

import Link from "next/link"

import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid"
import DownloadIcon from "@mui/icons-material/Download"

import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer"
import DashboardNew from "@/app/(DashboardLayout)/components/shared/DashboardNew"
import CustomModal from "@/app/(DashboardLayout)/components/CustomModal/CustomModal"

import {
  CosmeticContext,
  useCosmetic,
} from "@/context/CosmeticContext/UseCosmetic.Provider"
import { CircularProgress } from "@mui/material"
const BILL_MODES = { add: "add_bill", update: "update_bill" }

const BoxWrapper = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0 10px",
  margin: "10px 0",
  "& > p": {
    fontSize: "12px",
  },
}))

const Bills = () => {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  const [billList, setBillList] = useState([])
  const [claim, setClaim] = useState([])
  // Modal states
  const [modalState, setModalState] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>({})

  const cosmeticContext = useContext(CosmeticContext)
  const { modalLoading, setModalLoading } = cosmeticContext

  const router = useRouter()
  const authCtx: any = useAuth()
  console.log(authCtx?.user?.data?._id, "xcxcxccxcxcxc")
  const id = authCtx?.user?.data?._id
  const handleFetchBills = async () => {
    const config = {
      url: `/api/bill/getBillsByFormerId/${id}`,
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

  const handleFetchSingleBills = async (id: any) => {
    setModalLoading(true)
    console.log(id)
    const config = {
      url: `/api/claim/getClaimByBillId/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx?.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)
      console.log(res.data, "ggggggg")
      // for (let item of res.data) {
      //   item.id = item._id
      // }
      await handleViewBill(res.data)

      // setClaim(res.data)
      // if (String(res.status).charAt(0) === "2") {
      // }
      console.log("no error")
    } catch (err: any) {
      console.log("eroror")
      await handleViewBill({ nodata: "NO Claim Found" })
      console.log(err.message)
    } finally {
      setModalLoading(false) // Set modal loading to false after fetching modal data
    }
  }
  // collect bills and updates list
  useEffect(() => {
    handleFetchBills()
  }, [authCtx?.user?.token])

  const handleViewBill = async (data: any) => {
    // const filteredBill = billList.find((bill: any) => bill._id === id)

    // if (filteredBill) {
    await setSelectedBill({ ...data })
    setModalState(true)
    // }
  }

  const columns: GridColDef[] = [
    {
      field: "ranodm_1", // confirm this
      headerName: "S.No",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "claimedAmount", headerName: "claimed Amount" },
    { field: "billPeriodFrom", headerName: "bill Period From" },
    { field: "billPeriodTo", headerName: "bill Period To" },
    { field: "billType", headerName: "bill Type" },
    {
      field: "createdAt",
      headerName: "Created At",

      valueFormatter: (params) => {
        return dayjs(params.value).format("YYYY-MM-DD")
      },
    },
    {
      field: "id",
      headerName: "Action",
      renderCell: (params) => {
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
            onClick={() => handleFetchSingleBills(params.row._id)}
          >
            View
          </button>
        )
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
  console.log(billList)
  console.log(claim)
  return (
    <PageContainer title="View Bills" description="List of all the bills">
      <DashboardNew title="View Bills" titleVariant="h5">
        <>
          {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
          </div> */}
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

          {selectedBill.nodata ? (
            <CustomModal modalState={modalState} setModalState={setModalState}>
              <BoxWrapper>
                <Typography>{selectedBill.nodata}</Typography>
              </BoxWrapper>
            </CustomModal>
          ) : (
            <>
              <CustomModal
                modalState={modalState}
                setModalState={setModalState}
              >
                <BoxWrapper>
                  <Typography fontWeight={600}>Diary No:</Typography>
                  <Typography>{selectedBill.diaryNumber}</Typography>
                </BoxWrapper>
                <BoxWrapper>
                  <Typography fontWeight={600}>Name:</Typography>
                  <Typography>{selectedBill?.former?.name}</Typography>
                </BoxWrapper>
                <BoxWrapper>
                  <Typography fontWeight={600}>
                    Claim Receiving Date:
                  </Typography>
                  <Typography>
                    {dayjs(selectedBill.claimReceivingDate).format(
                      "YYYY-MM-DD"
                    )}
                  </Typography>
                </BoxWrapper>
                <BoxWrapper>
                  <Typography fontWeight={600}>Claim Period From:</Typography>
                  <Typography>
                    {dayjs(selectedBill.claimPeriodFrom).format("YYYY-MM-DD")}
                  </Typography>
                </BoxWrapper>
                <BoxWrapper>
                  <Typography fontWeight={600}>Claim Period To:</Typography>
                  <Typography>
                    {dayjs(selectedBill.claimPeriodTo).format("YYYY-MM-DD")}
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
              </CustomModal>
            </>
          )}
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Bills
