"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { styled } from "@mui/system"

import PageContainer from "../../components/container/PageContainer"
import DashboardNew from "../../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"

const USER_FIELDS = [
  {
    id: "role",
    fieldName: "Role",
    type: "text",
  },
  {
    id: "name",
    fieldName: "User Name",
    type: "text",
  },
  {
    id: "email",
    fieldName: "E-Mail",
    type: "text",
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
  },
]

const FormControl = styled("div")(() => ({
  marginTop: "10px",
}))

const ButtonWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: "20px",
}))

const initialFieldState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of USER_FIELDS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""
}

const ManageUser = () => {
  const [userFieldData, setUserFieldData] = useState(initialFieldState)
  const router = useRouter()
  const searchParams = useSearchParams()

  const paramUserId = searchParams.get("user_id")
  // const paramMode = searchParams.get("mode")

  const authCtx: any = useAuth()
  // console.log(authCtx)

  useEffect(() => {
    const getData = async () => {
      const config = {
        url: `/api/user/get/${paramUserId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)
        console.log("new:", res)

        const { name, email, phone, role } = res.data

        setUserFieldData({
          role: role.name,
          name,
          email,
          phone,
        })
      } catch (err) {
        console.log(err)
      }
    }

    getData()
  }, [paramUserId, authCtx.user.token])

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    // Updated data to be sent
    const extractedData = {
      user_id: paramUserId,
      name: userFieldData.name,
      email: userFieldData.email,
      phone: userFieldData.phone,
    }

    const config = {
      url: `/api/user/update`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user.token}`,
      },
      data: extractedData,
    }

    try {
      const res: any = await axiosApi(
        config.url,
        config.method,
        config.headers,
        config.data
      )

      alert("Data Updated")
      router.push("/Users")

      // if (String(res.status).charAt(0) === "2") {
      // }
    } catch (err: any) {
      alert("Could not Update the data")
      // console.log(err.response.data.message)
    }
  }

  // Updates field values
  const handleFieldChange = (e: any) => {
    setUserFieldData((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <PageContainer title="Manage User" description="Manage Users here">
      <DashboardNew title="Manage User" titleVariant="h5">
        <Box>
          <form
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
            onSubmit={handleFormSubmit}
          >
            {USER_FIELDS.map((user, i) => {
              return (
                <FormControl key={i}>
                  <Typography
                    fontWeight={600}
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: "13px",
                      lineHeight: "12px",
                    }}
                    mb={1}
                  >
                    {user.fieldName}
                  </Typography>
                  <TextField
                    name={user.id}
                    type={user.type}
                    sx={{ width: "100%" }}
                    size="small"
                    value={userFieldData[user.id]}
                    onChange={handleFieldChange}
                    disabled={user.id === "role" ? true : false}
                  />
                </FormControl>
              )
            })}
            <ButtonWrapper sx={{ gridColumn: "1/-1" }}>
              <Button type="submit" variant="contained" size="small">
                Submit
              </Button>
              <Button
                type="button"
                variant="contained"
                size="small"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </ButtonWrapper>
          </form>
        </Box>
      </DashboardNew>
    </PageContainer>
  )
}

export default ManageUser
