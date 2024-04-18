"use client"
import { useEffect, useState, useContext } from "react"

import dayjs from "dayjs"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/system"

import { GridColDef } from "@mui/x-data-grid"
import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"

import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer"
import DashboardNew from "@/app/(DashboardLayout)/components/shared/DashboardNew"
import CustomModal from "@/app/(DashboardLayout)/components/CustomModal/CustomModal"
import CustomGrid from "@/app/(DashboardLayout)/components/CustomGrid"

import { CosmeticContext } from "@/context/CosmeticContext/UseCosmetic.Provider"
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

const dataToExport = (data: any, visibleColumns: any) => {
  return data.map((item: any) => {
    let obj: any

    // Checks column's visibility state before printing
    if (visibleColumns.claimedAmount)
      obj = { ...obj, "Claimed Amt.": item.claimedAmount }
    if (visibleColumns.billType) obj = { ...obj, "Bill Type": item.billType }
    if (visibleColumns.billNumber) obj = { ...obj, "Bill No.": item.billNumber }
    if (visibleColumns.billPeriodFrom)
      obj = {
        ...obj,
        "Bill From": dayjs(item.billPeriodFrom).format("DD-MM-YYYY"),
      }
    if (visibleColumns.billPeriodTo)
      obj = { ...obj, "Bill To": dayjs(item.billPeriodTo).format("DD-MM-YYYY") }

    return obj
  })
}

const ViewBills = () => {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  const [billList, setBillList] = useState([])

  // Modal states
  const [modalState, setModalState] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>({})

  // Default state MUST match data grid's column's 'field' property
  const [columnVisibilityState, setColumnVisibilityState] = useState({
    claimedAmount: true,
    billType: true,
    billPeriodFrom: true,
    billPeriodTo: true,
    billNumber: true,
    // createdAt: true,
    // updatedAt: true
  })

  const cosmeticContext = useContext(CosmeticContext)
  const { modalLoading, setModalLoading } = cosmeticContext

  const authCtx: any = useAuth()
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

      // for (let item of res.data) {
      //   item.id = item._id
      // }
      await handleViewBill(res.data)

      // setClaim(res.data)
      // if (String(res.status).charAt(0) === "2") {
      // }
    } catch (err: any) {
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
      headerName: "S.No",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "claimedAmount", headerName: "Claimed Amt." },
    { field: "billType", headerName: "Bill Type" },
    { field: "billNumber", headerName: "Bill No." },

    {
      field: "billPeriodFrom",
      headerName: "Bill From",
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY")
      },
    },
    {
      field: "billPeriodTo",
      headerName: "Bill To",
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY")
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
    <PageContainer title="View Bills" description="List of all the bills">
      <DashboardNew title="View Bills" titleVariant="h5">
        <>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
          >
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              disabled={billList.length === 0}
              onClick={() =>
                exportDataToPDF(
                  dataToExport(billList, columnVisibilityState),
                  "Former Bills"
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
                  "Former Bills"
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

export default ViewBills
