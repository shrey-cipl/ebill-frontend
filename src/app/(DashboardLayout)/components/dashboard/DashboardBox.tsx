import React from "react"

import { Box, Typography } from "@mui/material"
// import DashboardNew from "./components/shared/DashboardNew"
import CircularProgress from "@mui/material/CircularProgress"
import { BoxProps } from "@mui/material/Box"

type Props = {
  filecount?: number
  filetype?: string | any
  subtitle?: string
  iconcolor?: string | any
  backgroundcolor?: string | any
  Icon: React.ComponentType
}
function DashboardBox({
  filecount,
  filetype,
  backgroundcolor,
  iconcolor,
  Icon,
}: Props) {
  return (
    <Box
      sx={{
        backgroundColor: backgroundcolor,
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        padding: "20px 10px",
      }}
    >
      <Box
        sx={{
          color: "white",
          backgroundColor: iconcolor,
          display: "inline-flex",
          // alignItems: "center",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <Icon />
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `4px solid ${iconcolor}`,
          paddingBottom: "10px",
          margin: "35px 0 0 0",
        }}
      >
        <p style={{ fontWeight: 500, margin: 0, padding: 0 }}>{filetype}</p>
        <p style={{ fontWeight: 500, fontSize: "30px", margin: 0, padding: 0 }}>
          {filecount}
        </p>
      </div>
    </Box>
  )
}

export default DashboardBox
