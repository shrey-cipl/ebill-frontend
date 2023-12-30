import Link from "next/link";
import { Typography, styled } from "@mui/material";
import Image from "next/image";
import { useAuth } from "@/context/JWTContext/AuthContext.provider";
const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  const auth :any =useAuth();
  return (
    <LinkStyled href="/">
     <img src="Gov_Logo_912e861f02.png" alt="" style={{
                  width: "30%",
                  padding:"10px"
                }} />
                
    </LinkStyled>
  );
};

export default Logo;
