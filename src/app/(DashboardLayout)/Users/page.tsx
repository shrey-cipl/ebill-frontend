"use client"
import { useEffect, useState } from "react"

import Link from "next/link"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

import { GridColDef } from "@mui/x-data-grid"
import CustomGrid from "../components/CustomGrid"

const Users = () => {
  const [usersList, setUsersList] = useState([])

  const authCtx: any = useAuth()

  const handleFetchUsers = async () => {
    const config = {
      url: `/api/user/getAll`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      if (res && res.data) {
        for (let item of res.data) {
          item.id = item._id
          // 'User Name' and 'Role Name' both had 'name' as key
          item.roleName = item.role[0]?.name
        }

        setUsersList(res.data)
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    handleFetchUsers()
  }, [authCtx?.user?.token])

  const columns: GridColDef[] = [
    {
      field: "s.no", // confirm this
      headerName: "S.NO",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "roleName", headerName: "ROLE" },
    { field: "name", headerName: "USER NAME" },
    { field: "email", headerName: "EMAIL" },
    { field: "phone", headerName: "PHONE" },
    {
      field: "random_2",
      headerName: "CHANNEL LOG",
      renderCell: (params) => {
        return (
          <Link
            href={`/Users/ManageUser?user_id=${params.row._id}&mode=update`}
            // size="small"
            style={{ color: "#4C7AFF", textDecoration: "none" }}
          >
            Update
          </Link>
        )
      },
    },
  ]

  return (
    <PageContainer title="Users" description="List of all the Users">
      <DashboardNew title="Users" titleVariant="h5">
        <>
          <CustomGrid rows={usersList} columns={columns} />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Users
