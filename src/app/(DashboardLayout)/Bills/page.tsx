"use client"
import { useEffect, useState } from "react"

import dayjs from "dayjs"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import { styled } from "@mui/system"
import { useRouter } from "next/navigation"
import Link from "next/link"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import CustomModal from "../components/CustomModal/CustomModal"
import Pagination from "../components/Pagination/Pagination"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useDemoData } from '@mui/x-data-grid-generator';

// ... (Other imports remain unchanged)

// Define the columns for the DataGrid
const columns: GridColDef[] = [
  { field: "sNo", headerName: "S.No", width: 100 },
  { field: "diaryNumber", headerName: "Diary No.", width: 150 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "claimedAmount", headerName: "Claimed Amount", width: 180 },
  { field: "admissibleAmount", headerName: "Admissible Amount", width: 200 },
  { field: "sanctionedAmount", headerName: "Sanctioned Amount", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "lastUpdated", headerName: "Last Updated", width: 180 },
  { field: "action", headerName: "Action", width: 150 },
];

const BILLS_HEADERS = [
  "S.No",
  "Diary No.",
  "Name",
  "Type",
  "Claimed Amount",
  "Admissible Amount",
  "Sanctioned Amount",
  "Status",
  "Last Updated",
  "Action",
]

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

const OptionsWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px",
  marginBottom: "10px",
}))

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 5px",
  wordBreak: "normal",
}))

let tempCounter = 0

const Bills = () => {
  const [billList, setBillList] = useState<any>([])
  const [filterInputs, setFilterInputs] = useState({
    name: "",
    diaryNumber: "",
  })
  const [pageNo, setPageNo] = useState(1)
  const router = useRouter()
  // Modal states
  const [modalState, setModalState] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>({})

  const authCtx: any = useAuth()

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

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
      // console.log(res,"ressssssssssssssssssssss");
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
  }, [pageNo, tempCounter, authCtx?.user?.token])

  const handleViewBill = (id: any) => {
    const filteredBill = billList.find((bill: any) => bill._id === id)

    if (filteredBill) {
      setSelectedBill(filteredBill)
      setModalState(true)
    }
  }

  const handleFilterInputs = (e: any) => {
    setFilterInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleClearFilters = () => {
    setFilterInputs({
      name: "",
      diaryNumber: "",
    })

    tempCounter += 1
  }
  console.log(billList)
  return (
    <PageContainer title="Bills" description="List of all the bills">
      <DashboardNew title="Bills" titleVariant="h5">
        <>
          <Box>
            <OptionsWrapper>
              <Button
                sx={{ marginTop: "-23px" }}
                variant="contained"
                size="small"
                onClick={() =>
                  router.push(`/Bills/ManageBill?mode=${BILL_MODES.add}`)
                }
              >
                Add New
              </Button>
              <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Typography>Search By:</Typography>
                <TextField
                  name="name"
                  size="small"
                  placeholder="Name"
                  value={filterInputs.name}
                  onChange={handleFilterInputs}
                  sx={{ width: "125px" }}
                />
                <TextField
                  name="diaryNumber"
                  size="small"
                  placeholder="Diary No."
                  value={filterInputs.diaryNumber}
                  onChange={handleFilterInputs}
                  sx={{ width: "125px" }}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{ background: "#9C27B0" }}
                  onClick={() => {
                    setPageNo(1)
                    handleFetchBills()
                  }}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  sx={{ background: "#9C27B0" }}
                  size="small"
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              </Box>
            </OptionsWrapper>
          </Box>
          <Box>
            {/* Replace Table with DataGrid */}
            <DataGrid
              rows={billList.map((bill: any, i: number) => ({
                id: bill._id,
                sNo: (pageNo - 1) * 10 + (i + 1),
                diaryNumber: bill.diaryNumber,
                name: bill.former.name,
                type: bill.billType,
                claimedAmount: bill.totalClaimedAmount,
                admissibleAmount: bill.totalAdmissibleAmount,
                sanctionedAmount: bill.sanctionedAmount,
                status: bill.currentStatus,
                lastUpdated: dayjs(bill.updatedAt).format("YYYY-MM-DD"),
                action: bill.pendingBranch ? (
      <Link href={`/Bills/ManageBill?bill_id=${bill._id}&mode=${BILL_MODES.update}`}>
        <a style={{ color: "#4C7AFF", textDecoration: "none" }}>Update</a>
      </Link>
    ) : (
      <button
        style={{
          background: "none",
          border: "none",
          color: "#4C7AFF",
          fontSize: "13px",
          padding: 0,
          cursor: "pointer",
        }}
        onClick={() => handleViewBill(bill._id)}
      >
        View
      </button>
    ),
              }))}
              columns={columns}
              // pageSize={10}
             
              // onPageChange={(newPage:any) => setPageNo(newPage + 1)}
              initialState={{
                ...data.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              autoHeight
            />
          </Box>
          <Pagination
            url={`/api/claim/getall?name=${filterInputs.name}&diaryNumber=${filterInputs.diaryNumber}`}
            data={billList}
            setPageNo={setPageNo}
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
                  {dayjs(selectedBill.claimReceivingDate).format("YYYY-MM-DD")}
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
            </>
          </CustomModal>
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Bills
