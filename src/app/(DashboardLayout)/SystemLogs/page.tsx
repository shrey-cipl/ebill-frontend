"use client"
import { useEffect, useState } from "react"

import { GridColDef } from "@mui/x-data-grid"
import dayjs from "dayjs"
import Button from "@mui/material/Button"

import axiosApi from "@/Util/axiosApi"
import CustomGrid from "../components/CustomGrid"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import { exportDataToExcel, exportDataToPDF } from "@/Util/commonFunctions"

const dataToExport = (data: any, visibleColumns: any) => {
  return data.map((item: any) => {
    let obj: any

    // Checks column's visibility state before printing
    if (visibleColumns.ip) obj = { ...obj, "I.P.": item.ip }
    if (visibleColumns.method) obj = { ...obj, Method: item.method }
    if (visibleColumns.path) obj = { ...obj, Path: item.path }
    if (visibleColumns.date)
      obj = { ...obj, Date: dayjs(item.timestamp).format("DD-MM-YYYY") }
    if (visibleColumns.time)
      obj = { ...obj, Time: dayjs(item.timestamp).format("h:mm a") }
    if (visibleColumns.email) obj = { ...obj, Email: item.email }
    if (visibleColumns.status) obj = { ...obj, "Login Status": item.status }

    return obj
  })
}

const SystemLogs = () => {
  const [allLogs, setAllLogs] = useState([])
  const [filterBy, setFilterBy] = useState("user")

  // Default state MUST match data grid's column's 'field' property
  const [columnVisibilityState, setColumnVisibilityState] = useState({
    ip: true,
    method: true,
    path: true,
    date: true,
    time: true,
    email: true,
    status: true,
  })

  useEffect(() => {
    const getData = async () => {
      const config = {
        url: `/api/logs/readLogFile`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //   authorization: `Bearer ${authCtx?.user?.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)
        if (res) {
          // for (let item of res) {
          //    item.id = item._id
          //  }
          for (let i = 0; i < res.length; i++) {
            res[i].id = i + 1

            if (res[i].path.includes("/login")) {
              res[i].email = res[i]?.user?.loginDetails?.email
              res[i].status = res[i]?.user?.success
            } else {
              res[i].email = res[i]?.user?.email
              res[i].status = "null"
            }
          }

          setAllLogs(res)
        }
      } catch (err) {
        console.log(err)
      }
    }

    getData()
  }, [])

  const columns: GridColDef[] = [
    {
      field: "s.no", // confirm this
      headerName: "S.No",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "ip", headerName: "I.P." },
    { field: "method", headerName: "Method" },
    {
      field: "path",
      headerName: "Path",
      valueFormatter: (params) => {
        const arrSplit = params.value.split("/")
        return arrSplit[arrSplit.length - 1]
      },
    },
    {
      field: "date",
      headerName: "Date",
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY")
      },
    },
    {
      field: "time",
      headerName: "Time",
      valueFormatter: (params) => {
        return dayjs(params.value).format("h:mm a")
      },
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "status",
      headerName: "Login Status",
    },
  ]

  const filterButtons = ["user", "former", "claim", "bill"]

  const filteredList = allLogs.filter((log: any) =>
    log.path.includes(`/${filterBy}/`)
  )

  return (
    <PageContainer title="System Logs" description="View all system logs">
      <DashboardNew title="System Logs" titleVariant="h5">
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <p style={{ marginBottom: "10px", fontWeight: 500 }}>Filter By:</p>
            <div style={{ display: "flex", gap: "5px" }}>
              {filterButtons.map((buttonText, i) => (
                <Button
                  sx={{ background: "#9C27B0" }}
                  variant="contained"
                  size="small"
                  key={i}
                  onClick={() => setFilterBy(buttonText)}
                >
                  {buttonText}
                </Button>
              ))}
            </div>
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}
          >
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              disabled={filteredList.length === 0}
              onClick={() =>
                exportDataToPDF(
                  dataToExport(filteredList, columnVisibilityState),
                  "System Logs"
                )
              }
            >
              PDF
            </Button>
            <Button
              sx={{ background: "#9C27B0" }}
              variant="contained"
              size="small"
              disabled={filteredList.length === 0}
              onClick={() =>
                exportDataToExcel(
                  dataToExport(filteredList, columnVisibilityState),
                  "System Logs"
                )
              }
            >
              Excel
            </Button>
          </div>
          <CustomGrid
            rows={filteredList}
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
              if (params.field === "status") {
                return params.row.status === true ? "text-green" : "text-red"
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

export default SystemLogs
