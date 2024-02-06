"use client"
import { useEffect, useState } from "react"

import { GridColDef } from "@mui/x-data-grid"
import dayjs from "dayjs"
import Button from "@mui/material/Button"

import axiosApi from "@/Util/axiosApi"
import CustomGrid from "../components/CustomGrid"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"

const SystemLogs = () => {
  const [allLogs, setAllLogs] = useState([])
  const [filterBy, setFilterBy] = useState("user")

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
    { field: "path", headerName: "Path" },
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
              if (params.field === "currentStatus") {
                return params.row.currentStatus === "Open"
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

export default SystemLogs
