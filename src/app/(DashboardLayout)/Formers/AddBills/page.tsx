"use client"
import React, { useEffect, useState } from "react"
import {
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material"
import { BILL_TYPE } from "@/config/constants"
import PageContainer from "../../components/container/PageContainer"
import DashboardNew from "../../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import Tooltip from "@mui/material/Tooltip"

import { FIELDS_FORMERS_ADD_BILL } from "@/config/formFields"
import { validateOnSubmit } from "@/Util/commonFunctions"
import DynamicTable from "../../components/dynamicTable/DynamicTable"

const initialFieldState: any = {}
const initialValidationState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of FIELDS_FORMERS_ADD_BILL) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""

  // Setup collective validation state
  initialValidationState[arrEl.id] = {
    validationType: arrEl.validationType,
    valid: false,
    errMsg: "",
  }
}
interface TableRowData {
  phone: string
  periodFrom: string
  periodTo: string
  claimedAmount: string
  admissibleAmount: string
}

const FormerAddBill = () => {
  const [formerFieldState, setFormerFieldState] = useState(initialFieldState)
  const [validations, setValidations] = useState(initialValidationState)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [former, setFormer] = useState<any>()
  const [tableData, setTableData] = useState<TableRowData[]>([
    {
      phone: "",
      periodFrom: "",
      periodTo: "",
      claimedAmount: "",
      admissibleAmount: "",
    },
  ])
  const authCtx: any = useAuth()
  const router = useRouter()
  console.log(tableData, "tableData")
  useEffect(() => {
      setFormerFieldState({ ...formerFieldState, telephoneNumbers: tableData })
  }, [tableData])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    //   console.log(formerFieldState,validations,"jkdjdsjdjkds");
    //   const keysToRemove = ["former"]
    // const filteredformerFieldState = [...formerFieldState].filter(
    //   (key:any) => !keysToRemove.includes(key)
    // )
    // const filteredvalidations = [validations].filter(
    //   (key:any) => !keysToRemove.includes(key)
    // )

    const { allValidationsPass, updatedValidationState } = validateOnSubmit(
      formerFieldState,
      validations
    )

    // console.log(
    //   allValidationsPass,
    //   updatedValidationState,
    //   "updatedValidationState"
    // )
    setValidations(updatedValidationState)

    if (!allValidationsPass) {
      return
    }
    console.log(formerFieldState, "formerFieldState")

    // console.log(fieldKeysArr, "fieldKeysArr")
    const formDataToSend = new FormData()

    const fieldKeysArr = Object.keys(formerFieldState)

    fieldKeysArr.forEach((key) =>
      { if (key === "telephoneNumbers") {
        formDataToSend.append("telephoneNumbers", JSON.stringify(tableData));
      } else {
        formDataToSend.append(key, formerFieldState[key]);
      }}
    )
    console.log(formDataToSend, "formDataToSend")

    // "telephoneNumbers": [
    //   {
    //       "phone": "8383824575",
    //       "periodFrom": "2023-05-01",
    //       "periodTo": "2023-07-31",
    //       "claimedAmount": 550,
    //       "admissibleAmount": 800
    //   },
    try {
      const config = {
        url: `/api/bill/create`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${authCtx.user?.token}`,
        },
        data: formDataToSend,
      }

      const res: any = await axiosApi(
        config.url,
        config.method,
        config.headers,
        config.data
      )

      if (res) {
        enqueueSnackbar(res.message, {
          preventDuplicate: true,
          variant: "success",
        })
        if (authCtx?.user?.data?.role) {
          router.push("/UserBills")
        } else {
          router.push("/Formers/ViewBill")
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  // useEffect(() => {
  //   console.log(formerFieldState)
  //   const { allValidationsPass, updatedValidationState } = validateOnSubmit(
  //     formerFieldState,
  //     validations
  //   )

  //   setValidations(updatedValidationState)
  // }, [formerFieldState])
  const [type, setType] = useState("")

  console.log(authCtx, "AUTH ")

  const handleFieldChange = (e: any) => {
    const { name, value, type, files } = e.target

    if (name === "billType") {
      setType(value)
    }

    setFormerFieldState((prevState: any) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }))

    if (type === "file") setPreviewUrl(URL.createObjectURL(files[0]))
  }

  function getCurrentDate() {
    const today = new Date()
    let dd: any = today.getDate()
    let mm: any = today.getMonth() + 1 // January is 0!
    const yyyy = today.getFullYear()

    if (dd < 10) {
      dd = "0" + dd
    }

    if (mm < 10) {
      mm = "0" + mm
    }

    return yyyy + "-" + mm + "-" + dd
  }

  const getFormers = async () => {
    const config = {
      url: `/api/former/getAll`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user?.token}`,
      },
    }

    const res: any = await axiosApi(config.url, config.method, config.headers)

    setFormer(res?.data)
  }

  useEffect(() => {
    getFormers()
  }, [authCtx.user?.token])

  return (
    <PageContainer title="Add Bills" description="Manage Former data here">
      <DashboardNew title="Add Bills" titleVariant="h5">
        <>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {FIELDS_FORMERS_ADD_BILL.map((field, i) => {
                return (
                  <FormControl key={i}>
                    {field.fieldName.includes("Select Former") &&
                    !authCtx?.user?.data?.role ? (
                      ""
                    ) : field.id.includes("billFilePath") ? (
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
                        {field.fieldName}
                        {!type.includes("Domestic Help")
                          ? field.required && (
                              <span style={{ color: "red" }}>*</span>
                            )
                          : ""}
                      </Typography>
                    ) : (
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
                        {field.fieldName}
                        {field.required && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </Typography>
                    )}

                    <Tooltip
                      title={
                        field.type === "date"
                          ? "Select a date"
                          : field.placeholder
                      }
                      placement="top-start"
                    >
                      {field.type === "selectFormer" ? (
                        authCtx?.user?.data?.role && (
                          <Select
                            name={field.id}
                            size="small"
                            // value={former.map((el: any) => el._id)}
                            onChange={(e) => handleFieldChange(e)}
                            sx={{ width: "100%" }}
                            required
                            // error={
                            //   !validations[field.id]?.valid &&
                            //   validations[field.id]?.errMsg
                            // }
                          >
                            {former?.map((option: any, i: any) => {
                              return (
                                <MenuItem value={option._id} key={i}>
                                  {option.name}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        )
                      ) : field.type === "select" ? (
                        <Select
                          name={field.id}
                          size="small"
                          value={formerFieldState[field.id]}
                          onChange={(e) => handleFieldChange(e)}
                          sx={{ width: "100%" }}
                          required
                          error={
                            !validations[field.id]?.valid &&
                            validations[field.id]?.errMsg
                          }
                        >
                          {field.selectOptions?.map((option, i) => (
                            <MenuItem value={option} key={i}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : field.type === "file" ? (
                        <TextField
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          size="small"
                          onChange={(e) => handleFieldChange(e)}
                          sx={{ width: "100%" }}
                          required={
                            !type.includes("Domestic Help")
                              ? field.required
                              : false
                          }
                          error={
                            !validations[field.id]?.valid &&
                            validations[field.id]?.errMsg
                          }
                          helperText={
                            !validations[field.id]?.valid &&
                            validations[field.id]?.errMsg &&
                            validations[field.id]?.errMsg
                          }
                        />
                      ) : field.type === "date" ? (
                        <TextField
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          size="small"
                          value={formerFieldState[field.id]}
                          // id="outlined-error"
                          onChange={(e) => handleFieldChange(e)}
                          sx={{ width: "100%" }}
                          required={field.required}
                          InputProps={{
                            inputProps: {
                              max: getCurrentDate(),
                            },
                          }}
                          error={
                            !validations[field.id]?.valid &&
                            validations[field.id]?.errMsg
                          }
                          helperText={
                            !validations[field.id]?.valid &&
                            validations[field.id]?.errMsg &&
                            validations[field.id]?.errMsg
                          }
                        />
                      ) : (
                        <TextField
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          size="small"
                          value={formerFieldState[field.id]}
                          // id="outlined-error"
                          onChange={(e) => handleFieldChange(e)}
                          sx={{ width: "100%" }}
                          required={field.required}
                          error={
                            !validations[field.id]?.valid &&
                            validations[field.id]?.errMsg
                          }
                          helperText={
                            !validations[field.id]?.valid &&
                            validations[field.id]?.errMsg &&
                            validations[field.id]?.errMsg
                          }
                        />
                      )}
                    </Tooltip>

                    {/* Validation Message */}
                  </FormControl>
                )
              })}
            </div>
            <br />
            <br />
            <Box
              sx={{
                width: "100%",
              }}
            >
              {/* for 'Telephone/Mobile' bill type */}
              {formerFieldState.billType === BILL_TYPE[3] ? (
                <DynamicTable
                  tableData={tableData}
                  setTableData={setTableData}
                />
              ) : null}
            </Box>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}
            >
              <Button type="submit" size="small" variant="contained">
                Submit
              </Button>
            </div>{" "}
          </form>

          {previewUrl && (
            <Box
              sx={{
                ml: 6,
              }}
            >
              <h2>Preview:</h2>
              {formerFieldState.billFilePath.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="File Preview"
                  style={{ maxWidth: "100%", maxHeight: "600px" }}
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  width="100%"
                  height="600px"
                />
              )}
            </Box>
          )}
        </>
      </DashboardNew>
    </PageContainer>
  )
}

export default FormerAddBill
