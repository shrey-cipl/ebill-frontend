"use client"
import { useEffect, useState } from "react"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"

import DashboardAdmin from "../components/dashboard/DashboardAdmin"
import DashboardFormer from "../components/dashboard/DashboardFormer"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const Dashboard = () => {
  const auth: any = useAuth()
  const role: any = auth?.user?.data?.role?.name
  return (
    <PageContainer
      title="Welcome to Dashboard"
      description="You can navigate the website from here"
    >
      <DashboardNew title=" Dashboard" titleVariant="h5">
        {role ? <DashboardAdmin /> : <DashboardFormer />}
      </DashboardNew>
    </PageContainer>
  )
}

export default Dashboard
