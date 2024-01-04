import React from "react"
import { Card, CardContent, Typography, Stack, Box } from "@mui/material"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    window.history.back();
  };
  
  let stitle=title?.slice(1)
  return (
    <Card sx={{ padding: 0 }} elevation={9} variant={undefined}>
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: "10px" }}>
          {title ? (
            <Stack
              direction="row"
              justifyContent="space-between"
            // alignItems={"center"}
            >
              <Box sx={{
                display: "flex",
                justifyContent: 'space-between',
                alignItems: "center",
                mb: 2
              }}>
                
               {stitle==="Dashboard"?null: <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: '50%',
                    border: " 1px solid #fafafce8",
                    backgroundColor: "#c6c6d4de",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2
                  }}

                  onClick={goBack}
                >
                  <ArrowBackIcon sx={{
                    color: "white",
                  }} />

                </Box>}


                <Box> {title ? (
                  <Typography variant={titleVariant ? titleVariant : "h5"}>
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
                  )}</Box>
              </Box>
              {action}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </Card>
  )
}

export default DashboardNew
