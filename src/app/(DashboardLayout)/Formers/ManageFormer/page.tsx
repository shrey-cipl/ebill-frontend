"use client"

import { useEffect, useState } from "react"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { styled } from "@mui/system"

import PageContainer from "../../components/container/PageContainer"
import DashboardNew from "../../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"

const FORMER_FIELDS = [
  {
    id: "name",
    fieldName: "Name",
    type: "text",
  },
  {
    id: "status",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Present", "Ex"],
  },
  {
    id: "designation",
    fieldName: "Designation",
    type: "select",
    selectOptions: ["Chairman", "Member"],
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
  },
  {
    id: "password",
    fieldName: "Password",
    type: "password",
  },
  {
    id: "isActive",
    fieldName: "Active",
    type: "select",
    selectOptions: ["Active", "Inactive"],
  },
  {
    id: "bankAccountNumber",
    fieldName: "Bank A/C",
    type: "text",
  },
  {
    id: "ifscCode",
    fieldName: "IFSC Code",
    type: "text",
  },
  {
    id: "bankName",
    fieldName: "Bank Name",
    type: "text",
  },
  {
    id: "branchName",
    fieldName: "Branch Name",
    type: "text",
  },
]

const FORMER_MODES = { add: "add_former", update: "update_former" }

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
for (let arrEl of FORMER_FIELDS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""
}

// const tempCOntainer

