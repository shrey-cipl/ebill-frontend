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
import { enqueueSnackbar } from "notistack"
import Tooltip from "@mui/material/Tooltip"

import { validateOnSubmit } from "@/Util/commonFunctions"

import { FIELDS_USERS } from "@/config/formFields"

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
const initialValidationState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of FIELDS_USERS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""

  // Setup collective validation state
  initialValidationState[arrEl.id] = {
    validationType: arrEl.validationType,
    valid: false,
    errMsg: "",
  }
}

// Stores a cached data for User fields
// to reset to initial field state
let cachedUserFields: any

const getUserData = async (id: any, token: any) => {
  const config = {
    url: `/api/user/get/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }

  try {
    const res = await axiosApi(config.url, config.method, config.headers)
    return res
  } catch (err) {
    console.log(err)
  }
}

const ManageUser = () => {
  const [userFieldData, setUserFieldData] = useState(initialFieldState)
  const [validations, setValidations] = useState(initialValidationState)
  const [isFormChanged, setIsFormChanged] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const paramUserId = searchParams.get("user_id")
  // const paramMode = searchParams.get("mode")

  const authCtx: any = useAuth()
  // console.log(authCtx)

  useEffect(() => {
    if (paramUserId) {
      getUserData(paramUserId, authCtx.user?.token).then((userData) => {
        if (userData && userData.data) {
          const { name, email, phone, role } = userData.data

          setUserFieldData({
            role: role.name,
            name,
            email,
            phone,
          })

          cachedUserFields = {
            role: role.name,
            name,
            email,
            phone,
          }
        }
      })
    }
  }, [paramUserId, authCtx.user?.token])

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    const { allValidationsPass, updatedValidationState } = validateOnSubmit(
      userFieldData,
      validations
    )

    setValidations(updatedValidationState)

    if (!allValidationsPass) {
      return
    }

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
        authorization: `Bearer ${authCtx.user?.token}`,
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

      enqueueSnackbar(res.message, {
        preventDuplicate: true,
        variant: "success",
      })
      router.push("/Users")
    } catch (err: any) {
      console.log(err)
    }
  }

  // Updates field values

  const handleFieldChange = (e: any) => {
    setUserFieldData((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
    setIsFormChanged(true)
  }

  const handleReset = () => {
    setUserFieldData(cachedUserFields)
    setIsFormChanged(false)
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
            {FIELDS_USERS.map((user, i) => {
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
                    {user.fieldName}{" "}
                    {user.required && <span style={{ color: "red" }}>*</span>}
                  </Typography>
                  <Tooltip
                    title={
                      user.type === "date" ? "Select a date" : user.placeholder
                    }
                    placement="top-start"
                  >
                    <TextField
                      name={user.id}
                      type={user.type}
                      placeholder={user.placeholder}
                      sx={{ width: "100%" }}
                      size="small"
                      value={userFieldData[user.id]}
                      onChange={handleFieldChange}
                      disabled={user.id === "role" ? true : false}
                      required={user.required}
                    />
                  </Tooltip>

                  {/* Validation Message */}
                  {!validations[user.id].valid &&
                  validations[user.id].errMsg ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: "14px",
                        margin: "0px",
                      }}
                    >
                      {validations[user.id].errMsg}
                    </p>
                  ) : null}
                </FormControl>
              )
            })}
            <ButtonWrapper sx={{ gridColumn: "1/-1" }}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={!isFormChanged}
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="contained"
                size="small"
                disabled={!isFormChanged}
                onClick={() => handleReset()}
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
