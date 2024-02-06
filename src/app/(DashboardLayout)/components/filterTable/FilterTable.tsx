import { Typography } from "@mui/material"
import CustomGrid from "../CustomGrid"
import { GridColDef } from "@mui/x-data-grid"

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
  { field: "totalAdmissibleAmount", headerName: "Admissible Amount" },
  {
    field: "sanctionedAmount",
    headerName: "Sanctioned Amount",
  },
  {
    field: "currentStatus",
    headerName: "Status",
  },
]

const FilterTable = ({ allReportsByfilter, get }: FilterTableProps) => {
  return (
    <>
      {get && allReportsByfilter.length != 0 && (
        <CustomGrid rows={allReportsByfilter} columns={columns} />
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
