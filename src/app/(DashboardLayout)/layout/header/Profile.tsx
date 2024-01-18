import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { useAuth } from "../../../../context/JWTContext/AuthContext.provider"
import { IconMail, IconUser } from "@tabler/icons-react"

import Marquee from "react-fast-marquee";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null)
  const auth: any = useAuth()
  const router = useRouter()
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const handleLogout = async () => {

    router.push("/login")
    await auth.signOut()
  }

  const data: any = auth?.user?.data?.name
  const role: any = auth?.user?.data?.role?.name
   const mail:any=auth?.user?.data?.email
   const space :any="      "
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>{data}</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText
            sx={{
              width: "200px",
            }}
          >
            <Marquee>
      <p>{role?role:mail}</p>
      <Box sx={{
        width:"40px"
      }}></Box>
         </Marquee>

          </ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  )
}

export default Profile
