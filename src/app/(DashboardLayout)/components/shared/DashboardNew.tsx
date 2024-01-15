import React ,{useContext}from "react"
import { Card, CardContent, Typography, Stack, Box } from "@mui/material"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { CosmeticContext, useCosmetic } from "@/context/CosmeticContext/UseCosmetic.Provider"
import { CircularProgress } from "@mui/material"
// import { styled } from '@mui/system';
type Props = {
  title?: string
  titleVariant?: string | any
  subtitle?: string
  action?: JSX.Element | any
  footer?: JSX.Element
  cardheading?: string | JSX.Element
  headtitle?: string | JSX.Element
  headsubtitle?: string | JSX.Element
  children?: JSX.Element
  middlecontent?: string | JSX.Element
}

const DashboardNew = ({
  title,
  titleVariant,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}: Props) => {
  const goBack = () => {
    window.history.back()
  }

  let stitle = title?.slice(1)

 
  const cosmeticContext = useContext(CosmeticContext);
  const { modalLoading, setModalLoading } = cosmeticContext;


  return (
    
    <Card sx={{ padding: 0 }} elevation={9} variant={undefined}>
     
      {cardheading ? (
        <>
        <CardContent>
          
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
        </>
      ) : (
        <>
     
        <CardContent sx={{ p: "10px" }}>
          {title ? (
            <Stack
              direction="row"
              justifyContent="space-between"
              // alignItems={"center"}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:"space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                {stitle === "Dashboard" ? null : (
                  <Box
                    sx={{
                      width: "80px",
                      height: "35px",
                      borderRadius: "5px",
                      border: " 1px solid #fafafce8",
                      backgroundColor: "#5d87ff",
                      display: "flex",
                      justifyContent: "center",

                      alignItems: "center",
                      mr: 2,
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={goBack}
                  >
                    <ArrowBackIosIcon
                      sx={{
                        color: "white",
                        mr: -2,
                        height: "15px",
                      }}
                    />
                    <ArrowBackIosIcon
                      sx={{
                        color: "white",
                        mr: -1,
                        height: "15px",
                      }}
                    />
                    Back
                  </Box>
                )}

                <Box>
                  {" "}
                  {title ? (
                    <Typography variant={titleVariant ? titleVariant : "h5"} >
                      {title}
                    </Typography>
                  ) : (
                    ""
                  )}
                  {subtitle ? (
                    <Typography variant="subtitle2" color="textSecondary">
                      {subtitle}
                    </Typography>
                  ) : (
                    ""
                  )}
                 
                </Box>
                
              </Box>
              <Box>
                  <Typography sx={{
                    fontSize:"20px",
                    color:"#5d87ff",
                  }}>
             { modalLoading? <> Loading..... <CircularProgress  size={30}/></>:null}
                  </Typography></Box>
                
              {action}
              
            </Stack>
          ) : null}
 <Box
 sx={{
  position: 'relative',
  filter: modalLoading?'blur(5px)':'blur(0px)', 
 }}
 >
  <>{children}</>
          
          </Box>
        </CardContent>
        </>
      )}

      {middlecontent}
      {footer}
    </Card>
   
 
  )
}

export default DashboardNew
