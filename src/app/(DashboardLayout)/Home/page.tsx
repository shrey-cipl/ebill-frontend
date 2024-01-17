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

const DashboardBox = dynamic(
  () => import("../components/dashboard/DashboardBox")
)

const Dashboard = () => {
  const useauth = useAuth()
  console.log(useauth)

  return (
    <PageContainer
      title="Welcome to Dashboard"
      description="You can navigate the website from here"
    >
      <DashboardNew title=" Dashboard" titleVariant="h5">
        {/* <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gridTemplateRows: "80px auto",
            gap: "20px",
          }}
        >
          <Grid>
            <OverviewTotalProfit
              sx={{ height: "100%" }}
              value="21"
              text="Total file(s)"
              Icon={PostAddIcon}
            />
          </Grid>
          <Grid>
            <OverviewTotalProfit
              sx={{ height: "100%" }}
              value="19"
              text="Pending file(s)"
            />
          </Grid>
          <Grid>
            <OverviewTotalProfit
              sx={{ height: "100%" }}
              value="45"
              text="Closed file(s)"
            />
          </Grid>
          <Grid>
            <OverviewTotalProfit
              sx={{ height: "100%" }}
              value="10"
              text="Fwd. To bank"
            />
          </Grid>
        </Grid> */}
        <Grid>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              bgcolor: "background.paper",
              borderRadius: 1,
              marginTop: "20px",
            }}
          >
            <DashboardBox
              filecount={21}
              filetype="Total file(s)"
              iconcolor="#fa5c80"
              backgroundcolor="#fff"
              Icon={PostAddIcon}
            />
            <DashboardBox
              filecount={19}
              filetype="Pending file(s)"
              iconcolor="#fe987f"
              backgroundcolor="#fff"
              Icon={PendingActionsIcon}
            />
            <DashboardBox
              filecount={2}
              filetype="Closed file(s)"
              iconcolor="#3cd755"
              backgroundcolor="#fff"
              Icon={SubtitlesOffIcon}
            />
            <DashboardBox
              filecount={0}
              filetype="Fwd.To Bank"
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
