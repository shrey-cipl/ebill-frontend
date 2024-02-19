import { useEffect, useState } from "react"

import PostAddIcon from "@mui/icons-material/PostAdd"
import { Box, Grid } from "@mui/material"
import DashboardBox from "./DashboardBox"

import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const DashboardFormer = () => {
  const [dashboardData, setDashboardData] = useState<any>([])
  const authCtx: any = useAuth()

  useEffect(() => {
    const getData = async () => {
      const config = {
        url: `/api/bill/getDashboardData?formerId=${authCtx?.user?.data?._id}`,
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
    <Box>
      <h4
        style={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "10px",
          borderRadius: "5px",
          display: "inline-block",
          color: "white",
          backgroundColor: "#5D87FF",
        }}
      >
        All Bills
      </h4>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <DashboardBox
          filecount={dashboardData.totalBills}
          filetype="Total Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.totalLinkedWithClaim}
          filetype="Total Linked with Claim"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.totalUnlinkedWithClaim}
          filetype="Total Unlinked with Claim"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
      </Box>
      <h4
        style={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "10px",
          borderRadius: "5px",
          display: "inline-block",
          color: "white",
          backgroundColor: "#5D87FF",
        }}
      >
        Domestic Bills
      </h4>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <DashboardBox
          filecount={dashboardData.domesticBills}
          filetype="Domestic Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.linkedDomesticBills}
          filetype="Linked Domestic Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.unlinkedDomesticBills}
          filetype="Unlinked Domestic Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
      </Box>
      <h4
        style={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "10px",
          borderRadius: "5px",
          display: "inline-block",
          color: "white",
          backgroundColor: "#5D87FF",
        }}
      >
        Medical Bills
      </h4>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <DashboardBox
          filecount={dashboardData.medicalBills}
          filetype="Medical Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />

        <DashboardBox
          filecount={dashboardData.linkedMedicalBills}
          filetype="Linked Medical Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.unlinkedMedicalBills}
          filetype="Unlinked Medical Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
      </Box>
      <h4
        style={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "10px",
          borderRadius: "5px",
          display: "inline-block",
          color: "white",
          backgroundColor: "#5D87FF",
        }}
      >
        Mobile Bills
      </h4>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <DashboardBox
          filecount={dashboardData.mobileBills}
          filetype="Mobile Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.linkedMobileBills}
          filetype="Linked Mobile Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.unlinkedMobileBills}
          filetype="Unlinked Mobile Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
      </Box>
      <h4
        style={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "10px",
          borderRadius: "5px",
          display: "inline-block",
          color: "white",
          backgroundColor: "#5D87FF",
        }}
      >
        Services Bills
      </h4>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <DashboardBox
          filecount={dashboardData.servicesBills}
          filetype="Service Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.linkedServicesBills}
          filetype="Linked Services Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
        <DashboardBox
          filecount={dashboardData.unlinkedServicesBills}
          filetype="Unlinked Services Bills"
          iconcolor="#5D87FF"
          backgroundcolor="#fff"
          Icon={PostAddIcon}
        />
      </Box>
    </Box>
  )
}

export default DashboardFormer
