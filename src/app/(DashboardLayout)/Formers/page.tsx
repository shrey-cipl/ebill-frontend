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

import { GridColDef } from "@mui/x-data-grid"
import CustomGrid from "../components/CustomGrid"
import { exportDataToExcel, exportDataToPDF } from "@/Util/commonFunctions"
import { FORMER_MODES } from "@/config/constants"

const dataToExport = (data: any, visibleColumns: any) => {
  return data.map((item: any) => {
    let obj: any

    // Checks column's visibility state before printing
    if (visibleColumns.name) obj = { ...obj, "User Name": item.name }
    if (visibleColumns.status) obj = { ...obj, Status: item.status }
    if (visibleColumns.designation)
      obj = { ...obj, Designation: item.designation }
    if (visibleColumns.email) obj = { ...obj, Email: item.email }
    if (visibleColumns.phone) obj = { ...obj, Phone: item.phone }
    if (visibleColumns.bankAccountNumber)
      obj = { ...obj, "Bank Acc. No.": item.bankAccountNumber }
    if (visibleColumns.isActive) obj = { ...obj, Active: item.isActive }

    return obj
  })
}

const Formers = () => {
  const [formersList, setFormersList] = useState([])
  // Default state MUST match data grid's column's 'field' property
  const [columnVisibilityState, setColumnVisibilityState] = useState({
    name: true,
    status: true,
    designation: true,
    email: true,
    phone: true,
    bankAccountNumber: true,
    isActive: true,
  })

  const router = useRouter()
  const authCtx: any = useAuth()

  const handleFetchFormers = async () => {
    const config = {
      url: `/api/former/getAll`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user?.token}`,
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
  }, [authCtx.user?.token])

  const columns: GridColDef[] = [
    {
      field: "s.no", // confirm this
      headerName: "S.NO",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "name", headerName: "NAME" },
    { field: "status", headerName: "STATUS" },
    { field: "designation", headerName: "DESIGNATION" },
    { field: "email", headerName: "EMAIL" },
    { field: "phone", headerName: "PHONE" },
    {
      field: "bankAccountNumber",
      headerName: "BANK A/C",
    },
    // {
    //   field: "createdAt",
    //   headerName: "CREATED AT",

    //   valueFormatter: (params) => {
    //     return dayjs(params.value).format("DD-MM-YYYY h:mm A");
    //   },
    // },
    // {
    //   field: "updatedAt",
    //   headerName: "UPDATED ON",

    //   valueFormatter: (params) => {
    //     return dayjs(params.value).format("DD-MM-YYYY h:mm A");
    //   },
    // },
    { field: "isActive", headerName: "ACTIVE" },
    {
      field: "random_2",
      headerName: "ACTION",
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
    <PageContainer
      title="Ex Chairman & Members"
      description="List of all the bills"
    >
      <DashboardNew title="Ex Chairman & Members" titleVariant="h5">
        <>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
          >
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
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                exportDataToPDF(
                  dataToExport(formersList, columnVisibilityState),
                  "Formers List"
                )
              }
            >
              PDF
            </Button>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              onClick={() =>
                exportDataToExcel(
                  dataToExport(formersList, columnVisibilityState),
                  "Formers List"
                )
              }
            >
              Excel
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
            onColumnVisibilityModelChange={(model: any) =>
              setColumnVisibilityState((prevState) => ({
                ...prevState,
                ...model,
              }))
            }
          />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Formers
