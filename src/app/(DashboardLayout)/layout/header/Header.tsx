import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import { useAuth } from "../../../../context/JWTContext/AuthContext.provider";
// components
import Profile from "./Profile";
import { IconBellRinging } from "@tabler/icons-react";
import axiosApi from "@/Util/axiosApi";
import { useRouter } from "next/navigation";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const authCtx: any = useAuth();
  const router = useRouter();

  const [anchorEl2, setAnchorEl2] = useState(null);
  const [noti, setNoti] = useState([]);

  const auth: any = useAuth();
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleFetchBills = async () => {
    const config = {
      url: `/api/claim/getall?lastForwardedToOfficerOrLinkOfficer=${authCtx?.user?.data?.role?.name}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx?.user?.token}`,
      },
    };

    try {
      const res = await axiosApi(config.url, config.method, config.headers);

      if (res && res.data) {
        setNoti(res.data);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleFetchBills();
  }, [authCtx?.user?.token]);

  console.log(noti, "Noti");

  const role: any = auth?.user?.data?.role?.name;
  const mail: any = auth?.user?.data?.email;
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

        

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box ml={3}>
            <Typography
              sx={{ fontWeight: "900", fontSize: "20px", color: "black" }}
            >
              {role
                ? "Bill Monitoring System (Admin Portal)"
                : "Bill Monitoring System (Exchairman and members Portal)"}
            </Typography>
          </Box>
        </Box>
        <Box flexGrow={1} />

        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="false"
          onClick={handleClick2}
          sx={{
            position: "relative",
            mr:2
          }}
        >
          <Badge  invisible={noti.length?false:true} variant="dot" color="primary">
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
              position: "absolute",
              left: "73%",
              top: "6%",
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

        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