const getFormerData = async (id: any, token: any) => {
  const config = {
    url: `/api/former/get/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }

  try {
    const res = await axiosApi(config.url, config.method, config.headers)

    return res.data
    // if (String(res.status).charAt(0) === "2") {
    // }
  } catch (err) {
    console.log(err)
  }
}

// Stores a cached data for Former fields
// to reset to initial field state IF IN UPDATE MODE
let cachedFormerFields: any

const ManageFormer = () => {
  const [formerFields, setFormerFields] = useState(initialFieldState)

  const router = useRouter()
  const searchParams = useSearchParams()

  const paramFormerId = searchParams.get("former_id")
  const paramMode = searchParams.get("mode")

  const authCtx: any = useAuth()

  useEffect(() => {
    if (paramFormerId) {
      getFormerData(paramFormerId, authCtx.user.token).then((formerData) => {
        // console.log(formerData)
        if (formerData) {
          setFormerFields({
            name: formerData.name,
            designation: formerData.designation,
            status: formerData.status,
            isActive: formerData.isActive,
            phone: formerData.phone,
            email: formerData.email,
            bankAccountNumber: formerData.bankDetails.bankAccountNumber,
            bankName: formerData.bankDetails.bankName,
            branchName: formerData.bankDetails.branchName,
            ifscCode: formerData.bankDetails.ifscCode,
            createdAt: formerData.createdAt,
            updatedAt: formerData.updatedAt,
            lastUpdatedBy: formerData.lastUpdatedBy,
          })

          cachedFormerFields = {
            name: formerData.name,
            designation: formerData.designation,
            status: formerData.status,
            isActive: formerData.isActive,
            phone: formerData.phone,
            email: formerData.email,
            bankAccountNumber: formerData.bankDetails.bankAccountNumber,
            bankName: formerData.bankDetails.bankName,
            branchName: formerData.bankDetails.branchName,
            ifscCode: formerData.bankDetails.ifscCode,
            createdAt: formerData.createdAt,
            updatedAt: formerData.updatedAt,
            lastUpdatedBy: formerData.lastUpdatedBy,
          }
        }
      })
    }
  }, [paramFormerId, authCtx.user.token])

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    try {
      let res

      // Creates a copy to mutate
      const formerDataCopy = { ...formerFields }
      // data mutation
      delete formerDataCopy.bankAccountNumber
      delete formerDataCopy.bankName
      delete formerDataCopy.branchName
      delete formerDataCopy.ifscCode

      const bankDetails = {
        bankAccountNumber: formerFields.bankAccountNumber,
        bankName: formerFields.bankName,
        branchName: formerFields.branchName,
        ifscCode: formerFields.ifscCode,
      }

      if (paramMode === FORMER_MODES.add) {
        const config = {
          url: `/api/former/create`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${authCtx.user.token}`,
          },
          data: {
            ...formerDataCopy,
            bankDetails: bankDetails,
            isActive: "Active",
            // Extract form context later
            // lastForwardedBy: "Asst. Section Officer Admin I",
          },
        }

        res = await axiosApi(
          config.url,
          config.method,
          config.headers,
          config.data
        )
      } else if (paramMode === FORMER_MODES.update) {
        const config = {
          url: `/api/former/update`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${authCtx.user.token}`,
          },
          data: {
            ...formerDataCopy,
            bankDetails: bankDetails,
            former_id: paramFormerId,
          },
        }

        res = await axiosApi(
          config.url,
          config.method,
          config.headers,
          config.data
        )
      }

      if (res) {
        alert("Data Added!")
        router.push("/Formers")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleFetchBankDetails = async () => {
    try {
      const res = await axios.get(
        `https://ifsc.razorpay.com/${formerFields.ifscCode}`
      )

      setFormerFields((prevState: any) => ({
        ...prevState,
        bankName: res.data.BANK,
        branchName: res.data.BRANCH,
      }))
    } catch (err) {
      console.log(err)
    }
  }

  const handleFieldChange = (e: any) => {
    setFormerFields((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleReset = () => {
    if (paramMode === FORMER_MODES.add) {
      setFormerFields(initialFieldState)
    } else if (paramMode === FORMER_MODES.update) {
      setFormerFields(cachedFormerFields)
    }
  }

  const pageTitle =
    paramMode === FORMER_MODES.add ? "Add Former" : `Edit Former`

  return (
    <PageContainer title={pageTitle} description="Manage Former data here">
      <DashboardNew title={pageTitle} titleVariant="h5">
        <>
          <Typography mt={1}>
            {paramMode === FORMER_MODES.update && (
              <>
                <b>{formerFields.name}</b>, last Edited on{" "}
                <b>
                  {new Date(formerFields.updatedAt).toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                  })}
                </b>{" "}
                by <b>{formerFields.lastUpdatedBy}</b>
              </>
            )}
          </Typography>
          <Box mt={2}>
            <form
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
              onSubmit={handleFormSubmit}
            >
              {FORMER_FIELDS.map((former, i) =>
                // Disables 'Active' field in 'add' mode
                paramMode === FORMER_MODES.add &&
                former.id === "isActive" ? null : paramMode ===
                    FORMER_MODES.update && former.id === "password" ? null : (
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
                      {former.fieldName}
                    </Typography>
                    {former.type === "select" ? (
                      <Select
                        name={former.id}
                        size="small"
                        value={formerFields[former.id]}
                        onChange={handleFieldChange}
                        sx={{ width: "100%" }}
                      >
                        {former.selectOptions?.map((option, i) => (
                          <MenuItem key={i} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : former.id === "ifscCode" ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <TextField
                          name={former.id}
                          size="small"
                          type={former.type}
                          value={formerFields[former.id]}
                          onChange={handleFieldChange}
                          sx={{ width: "100%" }}
                        />
                        <Button
                          type="button"
                          variant="contained"
                          size="small"
                          sx={{ background: "#9C27B0" }}
                          onClick={handleFetchBankDetails}
                        >
                          fetch
                        </Button>
                      </div>
                    ) : (
                      <TextField
                        name={former.id}
                        size="small"
                        type={former.type}
                        value={formerFields[former.id]}
                        onChange={handleFieldChange}
                        sx={{ width: "100%" }}
                        disabled={
                          former.id === "bankName" || former.id === "branchName"
                            ? true
                            : false
                        }
                      />
                    )}
                  </FormControl>
                )
              )}
              <ButtonWrapper sx={{ gridColumn: "1/-1" }}>
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={handleFormSubmit}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={() => handleReset()}
                >
                  Cancel
                </Button>
              </ButtonWrapper>
            </form>
          </Box>
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default ManageFormer
