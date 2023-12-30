"use client"
import { useEffect, useState } from "react"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"

import { styled } from "@mui/system"
import Link from "next/link"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import Pagination from "../components/Pagination/Pagination"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const USERS_HEADERS = ["S.No", "Role", "User Name", "E-mail", "Phone", "Action"]

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 5px",
  // wordBreak: "break-all",
}))

let tempCounter = 0

const Users = () => {
  const [usersList, setUsersList] = useState([])
  const [filterInputs, setFilterInputs] = useState({
    name: "",
    role: "",
  })
  const [pageNo, setPageNo] = useState(1)

  const authCtx: any = useAuth()

  const handleFetchUsers = async () => {
    const config = {
      url: `/api/user/getAll?limit=10&page=${pageNo}&name=${filterInputs.name}&role=${filterInputs.role}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      setUsersList(res.data)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    handleFetchUsers()
  }, [pageNo, tempCounter, authCtx.user.token])

  const handleFilterInputs = (e: any) => {
    setFilterInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleClearFilters = () => {
    setFilterInputs({
      name: "",
      role: "",
    })

    handleFetchUsers()

    tempCounter += 1
  }

  return (
    <PageContainer title="All Users" description="List of all the Users">
      <DashboardNew title="All Users" titleVariant="h5">
        <>
          <Box sx={{ marginTop: "10px" }}>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: "10px",
                // border: "2px solid red",
                // height: "35px",
              }}
            >
              <Typography>Search By:</Typography>
              <TextField
                name="name"
                size="small"
                placeholder="Name"
                value={filterInputs.name}
                onChange={handleFilterInputs}
                sx={{ width: "125px" }}
              />
              <TextField
                name="role"
                size="small"
                placeholder="Role"
                value={filterInputs.role}
                onChange={handleFilterInputs}
                sx={{ width: "125px" }}
              />
              <Button
                variant="contained"
                size="small"
                sx={{ background: "#9C27B0", height: "100%" }}
                onClick={() => {
                  setPageNo(1)
                  handleFetchUsers()
                }}
              >
                Search
              </Button>
              <Button
                variant="contained"
                sx={{ background: "#9C27B0", height: "100%" }}
                size="small"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#4C7AFF" }}>
                  {USERS_HEADERS.map((header, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        color: "white",
                        padding: "5px",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList?.map((user: any, i: any) => {
                  const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff"

                  const itemNumber = (pageNo - 1) * 10 + (i + 1)

                  return (
                    <TableRow key={user._id} sx={{ background: rowColor }}>
                      <TabelCellStyled>{`${itemNumber}.`}</TabelCellStyled>
                      <TabelCellStyled>{user?.role[0]?.name}</TabelCellStyled>
                      <TabelCellStyled>{user.name}</TabelCellStyled>
                      <TabelCellStyled>{user.email}</TabelCellStyled>
                      <TabelCellStyled>{user.phone}</TabelCellStyled>
                      <TabelCellStyled>
                        <Link
                          href={`/Users/ManageUser?user_id=${user._id}&mode=update`}
                          // size="small"
                          style={{ color: "#4C7AFF", textDecoration: "none" }}
                        >
                          Update
                        </Link>
                      </TabelCellStyled>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
          <Pagination
            url={`/api/user/getAll?name=${filterInputs.name}&role=${filterInputs.role}`}
            data={usersList}
            setPageNo={setPageNo}
          />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Users
