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
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"

import { styled } from "@mui/system"
import { useRouter } from "next/navigation"
import Link from "next/link"

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import Pagination from "../components/Pagination/Pagination"
import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const FORMERS_HEADERS = [
  "S.No",
  "Name",
  "Status",
  "Designation",
  "E-mail",
  "Bank A/C",
  "Active",
  "Action",
]

const FORMER_MODES = { add: "add_former", update: "update_former" }

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 5px",
  // wordBreak: "break-all",
}))

const OptionsWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px",
  marginBottom: "10px",
}))

let tempCounter = 1

const Formers = () => {
  const [formersList, setFormersList] = useState([])
  const [filterInputs, setFilterInputs] = useState({
    name: "",
    isActive: "",
    status: "",
  })
  const [pageNo, setPageNo] = useState(1)

  const router = useRouter()
  const authCtx: any = useAuth()

  const handleFetchFormers = async () => {
    const config = {
      url: `/api/former/getAll?limit=10&page=${pageNo}&name=${filterInputs.name}&isActive=${filterInputs.isActive}&status=${filterInputs.status}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)
      setFormersList(res.data)
      // if (String(res.status).charAt(0) === "2") {
      // }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleFetchFormers()
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
      isActive: "",
      status: "",
    })

    tempCounter += 1
  }

  return (
    <PageContainer title="Former Employees" description="List of all the bills">
      <DashboardNew title="Hon'ble Ex-Chairman & Ex-Members" titleVariant="h5">
        <>
          <OptionsWrapper>
            <Button
              sx={{ marginTop: "-23px", fontSize: "12px" }}
              variant="contained"
              size="small"
              onClick={() =>
                router.push(`/Formers/ManageFormer?mode=${FORMER_MODES.add}`)
              }
            >
              Add New
            </Button>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography>Search By:</Typography>
              <TextField
                name="name"
                size="small"
                placeholder="Name"
                value={filterInputs.name}
                onChange={handleFilterInputs}
                sx={{ width: "125px", "::placeholder": { fontSize: "5px" } }}
              />
              <FormControl>
                <InputLabel
                  size="small"
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  name="isActive"
                  size="small"
                  value={filterInputs.isActive}
                  label="Status"
                  onChange={handleFilterInputs}
                  sx={{ width: "125px" }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">In-active</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel
                  size="small"
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  Present Status
                </InputLabel>
                <Select
                  name="status"
                  size="small"
                  placeholder="asdv"
                  label="Present Status"
                  value={filterInputs.status}
                  onChange={handleFilterInputs}
                  sx={{ width: "125px" }}
                >
                  <MenuItem disabled>
                    <em>Present Status</em>
                  </MenuItem>
                  <MenuItem value="ex">Ex</MenuItem>
                  <MenuItem value="present">Present</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="small"
                sx={{ background: "#9C27B0 " }}
                onClick={() => {
                  setPageNo(1)
                  handleFetchFormers()
                }}
              >
                Search
              </Button>
              <Button
                variant="contained"
                sx={{ background: "#9C27B0 " }}
                size="small"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            </Box>
          </OptionsWrapper>
          <Box>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#4C7AFF" }}>
                  {FORMERS_HEADERS.map((header, i) => (
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
                {formersList.map((former: any, i: any) => {
                  const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff"

                  const itemNumber = (pageNo - 1) * 10 + (i + 1)

                  return (
                    <TableRow key={former._id} sx={{ background: rowColor }}>
                      <TabelCellStyled>{`${itemNumber}.`}</TabelCellStyled>
                      <TabelCellStyled>{former.name}</TabelCellStyled>
                      <TabelCellStyled>{former.status}</TabelCellStyled>
                      <TabelCellStyled>{former.designation}</TabelCellStyled>
                      <TabelCellStyled>{former.email}</TabelCellStyled>
                      <TabelCellStyled>
                        {former.bankAccountNumber}
                      </TabelCellStyled>
                      <TabelCellStyled
                        sx={{
                          color: former.isActive === "Active" ? "green" : "red",
                        }}
                      >
                        {former.isActive}
                      </TabelCellStyled>
                      <TabelCellStyled>
                        <Link
                          href={`/Formers/ManageFormer?former_id=${former._id}&mode=${FORMER_MODES.update}`}
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
            url={`/api/former/getAll?name=${filterInputs.name}&isActive=${filterInputs.isActive}&status=${filterInputs.status}`}
            data={formersList}
            setPageNo={setPageNo}
          />
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default Formers
