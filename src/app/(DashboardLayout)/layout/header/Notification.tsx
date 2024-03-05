import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { IconBellRinging } from "@tabler/icons-react"
import axiosApi from "@/Util/axiosApi"
import { useRouter } from "next/navigation"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const Notification = () => {
  const authCtx: any = useAuth()

  const router = useRouter()
  const [anchorEl2, setAnchorEl2] = useState(null)
  const [noti, setNoti] = useState([])

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const handleFetchBills = async () => {
    const config = {
      url: `/api/claim/getall?lastForwardedToOfficerOrLinkOfficer=${authCtx?.user?.data?.role?.name}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx?.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      if (res && res.data) {
        setNoti(res.data)
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    handleFetchBills()
  }, [authCtx?.user?.token])
  return (
    <div>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="false"
        onClick={handleClick2}
        sx={{
          mr: 2,
        }}
      >
        <Badge
          invisible={noti.length ? false : true}
          variant="dot"
          color="primary"
        >
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>
      {noti.length ? (
        <Menu
          id="msgs-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          // anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          // transformOrigin={{ horizontal: "right", vertical: "top" }}
          sx={{
            "& .MuiMenu-paper": {
              width: "250px",
            },
          }}
        >
          <Box>
            <Typography variant="h5" mx={2} mb={1}>
              Notification
            </Typography>
            <MenuItem onClick={() => router.push("/Bills")}>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                variant="body1"
              >
                <NotificationsNoneIcon sx={{ color: "blue" }} />
                Number of Pending Claims ({noti.length})
              </Typography>
            </MenuItem>
          </Box>
        </Menu>
      ) : null}
    </div>
  )
}

export default Notification
