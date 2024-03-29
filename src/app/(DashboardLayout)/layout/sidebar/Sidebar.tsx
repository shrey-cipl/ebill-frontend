import { useMediaQuery, Box, Drawer, Typography } from "@mui/material"
import Logo from "../shared/logo/Logo"
import SidebarItems from "./SidebarItems"
import { Upgrade } from "./Updrade"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
interface ItemType {
  isMobileSidebarOpen: boolean
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void
  isSidebarOpen: boolean
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"))

  const sidebarWidth = "270px"
  const auth: any = useAuth()
  console.log(auth, "auth")
  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          // border: "1px solid black",
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}

        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              // width: sidebarWidth,
              boxSizing: "border-box",
              pt: 3,
              overflow: "hidden",
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                width: "0.5em",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
              },
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box px={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src="Gov_Logo_912e861f02.png"
                  alt=""
                  style={{
                    width: "23%",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: "900",
                  fontSize: "15px",
                  mt: 2,
                }}
              >
                Union Public Service Commission
              </Typography>

              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "400",
                  textAlign: "center",
                  m: 2,
                  // width: "200px",
                  // border: "1px solid black",
                }}
              >
                {auth?.user?.data?.role?.name}
              </Typography>
            </Box>
            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Box>
          </Box>
        </Drawer>
      </Box>
    )
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,

          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      {/* <SidebarItems /> */}
    </Drawer>
  )
}

export default Sidebar
