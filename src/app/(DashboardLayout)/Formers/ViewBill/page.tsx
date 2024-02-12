"use client"
import { useEffect, useState, useContext } from "react"

import dayjs from "dayjs"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/system"
import { useRouter } from "next/navigation"

import { GridColDef } from "@mui/x-data-grid"
import DownloadIcon from "@mui/icons-material/Download"

import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer"
import DashboardNew from "@/app/(DashboardLayout)/components/shared/DashboardNew"
import CustomModal from "@/app/(DashboardLayout)/components/CustomModal/CustomModal"
import CustomGrid from "@/app/(DashboardLayout)/components/CustomGrid"

import { CosmeticContext } from "@/context/CosmeticContext/UseCosmetic.Provider"

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
      field: "s.no", // confirm this
      headerName: "S.NO",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "claimedAmount", headerName: "CLAIMED AMOUNT" },
    { field: "billType", headerName: "BILL TYPE" },

    {
      field: "billPeriodFrom",
      headerName: "BILL FROM",
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY")
      },
    },
    {
      field: "billPeriodTo",
      headerName: "BILL TO",
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY")
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
    {
      field: "id",
      headerName: "ACTION",
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
    <PageContainer title="View Bills" description="List of all the bills">
      <DashboardNew title="View Bills" titleVariant="h5">
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
