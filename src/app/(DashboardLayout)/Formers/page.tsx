"use client"

import { useEffect, useState } from "react"

import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"

import { styled } from "@mui/system"
import { useRouter } from "next/navigation"
import Link from "next/link"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import Pagination from "../components/Pagination/Pagination"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid"

const FORMER_MODES = { add: "add_former", update: "update_former" }

const Formers = () => {
  const [formersList, setFormersList] = useState([])

  const router = useRouter()
  const authCtx: any = useAuth()

  const handleFetchFormers = async () => {
    const config = {
      url: `/api/former/getAll`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      for (let item of res.data) {
        item.id = item._id
        item.bankAccountNumber = item.bankDetails.bankAccountNumber
      }

      setFormersList(res.data)
      // if (String(res.status).charAt(0) === "2") {
      // }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleFetchFormers()
  }, [authCtx.user.token])

  const columns: GridColDef[] = [
    {
      field: "random_1", // confirm this
      headerName: "S.No",
      valueGetter: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "name", headerName: "Name" },
    { field: "status", headerName: "Status" },
    { field: "designation", headerName: "Designation" },
    { field: "email", headerName: "E-mail" },
    {
      field: "bankAccountNumber",
      headerName: "Bank A/C",
    },
    { field: "isActive", headerName: "Active" },
    {
      field: "random_2",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <Link
            href={`/Formers/ManageFormer?former_id=${params.row._id}&mode=${FORMER_MODES.update}`}
            style={{ color: "#4C7AFF", textDecoration: "none" }}
          >
            Update
          </Link>
        )
      },
    },
  ]

  return (
    <PageContainer title="Former Employees" description="List of all the bills">
      <DashboardNew title="Hon'ble Ex-Chairman & Ex-Members" titleVariant="h5">
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                router.push(`/Formers/ManageFormer?mode=${FORMER_MODES.add}`)
              }
            >
              Add New
            </Button>
          </div>
          <DataGrid
            rows={formersList}
            columns={columns}
            density="compact"
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
              if (params.field === "isActive") {
                return params.row.isActive === "Active"
                  ? "text-green"
                  : "text-red"
              }

              return ""
            }}
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            pageSizeOptions={[25, 50, 100]}
          />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Formers
