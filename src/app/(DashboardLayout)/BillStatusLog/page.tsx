"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import Typography from "@mui/material/Typography"

import Box from "@mui/material/Box"
import { styled } from "@mui/system"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

import DashboardNew from "../components/shared/DashboardNew"
const DATA_FIELDS = [
  {
    id: "diaryNumber",
    fieldName: "Diary Number",
    type: "number",
  },
  {
    id: "claimReceivingDate",
    fieldName: "Claim Receiving Date (YYYY-MM-DD)",
    type: "date",
  },
  {
    id: "billType",
    fieldName: "Bill Type",
    type: "select",
    selectOptions: [
      "Domestic Help",
      "Medical Reimbursement",
      "Reimbursement for Defraying the Services of Orderly",
    ],
  },
  {
    id: "name",
    fieldName: "Name",
    type: "select",
  },
  {
    id: "claimPeriodFrom",
    fieldName: "Claimed Period From",
    type: "date",
  },
  {
    id: "claimPeriodTo",
    fieldName: "Claimed Period To",
    type: "date",
  },
  {
    id: "totalClaimedAmount",
    fieldName: "Total Claimed Amount",
    type: "number",
  },
  {
    id: "totalAdmissibleAmount",
    fieldName: "Total Amissible Amount",
    type: "number",
  },
  {
    id: "currentStatus",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Open", "Closed"],
  },
  {
    id: "lastForwardedTo",
    fieldName: "Forward To",
    type: "select",
    selectOptions: [
      "Asst. Section Officer Admin I",
      "Asst. Section Officer Admin IV",
      "Section Officer Admin I",
      "Section Officer Admin IV",
      "Under Secretary",
      "Deputy Secretary Admin",
      "Joint Secretary Admin",
      "Asst. Section Officer General II",
      "Section Officer General II",
      "Under Secretary General II",
      "Deputy Secretary General",
      "Joint Secretary General",
      "Accounts I",
      "Accounts II",
      "Accounts IV",
      "F&BO",
      "System Admin",
      "PAO",
      "Additional Secretary Office",
      "Secretary Office",
      "Chairman Office",
    ],
  },
  {
    id: "currentremark",
    fieldName: "Comments",
    type: "text",
  },
]

const UPDATE_FIELDS = [
  {
    id: "sanctionedAmount",
    fieldName: "Sanctioned Amount",
    type: "number",
  },
  {
    id: "PFMS",
    fieldName: "PFMS",
    type: "number",
  },
  {
    id: "billProcessingStartDate",
    fieldName: "Bill Processing Start Date",
    type: "date",
  },
]
const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 5px",
  // wordBreak: "break-all",
}))

const TABLE_HEADERS = ["S.No", "Date", "From", "To", "Status", "Remarks"]
// Add to constants folder
const BILL_MODES = { add: "add_bill", update: "update_bill" }

const initialFieldState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of DATA_FIELDS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""
}

const initialUpdateModeFields: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of UPDATE_FIELDS) {
  if (!initialUpdateModeFields[arrEl.id]) initialUpdateModeFields[arrEl.id] = ""
}

const BillStatusLog = () => {
  const [allReportsByfilter, setAllReportsByfilter]: any = useState([
    {
      status: "Open",
      remarks: "1st remark",
      forwardedBy: "Asst. Section Officer Admin IV",
      forwardedTo: "Joint Secretary Admin",
      forwardedAt: "2023-08-22T08:35:53.209Z",
    },
  ])
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  return (
    <>
      <DashboardNew>
        <Box sx={{ overflow: "auto", width: { xs: "600px", sm: "100%" } }}>
          <TableContainer>
            <Typography
              sx={{
                fontWeight: "800",
              }}
            >
              {name}
            </Typography>
            <Table
              sx={{
                // display: "block",
                overflowX: "auto",
                // maxWidth: 500,
                minWidth: "500px",
                // "& .MuiTableCell-root": { border: "1px solid #333" },
              }}
              size="medium"
            >
              <TableHead>
                <TableRow sx={{ background: "#4C7AFF" }}>
                  {TABLE_HEADERS.map((header, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        color: "white",
                        padding: "5px",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allReportsByfilter.map((bills: any, i: any) => {
                  const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff"

                  return (
                    <TableRow key={bills._id} sx={{ background: rowColor }}>
                      <TabelCellStyled>{i + 1}</TabelCellStyled>
                      <TabelCellStyled>
                        {bills.forwardedAt.substring(0, 10)}
                      </TabelCellStyled>
                      <TabelCellStyled>{bills.forwardedBy}</TabelCellStyled>
                      <TabelCellStyled>{bills.forwardedTo}</TabelCellStyled>
                      <TabelCellStyled>{bills.status}</TabelCellStyled>
                      <TabelCellStyled>{bills.remarks}</TabelCellStyled>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DashboardNew>
    </>
  )
}
export default BillStatusLog
