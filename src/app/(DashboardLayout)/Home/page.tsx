"use client"

import dynamic from "next/dynamic"
import PageContainer from "../components/container/PageContainer"
import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff"
import PostAddIcon from "@mui/icons-material/PostAdd"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import { Box, Grid } from "@mui/material"
import DashboardNew from "../components/shared/DashboardNew"
import PendingActionsIcon from "@mui/icons-material/PendingActions"

import { useAuth } from "@/context/JWTContext/AuthContext.provider"

import { OverviewTotalProfit } from "../components/OverviewTotalProfit"
import { OverviewSales } from "../components/dashboard/Overview"
import axiosApi from "@/Util/axiosApi"
import { useEffect, useState } from "react"

const urls = [
  `/api/claim/getAll`,
  `/api/claim/getall?pendingBranch=pending`,
  `/api/claim/getall?currentStatus=Closed`,
  `/api/claim/getall?billType=bank`,
]

const DashboardBox = dynamic(
  () => import("../components/dashboard/DashboardBox")
)

const Dashboard = () => {
  const [fileStatus, setFileStatus] = useState<any>([])
  const auth: any = useAuth()

  // useEffect(() => {
  //   getReportsbyfilter()
  //   async function getReportsbyfilter() {
  //     try {
  //       // Define an array of URLs
  //       const urls = [
  //         `/api/claim/getAll`,
  //         `/api/claim/getall?pendingBranch=pending`,
  //         `/api/claim/getall?currentStatus=Closed`,
  //         `/api/claim/getall?billType=bank`,
  //       ]

  //       // Make all requests concurrently
  //       const responses = await Promise.all(
  //         urls.map(async (url) => {
  //           const method = "GET"
  //           const headers = {
  //             "Content-Type": "application/json",
  //             authorization: `Bearer ${auth.user.token}`,
  //           }
  //           try {
  //             const res = await axiosApi(url, method, headers)
  //             // Process the response data
  //             if (res.success !== true || !res) {
  //               console.log("Bad Request")
  //             } else {
  //               console.log("200")
  //               // Do something with the response data if needed
  //             }
  //             return res?.data?.length
  //           } catch (error) {
  //             console.error("Error fetching ", error)
  //             // return 0 // Or handle error in any way you prefer
  //           }
  //         })
  //       )

  //       // Update state after all requests are completed
  //       setFileStatus((prev: any) => [...prev, ...responses])
  //     } catch (error) {
  //       console.error("Error fetching ", error)
  //     }
  //   }
  // }, [auth])
  console.log(fileStatus)
  return (
    <PageContainer
      title="Welcome to Dashboard"
      description="You can navigate the website from here"
    >
      <DashboardNew title=" Dashboard" titleVariant="h5">
        <Grid>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              bgcolor: "background.paper",
              borderRadius: 4,
              marginTop: "20px",
              backgroundColor: "rgb(93, 135, 255)",
              p: 2,
              mx: 2,
            }}
          >
            <DashboardBox
              filecount={15}
              filetype="Total file(s)"
              iconcolor="#fa5c80"
              backgroundcolor="#fff"
              Icon={PostAddIcon}
            />
            <DashboardBox
              filecount={5}
              filetype="Pending file(s)"
              iconcolor="#fe987f"
              backgroundcolor="#fff"
              Icon={PendingActionsIcon}
            />
            <DashboardBox
              filecount={4}
              filetype="Closed file(s)"
              iconcolor="#3cd755"
              backgroundcolor="#fff"
              Icon={SubtitlesOffIcon}
            />
            <DashboardBox
              filecount={1}
              filetype="Fwd.To Bank"
              iconcolor="#bf83ff"
              backgroundcolor="#fff"
              Icon={AccountBalanceIcon}
            />
            <DashboardBox
              filecount={6}
              filetype="Total Bills"
              iconcolor="#bf83ff"
              backgroundcolor="#fff"
              Icon={AccountBalanceIcon}
            />
            <DashboardBox
              filecount={4}
              filetype="Bills not Linked"
              iconcolor="#bf83ff"
              backgroundcolor="#fff"
              Icon={AccountBalanceIcon}
            />
          </Box>
          <Grid
            xs={12}
            lg={8}
            sx={{
              mt: 3,
            }}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: "This year",
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                },
                {
                  name: "Last year",
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                },
              ]}
              sx={{ height: "100%" }}
            />
          </Grid>
        </Grid>
      </DashboardNew>
    </PageContainer>
  )
}

export default Dashboard
