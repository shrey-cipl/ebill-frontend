import React from "react"
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Typography,
} from "@mui/material"
import PropTypes from "prop-types"

// components
import Profile from "./Profile"

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }))
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }))

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled
        sx={
          {
            // backgroundColor: "blue",
          }
        }
      >
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
              border: "2px solid black",
            },
          }}
        ></IconButton>

        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          {/* <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography
                sx={{ fontWeight: "900", fontSize: "20px", color: "black" }}
              >
                Bill Monitoring System
              </Typography>
            </Box>
          </Box>
        </IconButton>
        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  )
}

Header.propTypes = {
  sx: PropTypes.object,
}

export default Header
