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

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import CustomModal from "../components/CustomModal/CustomModal"
import Pagination from "../components/Pagination/Pagination"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

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

  const [newData, setNewData] = useState([])

  const authCtx: any = useAuth()

  const handleFetchBills = async () => {
    const config = {
      url: `/api/claim/getall?limit=10&page=${pageNo}&name=${filterInputs.name}&diaryNumber=${filterInputs.diaryNumber}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx?.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)
      setBillList(res.data)
      // if (String(res.status).charAt(0) === "2") {
      // }
    } catch (err: any) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    const getData = async () => {
      const config = {
        url: `/api/claim/getall`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx?.user?.token}`,
        },
      }

      try {
        const res: any = await axiosApi(
          config.url,
          config.method,
          config.headers
        )

        for (let item of res.data) {
          item.id = item._id
        }

        setNewData(res.data)
        // if (String(res.status).charAt(0) === "2") {
        // }
      } catch (err: any) {
        console.log(err.message)
      }
    }

    getData()
  }, [pageNo, tempCounter, authCtx?.user?.token])

  // collect bills and updates list
  useEffect(() => {
    handleFetchBills()
  }, [pageNo, tempCounter, authCtx?.user?.token])

  const handleViewBill = (id: any) => {
    const filteredBill = newData.find((bill: any) => bill._id === id)

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

  const columns: GridColDef[] = [
    {
      field: "ranodm_1", // confirm this
      headerName: "S.No",
      valueGetter: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "diaryNumber", headerName: "Diary No." },
    { field: "name", headerName: "Name" },
    { field: "billType", headerName: "Type" },
    { field: "totalClaimedAmount", headerName: "Claimed Amount" },
    {
      field: "totalAdmissibleAmount",
      headerName: "Admissible Amount",
    },
    { field: "sanctionedAmount", headerName: "Sanctioned Amount" },
    { field: "currentStatus", headerName: "Status" },
    {
      field: "updatedAt",
      headerName: "Last Updated",

      valueFormatter: (params) => {
        return dayjs(params.value).format("YYYY-MM-DD")
      },
    },
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
  ]

  return (
    <PageContainer title="Bills" description="List of all the bills">
      <DashboardNew title="Bills" titleVariant="h5">
        <>
          <DataGrid
            rows={newData}
            columns={columns}
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
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
          {/* <Box>
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
            <Table
              sx={{
                display: "block",
                overflowX: "auto",
                minWidth: "500px",
                width: "100%",
              }}
            >
              <TableHead sx={{ width: "100%" }}>
                <TableRow sx={{ background: "#4C7AFF", width: "100%" }}>
                  {BILLS_HEADERS.map((header, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        color: "white",
                        padding: "5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {billList.map((bill: any, i: any) => {
                  const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff"

                  const itemNumber = (pageNo - 1) * 10 + (i + 1)

                  return (
                    <TableRow key={bill._id} sx={{ background: rowColor }}>
                      <TabelCellStyled>{`${itemNumber}.`}</TabelCellStyled>
                      <TabelCellStyled>{bill.diaryNumber}</TabelCellStyled>
                      <TabelCellStyled>{bill.former.name}</TabelCellStyled>
                      <TabelCellStyled>{bill.billType}</TabelCellStyled>
                      <TabelCellStyled>
                        {bill.totalClaimedAmount}
                      </TabelCellStyled>
                      <TabelCellStyled>
                        {bill.totalAdmissibleAmount}
                      </TabelCellStyled>
                      <TabelCellStyled>{bill.sanctionedAmount}</TabelCellStyled>
                      <TabelCellStyled
                        sx={{
                          color:
                            bill.currentStatus === "Open" ? "green" : "red",
                        }}
                      >
                        {bill.currentStatus}
                      </TabelCellStyled>
                      <TabelCellStyled>
                        {dayjs(bill.updatedAt).format("YYYY-MM-DD")}
                      </TabelCellStyled>
                      <TabelCellStyled>
                        {bill.pendingBranch ? (
                          <Link
                            style={{
                              color: "#4C7AFF",
                              textDecoration: "none",
                            }}
                            href={`/Bills/ManageBill?bill_id=${bill._id}&mode=${BILL_MODES.update}`}
                          >
                            Update
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
                        )}
                      </TabelCellStyled>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
          <Pagination
            url={`/api/claim/getall?name=${filterInputs.name}&diaryNumber=${filterInputs.diaryNumber}`}
            data={billList}
            setPageNo={setPageNo}
          /> */}

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
