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
import GppBadIcon from "@mui/icons-material/GppBad"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer"
import DashboardNew from "@/app/(DashboardLayout)/components/shared/DashboardNew"
import CustomModal from "@/app/(DashboardLayout)/components/CustomModal/CustomModal"

import {
  CosmeticContext,
  useCosmetic,
} from "@/context/CosmeticContext/UseCosmetic.Provider"
import { Box, CircularProgress } from "@mui/material"
import CustomGrid from "../components/CustomGrid"
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

const UserBills = () => {
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
      url: `/api/bill/getall`,
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
        item.name = item.former.name
        item.designation = item.former.designation
        item.phone = item.former.phone
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
      console.log(res.data, "Llllllllllllllllllllllllllll")
      await handleViewBill(res.data)

      // return
      // setClaim(res.data)
      // if (String(res.status).charAt(0) === "2") {
      // }
      console.log("no error")
    } catch (err: any) {
      console.log("eroror")

      // console.log(err,"Llllllllllllllllllllllllllll");
      await handleViewBill({
        id,
        nodata: "NO Claim Found",
      })
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
      field: "s.no", // confirm this
      headerName: "S.No",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
      width: 100,
    },
    { field: "billNumber", headerName: "Bill Number" },
    { field: "name", headerName: "Name" },
    { field: "claimedAmount", headerName: "claimed Amount" },
    { field: "billPeriodFrom", headerName: "bill Period From" },
    { field: "billPeriodTo", headerName: "bill Period To" },
    { field: "billType", headerName: "bill Type" },
    { field: "designation", headerName: "Designation" },
    { field: "phone", headerName: "Phone" },
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

  return (
    <PageContainer title="User Bills" description="List of all the bills">
      <DashboardNew title="User Bills" titleVariant="h5">
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
          {selectedBill.nodata ? (
            <CustomModal
              modalState={modalState}
              setModalState={setModalState}
              altBtnText="Create"
              altBtnFn={() =>
                router.push(
                  `/Bills/ManageBill?id_from_userpage=${selectedBill.id}&mode=${BILL_MODES.add}`
                )
              }
            >
              <BoxWrapper
                sx={{
                  // justifyContent:"center",
                  alignItems: "center",
                  mt: 9,
                  // border:"2px solid black"
                }}
              >
                <GppBadIcon
                  sx={{
                    fontSize: 70,
                    ml: 12,
                    color: "#921a9e",
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    mr: 5,
                  }}
                >
                  No Claim Found
                </Typography>
              </BoxWrapper>
            </CustomModal>
          ) : (
            <>
              <CustomModal
                modalState={modalState}
                setModalState={setModalState}
                showCloseButton={false}
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
                <BoxWrapper></BoxWrapper>
              </CustomModal>
            </>
          )}
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default UserBills
