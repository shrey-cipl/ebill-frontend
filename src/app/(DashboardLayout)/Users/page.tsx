"use client"
import { useEffect, useState } from "react"

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

const USERS_HEADERS = ["S.No", "Role", "User Name", "E-mail", "Phone", "Action"]

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 5px",
  // wordBreak: "break-all",
}))

let tempCounter = 0

const Users = () => {
  const [usersList, setUsersList] = useState([])

  const authCtx: any = useAuth()

  const handleFetchUsers = async () => {
    const config = {
      url: `/api/user/getAll`,
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
        // User Name and Role Name both had 'name' as object key
        item.roleName = item.role[0]?.name
      }

      setUsersList(res.data)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    handleFetchUsers()
  }, [authCtx?.user?.token])

  const columns: GridColDef[] = [
    {
      field: "ranodm_1", // confirm this
      headerName: "S.No",
      valueGetter: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "roleName", headerName: "Role" },
    { field: "name", headerName: "User Name" },
    { field: "email", headerName: "E-mail" },
    { field: "phone", headerName: "Phone" },
    {
      field: "random_2",
      headerName: "Channel Log",
      renderCell: (params) => {
        return (
          <Link
            href={`/Users/ManageUser?user_id=${params.row._id}&mode=update`}
            // size="small"
            style={{ color: "#4C7AFF", textDecoration: "none" }}
          >
            Update
          </Link>
        )
      },
    },
  ]

  return (
    <PageContainer title="All Users" description="List of all the Users">
      <DashboardNew title="All Users" titleVariant="h5">
        <>
          <DataGrid
            rows={usersList}
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
              if (params.field === "currentStatus") {
                return params.row.currentStatus === "Open"
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

export default Users
