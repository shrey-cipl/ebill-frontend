import { useEffect, useState } from "react"

import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import PostAddIcon from "@mui/icons-material/PostAdd"
import PendingActionsIcon from "@mui/icons-material/PendingActions"

import { Box, Grid } from "@mui/material"
import DashboardBox from "./DashboardBox"

import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

import { OverviewSales } from "./Overview"

const DashboardAdmin = () => {
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
    <Grid>
      <Box
        //   sx={{
        //     display: "grid",
        //     gridTemplateColumns: "repeat(3, 1fr)",
        //     gap: "20px",
        //     bgcolor: "background.paper",
        //     borderRadius: 4,
        //     marginTop: "20px",
        //     backgroundColor: "rgb(93, 135, 255)",
        //     p: 2,
        //     mx: 2,
        //   }}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <DashboardBox
          filecount={dashboardData.claimCount}
          filetype="Total Claim(s)"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.pendingClaimsCount}
          filetype="Pending Claim(s)"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PendingActionsIcon}
        />
        <DashboardBox
          filecount={dashboardData.closedClaimsCount}
          filetype="Closed Claim(s)"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={SubtitlesOffIcon}
        />
        <DashboardBox
          filecount={dashboardData.forwardToBankCount}
          filetype="Fwd.To Bank"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={AccountBalanceIcon}
        />
        <DashboardBox
          filecount={dashboardData.billCount}
          filetype="Total Bill(s)"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={AccountBalanceIcon}
        />
        <DashboardBox
          filecount={dashboardData.unlinkedBillsCount}
          filetype="Unlinked Bill(s)"
          iconcolor="#5D87FF"
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
  )
}

export default DashboardAdmin
