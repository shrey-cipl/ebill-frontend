"use client"

import dynamic from "next/dynamic"
import PageContainer from "./components/container/PageContainer"
import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff"
import PostAddIcon from "@mui/icons-material/PostAdd"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import { Box, Grid } from "@mui/material"
import DashboardNew from "./components/shared/DashboardNew"
import PendingActionsIcon from "@mui/icons-material/PendingActions"

import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import { redirect } from "next/navigation"

const Dashboard = () => {
  redirect("/Home")

  return
}

export default Dashboard
