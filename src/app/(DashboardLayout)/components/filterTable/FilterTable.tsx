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
    headerName: "S.NO",
    valueGetter: (params: any) =>
      params.api.getAllRowIds().indexOf(params.id) + 1,
    width: 100,
  },
  { field: "diaryNumber", headerName: "DIARY NO." },
  { field: "name", headerName: "NAME" },
  { field: "billType", headerName: "BILL TYPE" },
  { field: "totalAdmissibleAmount", headerName: "ADMISSIBLE AMOUNT" },
  {
    field: "sanctionedAmount",
    headerName: "SANCTIONED AMOUNT",
  },
  {
    field: "currentStatus",
    headerName: "STATUS",
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
              onClick={() =>
                exportDataToPDF(dataToExport(allReportsByfilter), "report")
              }
            >
              PDF
            </Button>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                exportDataToExcel(dataToExport(allReportsByfilter), "report")
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
