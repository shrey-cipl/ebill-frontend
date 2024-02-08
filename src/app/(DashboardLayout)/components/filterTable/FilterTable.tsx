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
