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
              backgroundcolor="#ffe2e6"
              Icon={PostAddIcon}
            />
            <DashboardBox
              filecount={19}
              filetype="Pending file(s)"
              iconcolor="#fe987f"
              backgroundcolor="#fff4de"
              Icon={PendingActionsIcon}
            />
            <DashboardBox
              filecount={2}
              filetype="Closed file(s)"
              iconcolor="#3cd755"
              backgroundcolor="#dcfce7"
              Icon={SubtitlesOffIcon}
            />
            <DashboardBox
              filecount={0}
              filetype="Fwd.To Bank"
              iconcolor="#bf83ff"
              backgroundcolor="#f4e8ff"
              Icon={AccountBalanceIcon}
            />
          </Box>
        </Grid>
      </DashboardNew>
    </PageContainer>
  )
}

export default Dashboard
