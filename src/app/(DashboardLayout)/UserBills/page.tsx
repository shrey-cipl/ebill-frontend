"use client"
import { useEffect, useState, useContext } from "react"

import dayjs from "dayjs"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/system"
import { useRouter } from "next/navigation"
import Button from "@mui/material/Button"

import { GridColDef } from "@mui/x-data-grid"
import DownloadIcon from "@mui/icons-material/Download"
import GppBadIcon from "@mui/icons-material/GppBad"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer"
import DashboardNew from "@/app/(DashboardLayout)/components/shared/DashboardNew"
import CustomModal from "@/app/(DashboardLayout)/components/CustomModal/CustomModal"

import { CosmeticContext } from "@/context/CosmeticContext/UseCosmetic.Provider"

import { BILL_MODES } from "@/config/constants"
import CustomGrid from "../components/CustomGrid"
import { exportDataToExcel, exportDataToPDF } from "@/Util/commonFunctions"

const BoxWrapper = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0 10px",
  margin: "10px 0",
  "& > p": {
    fontSize: "12px",
  },
}))

const dataToExport = (data: any) => {
  return data.map((item: any) => ({
    "User Name": item.name,
    Designation: item.designation,
    Phone: item.phone,
    "Bill No.": item.billNumber,
    "Bill Type": item.billType,
    "Bill From": dayjs(item.billPeriodFrom).format("DD-MM-YYYY"),
    "Bill To": dayjs(item.billPeriodTo).format("DD-MM-YYYY"),
    "Claimed Amt.": item.claimedAmount,
  }))
}

const UserBills = () => {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  const [billList, setBillList] = useState([])
  const [claim, setClaim] = useState([])
  // Modal states
  const [modalState, setModalState] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>({})

  const cosmeticContext = useContext(CosmeticContext)
  const { modalLoading, setModalLoading, billType } = cosmeticContext

  const router = useRouter()
  const authCtx: any = useAuth()
  console.log(authCtx?.user?.data?._id, "xcxcxccxcxcxc")
  const id = authCtx?.user?.data?._id

  console.log(billType[0], "billTypebillTypebillType")
  const handleFetchBills = async () => {
    const config = {
      url: `/api/bill/getall?billType=${billType[0]}&billType=${billType[1]}&billType=${billType[2]}&billType=${billType[3]}`,
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
        item.name = item?.former[0]?.name
        item.designation = item?.former[0]?.designation
        item.phone = item?.former[0]?.phone
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
  }, [billType])

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
      headerName: "S.NO",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
      width: 100,
    },
    { field: "billNumber", headerName: "BILL NO." },
    { field: "name", headerName: "NAME" },
    { field: "claimedAmount", headerName: "CLAIMED AMOUNT" },
    { field: "billPeriodFrom", headerName: "BILL FROM" },
    { field: "billPeriodTo", headerName: "BILL TO" },
    { field: "billType", headerName: "BILL TYPE" },
    { field: "designation", headerName: "DESIGNATION" },
    { field: "phone", headerName: "PHONE" },
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
    {
      field: "id",
      headerName: "ACTION",
      renderCell: (params) => {
        if (params.row.claim[0]) {
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
              View Claim
            </button>
          )
        } else if (!params.row.claim[0]) {
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
              onClick={() => {
                handleFetchSingleBills(params.row._id)
                  .then(() => {
                    router.push(
                      `/Bills/ManageBill?id_from_userpage=${params.row._id}&mode=${BILL_MODES.add}`
                    )
                    console.log("Route pushed successfully")
                  })
                  .catch((error) => {
                    // Handle error
                    console.error("Error pushing route:", error)
                  })
              }}
            >
              Create Claim
            </button>
          )
        }
      },
    },
    {
      field: "Download",
      headerName: "DOWNLOAD",
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
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
          >
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                exportDataToPDF(dataToExport(billList), "User Bills")
              }
            >
              PDF
            </Button>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                exportDataToExcel(dataToExport(billList), "User Bills")
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
          {selectedBill.nodata ? null : (
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
