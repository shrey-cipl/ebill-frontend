"use client"
import { useEffect, useState } from "react"

import dynamic from "next/dynamic"
import PageContainer from "../components/container/PageContainer"
import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff"
import PostAddIcon from "@mui/icons-material/PostAdd"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import { Box, Grid } from "@mui/material"
import DashboardNew from "../components/shared/DashboardNew"
import PendingActionsIcon from "@mui/icons-material/PendingActions"

import { useAuth } from "@/context/JWTContext/AuthContext.provider"

import { OverviewSales } from "../components/dashboard/Overview"
import axiosApi from "@/Util/axiosApi"

const DashboardBox = dynamic(
  () => import("../components/dashboard/DashboardBox")
)

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>([])
  const authCtx: any = useAuth()

  useEffect(() => {
    const getData = async () => {
      const config = {
        url: `/api/user/getDashboardData`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx?.user?.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)
        setDashboardData(res.data)
      } catch (err: any) {
        console.log(err.message)
      }
    }

    getData()
  }, [authCtx?.user?.token])

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
              filecount={dashboardData.claimCount}
              filetype="Total Claim(s)"
              iconcolor="#fa5c80"
              backgroundcolor="#fff"
              Icon={PostAddIcon}
            />
            <DashboardBox
              filecount={dashboardData.pendingClaimsCount}
              filetype="Pending Claim(s)"
              iconcolor="#fe987f"
              backgroundcolor="#fff"
              Icon={PendingActionsIcon}
            />
            <DashboardBox
              filecount={dashboardData.closedClaimsCount}
              filetype="Closed Claim(s)"
              iconcolor="#3cd755"
              backgroundcolor="#fff"
              Icon={SubtitlesOffIcon}
            />
            <DashboardBox
              filecount={dashboardData.forwardToBankCount}
              filetype="Fwd.To Bank"
              iconcolor="#bf83ff"
              backgroundcolor="#fff"
              Icon={AccountBalanceIcon}
            />
            <DashboardBox
              filecount={dashboardData.billCount}
              filetype="Total Bill(s)"
              iconcolor="#bf83ff"
              backgroundcolor="#fff"
              Icon={AccountBalanceIcon}
            />
            <DashboardBox
              filecount={dashboardData.unlinkedBillsCount}
              filetype="Unlinked Bill(s)"
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
