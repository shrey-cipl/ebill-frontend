import { Typography } from "@mui/material"
import CustomGrid from "../CustomGrid"
import { GridColDef } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import dayjs from "dayjs"

import { exportDataToExcel, exportDataToPDF } from "@/Util/commonFunctions"

interface FilterTableProps {
  allReportsByfilter: any
  get: any
}

const columns: GridColDef[] = [
  {
    field: "s.no", // confirm this
    headerName: "S.No",
    valueGetter: (params: any) =>
      params.api.getAllRowIds().indexOf(params.id) + 1,
    width: 100,
  },
  { field: "diaryNumber", headerName: "Diary No." },
  { field: "name", headerName: "Name" },
  { field: "billType", headerName: "Bill Type" },
  { field: "totalAdmissibleAmount", headerName: "Admissible Amt." },
  {
    field: "sanctionedAmount",
    headerName: "Sanctioned Amt.",
  },
  {
    field: "currentStatus",
    headerName: "Status",
  },
]

const dataToExport = (data: any) => {
  return data.map((item: any) => ({
    "Diary No.": item.diaryNumber,
    "Bill No.": item.bill.billNumber,
    "Bill Type": item.billType,
    "User Name": item.name,
    "Receiving Date": dayjs(item.claimReceivingDate).format("DD-MM-YYYY"),
    "Claim From": dayjs(item.claimPeriodFrom).format("DD-MM-YYYY"),
    "Claimed To": dayjs(item.claimPeriodTo).format("DD-MM-YYYY"),
    "Claimed Amt.": item.totalClaimedAmount,
    "Admissible Amt.": item.totalAdmissibleAmount,
  }))
}

const FilterTable = ({ allReportsByfilter, get }: FilterTableProps) => {
  return (
    <>
      {get && allReportsByfilter.length != 0 && (
        <>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
          >
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              disabled={allReportsByfilter.length === 0}
              onClick={() =>
                exportDataToPDF(dataToExport(allReportsByfilter), "Report")
              }
            >
              PDF
            </Button>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              disabled={allReportsByfilter.length === 0}
              onClick={() =>
                exportDataToExcel(dataToExport(allReportsByfilter), "Report")
              }
            >
              Excel
            </Button>
          </div>
          <CustomGrid rows={allReportsByfilter} columns={columns} />
        </>
      )}
      {get && allReportsByfilter.length == 0 && (
        <Typography
          sx={{
            color: "red",
          }}
        >
          No report found !!
        </Typography>
      )}
    </>
  )
}

export default FilterTable
