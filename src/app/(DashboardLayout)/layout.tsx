"use client"
import { styled, Container, Box } from "@mui/material"
import React, { useState, useContext, useEffect } from "react"
import Header from "@/app/(DashboardLayout)/layout/header/Header"
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar"
import { usePathname } from "next/navigation"
import {
  CosmeticContext,
  useCosmetic,
} from "@/context/CosmeticContext/UseCosmetic.Provider"

import { useRouter } from "next/navigation"
const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}))

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}))
interface Props {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const path = usePathname()

  const cosmeticContext = useContext(CosmeticContext)
  const { billType, setBillType, setUserbill, authenticatedRoute } =
    cosmeticContext

  console.log("authenticatedRoute", billType)
  const router = useRouter()
  console.log(path, "iiiiiiiiiiiiiiiiiiiiii")
  authenticatedRoute.map((e: any) => {
    console.log(e?.href === path, "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
  })
  // useEffect(() => {
  //   const jsonString = JSON.stringify(authenticatedRoute)
  //   const isStringPresent = jsonString?.includes(path)

  //   if (!isStringPresent && authenticatedRoute.length != 0) {
  //     router.push("/404")
  //   }
  // }, [authenticatedRoute, path])
  return (
    <>
      {path === "/login" ||
      path === "/Forgot" ||
      path === "/passwordReset" ||
      path === "/resetpassword" ||
      path === "/FormersLogin" ? (
        <>
          <Box sx={{ height: "100%" }}>{children}</Box>
        </>
      ) : (
        <>
          <MainWrapper className="mainwrapper">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              isMobileSidebarOpen={isMobileSidebarOpen}
              onSidebarClose={() => setMobileSidebarOpen(false)}
            />

            <PageWrapper className="page-wrapper">
              <Header
                toggleMobileSidebar={() => setMobileSidebarOpen(true)}
                sx={{ display: "none" }}
              />

              <Container
                sx={{
                  paddingTop: "20px",
                  maxWidth: "1200px",
                }}
              >
                <Box>{children}</Box>
              </Container>
            </PageWrapper>
          </MainWrapper>
        </>
      )}
    </>
  )
}
