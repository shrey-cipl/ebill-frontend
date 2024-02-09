import { DataGrid, GridToolbar } from "@mui/x-data-grid"

const CustomGrid = ({ rows, columns, sx, getCellClassName }: any) => {
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].field === "s.no") {
      columns[i] = { ...columns[i], width: 50 }
    } else {
      columns[i] = { ...columns[i], flex: 1 }
    }
  }

  //   if (!sx) {
  //     sx = {}
  //   }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      density="compact"
      // getRowHeight={() => "auto"}
      sx={{
        ...sx,
        ".bg-light": {
          bgcolor: "#eee",
          // "&:hover": {
          //   bgcolor: "darkgrey",
          // },
        },
        ".bg-dark": {
          bgcolor: "#fff",
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
      getCellClassName={getCellClassName}
      slots={{ toolbar: GridToolbar }}
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      pageSizeOptions={[25, 50, 100]}
    />
  )
}

export default CustomGrid
