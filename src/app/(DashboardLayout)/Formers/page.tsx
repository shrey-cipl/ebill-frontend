"use client"

import { useEffect, useState } from "react"

import Button from "@mui/material/Button"

import { useRouter } from "next/navigation"
import Link from "next/link"
import dayjs from "dayjs"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

import { enqueueSnackbar } from "notistack"

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid"
import CustomGrid from "../components/CustomGrid"

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

      if (res && res.data) {
        for (let item of res.data) {
          item.id = item._id
          item.bankAccountNumber = item.bankDetails.bankAccountNumber
        }
        setFormersList(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleFetchFormers()
  }, [authCtx.user.token])

  const columns: GridColDef[] = [
    {
      field: "s.no", // confirm this
      headerName: "S.No",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "name", headerName: "Name" },
    { field: "status", headerName: "Status" },
    { field: "designation", headerName: "Designation" },
    { field: "email", headerName: "E-mail" },
    {
      field: "bankAccountNumber",
      headerName: "Bank A/C",
    },
    {
      field: "createdAt",
      headerName: "Created At",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A")
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated On",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A")
      },
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
          <CustomGrid
            rows={formersList}
            columns={columns}
            sx={{
              ".text-green": {
                color: "green",
              },
              ".text-red": {
                color: "red",
              },
            }}
            getCellClassName={(params: any) => {
              if (params.field === "isActive") {
                return params.row.isActive === "Active"
                  ? "text-green"
                  : "text-red"
              }

              return ""
            }}
          />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Formers
