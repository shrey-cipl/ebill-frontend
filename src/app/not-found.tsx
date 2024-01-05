// 404.js

import React from "react"
import { Container, Typography, Button } from "@mui/material"
import { useRouter } from "next/navigation"

const NotFoundPage = () => {
  const router = useRouter()

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Adjust as needed
      }}
    >
      <img src="download.png" alt="" width={300} />
      <Typography
        variant="h1"
        gutterBottom
        sx={{
          color: "#df4516",
        }}
      >
        Under Construction
      </Typography>
      <Typography variant="body1" paragraph>
        The page is under construction. Kindly come back later.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: "#df4516",
        }}
        onClick={() => router.push("/")}
      >
        Return to Home
      </Button>
      {/* You can add additional information or links as needed */}
    </Container>
  )
}

export default NotFoundPage
