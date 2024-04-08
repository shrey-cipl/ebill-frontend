"use client"

import { useContext, useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { enqueueSnackbar } from "notistack"

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { styled } from "@mui/system"
import dayjs from "dayjs"
import Tooltip from "@mui/material/Tooltip"
import InputLabel from "@mui/material/InputLabel"
import PageContainer from "../../components/container/PageContainer"
import DashboardNew from "../../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import DynamicTable from "../../components/dynamicTable/DynamicTable"

import { BILL_MODES, BILL_TYPE } from "@/config/constants"
import { validateOnSubmit } from "@/Util/commonFunctions"

import {
  CosmeticContext,
  useCosmetic,
} from "@/context/CosmeticContext/UseCosmetic.Provider"

import {
  FIELDS_MANAGE_BILL,
  FIELDS_MANAGE_BILL_UPDATE,
} from "@/config/formFields"

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
for (let arrEl of FIELDS_MANAGE_BILL) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""

  // Setup collective validation state
  initialValidationState[arrEl.id] = {
    validationType: arrEl.validationType,
    valid: false,
    errMsg: "",
  }
}
for (let arrEl of FIELDS_MANAGE_BILL_UPDATE) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""

  // Setup collective validation state
  initialValidationState[arrEl.id] = {
    validationType: arrEl.validationType,
    valid: false,
    errMsg: "",
  }
}

console.log(initialValidationState, "initialValidationState")

const initialUpdateModeFields: any = {}
const initialUpdateModeValidationState: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of FIELDS_MANAGE_BILL_UPDATE) {
  if (!initialUpdateModeFields[arrEl.id]) initialUpdateModeFields[arrEl.id] = ""

  // Setup collective validation state
  initialUpdateModeValidationState[arrEl.id] = {
    validationType: arrEl.validationType,
    valid: false,
    errMsg: "",
  }
}
// const updateSelectOptions = (
//   fields: any[],
//   fieldNameToUpdate: any,
//   updatedOptions: any[]
// ) => {
//   return fields.map((field: any) => {
//     if (field.fieldName === fieldNameToUpdate && field.type === "select") {
//       return { ...field, selectOptions: updatedOptions }
//     } else {
//       return field
//     }
//   })
// }

// Example usage
// const mappthin = updateSelectOptions(FIELDS_MANAGE_BILL, "Bill Type", billType)

const getBillData = async (id: any, token: any) => {
  const config = {
    url: `/api/claim/get/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }

  try {
    const res = await axiosApi(config.url, config.method, config.headers)
    return res
  } catch (err: any) {
    console.log(err.message)
  }
}

interface TableRowData {
  phone: string
  periodFrom: string
  periodTo: string
  claimedAmount: string
  admissibleAmount: string
}

// Stores a cached data for UpdateModeFields and TableData field
// to reset to initial field state IF IN UPDATE MODE
let cachedUpdateModeField: any
let cachedTableData: any

// Used to later store selectedBill id
let selectedBillId: any
let selectedFormerId: any
const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

const ManageBill = () => {
  const [dataFields, setDataFields] = useState(initialFieldState)
  const [BillList, setBillList] = useState([])
  const [bool, setBool] = useState(true)
  const [Submitbool, setsubmitbool] = useState(true)
  const [billSequence, setBillSequence] = useState<any>([])
  const [lastForwardedTo, setlastForwardedTo] = useState<any>("")
  const [lastForwardedBy, setlastForwardedBy] = useState<any>("")
  const [lastForwardedToLink, setlastForwardedToLink] = useState<any>("")
  const [tableData, setTableData] = useState<TableRowData[]>([
    {
      phone: "",
      periodFrom: "",
      periodTo: "",
      claimedAmount: "",
      admissibleAmount: "",
    },
  ])

  const [updateModeFields, setUpdateModeFields] = useState(
    initialUpdateModeFields
  )
  const [init_id, setInit_id] = useState<any>("")
  // Validation States
  const [validations, setValidations] = useState(initialValidationState)
  const [validationsUpdateMode, setValidationsUpdateMode] = useState(
    initialValidationState
  )

  const router = useRouter()
  const searchParams = useSearchParams()

  const paramBillId = searchParams.get("bill_id")
  const paramMode = searchParams.get("mode")
  // re-direct from 'UserBills' page
  const paramUserpageId = searchParams.get("id_from_userpage")

  const authCtx: any = useAuth()
  const role: any = authCtx?.user?.data?.role?.name

  // Populates form fields with bill data
  // console.log(
  //   dataFields,
  //   "00000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  // )
  // useEffect(() => {
  //   console.log(lastForwardedTo, "init_idinit_id")

  // }, [lastForwardedTo])

  useEffect(() => {
    if (paramBillId) {
      getBillData(paramBillId, authCtx.user.token).then((billData: any) => {
        console.log("billDATA: ", billData)

        if (billData && billData.data) {
          const {
            diaryNumber,
            claimReceivingDate,
            billType,
            bill,
            former,
            fileNumber,
            claimPeriodFrom,
            claimPeriodTo,
            totalClaimedAmount,
            totalAdmissibleAmount,
            maxAdmissibleAmount,
            currentStatus,
            lastForwardedTo,
            lastForwardedBy,
            currentremark,
            sanctionedAmount,
            PFMS,
            billProcessingStartDate,
            telephoneNumbers,
            billRouting,
          } = billData.data
          console.log(
            telephoneNumbers,
            "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
          )
          let flag = false
          billRouting.sequence.map((it: any, i: any) => {
            if (
              (lastForwardedBy === billRouting.sequence[i].officer ||
                lastForwardedBy === billRouting.sequence[i].linkOfficer) &&
              (lastForwardedTo === billRouting.sequence[i + 1].officer ||
                lastForwardedTo === billRouting.sequence[i + 1].linkOfficer) &&
              (role === billRouting.sequence[i + 1].officer ||
                role === billRouting.sequence[i + 1].linkOfficer)
            ) {
              if (!flag) {
                setBillSequence([
                  billRouting.sequence[i + 2].officer,
                  billRouting.sequence[i + 2].linkOfficer,
                ])
              }
              flag = true
            }
          })
          setlastForwardedTo(lastForwardedTo)
          setlastForwardedBy(lastForwardedBy)

          setDataFields({
            diaryNumber: diaryNumber,
            claimReceivingDate: dayjs(claimReceivingDate).format("YYYY-MM-DD"),
            billType,
            billNumber: bill?.billNumber,
            name: former[0]?.name ? former[0]?.name : former.name,
            email: former[0]?.email ? former[0]?.email : former.email,
            phone: former[0]?.phone ? former[0]?.phone : former.phone,
            fileNumber,
            claimPeriodFrom: dayjs(claimPeriodFrom).format("YYYY-MM-DD"),
            claimPeriodTo: dayjs(claimPeriodTo).format("YYYY-MM-DD"),
            totalClaimedAmount,
            totalAdmissibleAmount,
            maxAdmissibleAmount,
            currentStatus,
            telephoneNumbers,
            currentremark,
            billFilePath: bill.billFilePath,
            lastForwardedTo: "",
          })

          setUpdateModeFields({
            sanctionedAmount,
            PFMS,
            billProcessingStartDate: dayjs(billProcessingStartDate).format(
              "YYYY-MM-DD"
            ),
          })

          cachedUpdateModeField = {
            sanctionedAmount,
            PFMS,
            billProcessingStartDate: dayjs(billProcessingStartDate).format(
              "YYYY-MM-DD"
            ),
          }

          for (let item of telephoneNumbers) {
            item.periodFrom = dayjs(item.periodFrom).format("YYYY-MM-DD")
            item.periodTo = dayjs(item.periodTo).format("YYYY-MM-DD")
          }

          setTableData(telephoneNumbers)
          cachedTableData = telephoneNumbers
        }
      })
    }
  }, [paramBillId, authCtx.user.token])

  console.log(dataFields, "dataFieldsdataFieldsdataFields")
  useEffect(() => {
    getBills()
  }, [paramMode, authCtx.user.token])

  const getBills = async () => {
    const config = {
      url: `/api/bill/getAll`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)
      console.log(res.data, "jkkkkkkkkkkkkkkkkkkj")
      setBillList(res.data)
    } catch (err: any) {
      console.log(err.message)
    }
  }
  // Auto selects bill number and its corresponding data
  // when re-directed from 'UserBills page'

  useEffect(() => {
    console.log(paramUserpageId, "paramuser")
    console.log(paramUserpageId, "f")
    if (paramUserpageId) {
      const selectedBill: any = BillList.find(
        (bill: any) => bill._id === paramUserpageId
      )

      console.log(
        selectedBill,
        "ppppppppppppppppppppppppppppppppppppppppppppppp"
      )

      if (selectedBill) {
        setTableData([...selectedBill.telephoneNumbers])
      }

      if (selectedBill) {
        // used only in add-mode
        selectedBillId = selectedBill._id
        selectedFormerId = selectedBill.former[0]._id

        setDataFields((prevState: any) => ({
          ...prevState,
          billNumber: selectedBill.billNumber,
          name: selectedBill.former[0].name,
          email: selectedBill.former[0].email,
          phone: selectedBill.former[0].phone,
          billType: selectedBill.billType,
          telephoneNumbers: selectedBill.telephoneNumbers,
          totalClaimedAmount: selectedBill.claimedAmount,
          claimPeriodFrom: dayjs(selectedBill.billPeriodFrom).format(
            "YYYY-MM-DD"
          ),
          claimPeriodTo: dayjs(selectedBill.billPeriodTo).format("YYYY-MM-DD"),
          claimReceivingDate: dayjs(selectedBill.createdAt).format(
            "YYYY-MM-DD"
          ),
          // former: empId,
        }))
      }
    }
  }, [paramUserpageId, BillList])

  // Posts form data
  const setLastForwardedToLinkAsync = async (
    lastForwardedToo: any,
    billSequencee: any
  ) => {
    console.log(
      "lastForwardedTo::::",
      lastForwardedToo,
      "billSequence:::::",
      billSequencee
    )
    let newLink
    if (lastForwardedTo === billSequence[0]) {
      newLink = billSequence[1]
    } else {
      newLink = billSequence[0]
    }
    setlastForwardedToLink(newLink)
  }

  const createObj = async (
    fieldsCopy: any,
    selectedBillId: any,
    init_id: any,
    authCtx: any,
    selectedFormerId: any,
    dataFields: any,
    tableData: any,
    lastForwardedToLink: any
  ) => {
    console.log(fieldsCopy, "p][[[[[[[[[[[[[[[[[[[[[")
    if (tableData[0]?.phone !== "") {
      return {
        ...fieldsCopy,
        bill: selectedBillId,
        billRouting: init_id,
        lastForwardedBy: authCtx.user.data.role.name,
        former: selectedFormerId,
        fileNumber: dataFields.fileNumber,
        telephoneNumbers: tableData,
        lastForwardedToLink,
      }
    } else {
      return {
        ...fieldsCopy,
        billRouting: init_id,
        bill: selectedBillId,
        lastForwardedBy: authCtx.user.data.role.name,
        former: selectedFormerId,
        fileNumber: dataFields.fileNumber,
        lastForwardedToLink,
      }
    }
  }
  function replaceNullWithEmpty(obj: any) {
    // Iterate over each field in the object
    for (let key in obj) {
      // Check if the field value is null
      if (obj[key] === null) {
        // Replace null with an empty string
        obj[key] = ""
      }
    }
    return obj
  }

  const handleFormSubmit = async (e: any) => {
    setsubmitbool((prev) => !prev)
    e.preventDefault()
    if (paramMode === BILL_MODES.add) {
      console.log(
        dataFields,
        validations,
        "kkkkkkkkkkkkkkkkkkkkkkpppppppppppppppppppppppppppppppppppppppppk"
      )

      delete dataFields.PFMS
      delete dataFields.billProcessingStartDate
      delete dataFields.sanctionedAmount
      delete validations.PFMS
      delete validations.billProcessingStartDate
      delete validations.sanctionedAmount
      const { allValidationsPass, updatedValidationState } = validateOnSubmit(
        dataFields,
        validations
      )
      console.log(
        allValidationsPass,
        updatedValidationState,
        "kkkkkkkkkkkkkkkkkkkkkkk"
      )

      setValidations(updatedValidationState)

      if (!allValidationsPass) {
        setsubmitbool((prev) => !prev)
        return
      }
    }
    // if (paramMode === BILL_MODES.update) {
    //   const { allValidationsPass, updatedValidationState } = validateOnSubmit(
    //     updateModeFields,
    //     validationsUpdateMode
    //   )
    //   console.log(
    //     allValidationsPass,
    //     updatedValidationState,
    //     "kkkkkkkkkkkkkkkkkkkkkkk"
    //   )
    //   setValidationsUpdateMode(updatedValidationState)

    //   if (!allValidationsPass) {
    //     return
    //   }
    // }
    if (paramMode === BILL_MODES.update) {
      delete dataFields.maxAdmissibleAmount
      // delete dataFields.lastForwardedTo
      let objjj = bool
        ? { ...updateModeFields, ...dataFields }
        : { ...dataFields }

      console.log(
        objjj,
        validationsUpdateMode,
        "objjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
      )

      let result = replaceNullWithEmpty(objjj)

      const { allValidationsPass, updatedValidationState } = validateOnSubmit(
        result,
        validationsUpdateMode
      )
      console.log(
        allValidationsPass,
        updatedValidationState,
        "allValidationsPass, updatedValidationState"
      )
      // setValidationsUpdateMode(updatedValidationState)
      setValidations(updatedValidationState)

      if (!allValidationsPass) {
        setsubmitbool((prev) => !prev)
        return
      }
      console.log(Submitbool, "///////////////////////////////")
    }
    try {
      let res
      if (paramMode === BILL_MODES.add) {
        // creates a copy of the state
        const fieldsCopy: any = { ...dataFields }
        delete fieldsCopy.name
        delete fieldsCopy.email
        delete fieldsCopy.phone
        delete fieldsCopy.billNumber
        // setlastForwardedToLink(billSequence[1])
        let obj = await createObj(
          fieldsCopy,
          selectedBillId,
          init_id,
          authCtx,
          selectedFormerId,
          dataFields,
          tableData,
          lastForwardedToLink
        )
        console.log(obj, "'''''''''''''''''''''''''''''''''''")
        const config = {
          url: `/api/claim/create`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${authCtx.user?.token}`,
          },
          data: {
            ...obj,
          },
        }
        res = await axiosApi(
          config.url,
          config.method,
          config.headers,
          config.data
        )
        console.log(
          obj,
          "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
        )
      } else if (paramMode === BILL_MODES.update) {
        const { currentStatus, lastForwardedTo, currentremark } = dataFields
        let obj =
          tableData[0]?.phone !== ""
            ? {
                claimId: paramBillId,
                currentStatus,
                lastForwardedTo,
                currentremark,
                lastForwardedBy: authCtx.user.data.role.name,
                // Update Fields
                lastForwardedToLink,
                sanctionedAmount: updateModeFields.sanctionedAmount,
                PFMS: updateModeFields.PFMS,
                billProcessingStartDate:
                  updateModeFields.billProcessingStartDate,
                telephoneNumbers: tableData,
              }
            : {
                claimId: paramBillId,
                currentStatus,
                lastForwardedTo,
                currentremark,
                lastForwardedBy: authCtx.user.data.role.name,
                // Update Fields
                lastForwardedToLink,
                sanctionedAmount: updateModeFields.sanctionedAmount,
                PFMS: updateModeFields.PFMS,
                billProcessingStartDate:
                  updateModeFields.billProcessingStartDate,
              }
        const config = {
          url: `/api/claim/approveClaim`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${authCtx.user?.token}`,
          },
          data: {
            ...obj,
          },
        }
        console.log(
          config.data,
          "ddddddddddddddddddddddddddddddddddddddddddddddddddddd"
        )
        res = await axiosApi(
          config.url,
          config.method,
          config.headers,
          config.data
        )
      }
      enqueueSnackbar(res.message, {
        preventDuplicate: true,
        variant: "success",
      })
      router.push("/Bills")
    } catch (err: any) {
      setsubmitbool((prev) => !prev)
      // setsubmitbool(true)
      enqueueSnackbar(err.message, {
        preventDuplicate: true,
        variant: "success",
      })
      console.log("ManageBill Error:", err)
    }
  }

  const handleFieldChange = (e: any) => {
    // 'value' extracted here is unique billNumber
    // (only for Bill Number field)
    const { name, value } = e.target

    if (name == "lastForwardedTo") {
      let newLink
      if (value === billSequence[0]) {
        newLink = billSequence[1]
      } else {
        newLink = billSequence[0]
      }
      setlastForwardedToLink(newLink)
    }

    if (name === "billNumber") {
      // here 'value' contains bill number
      const selectedBill: any = BillList.find(
        (bill: any) => bill.billNumber === value
      )

      // used only in add-mode
      selectedBillId = selectedBill._id
      selectedFormerId = selectedBill.former[0]._id

      setDataFields((prevState: any) => ({
        ...prevState,
        [name]: value,
        name: selectedBill.former[0].name,
        email: selectedBill.former[0].email,
        phone: selectedBill.former[0].phone,
        billFilePath: selectedBill.billFilePath,
        // former: empId,
      }))
      // console.log(selectedBill, "selectedBill")
    } else {
      // For other fields, directly set the value
      setDataFields((prevState: any) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  // Updates 'update' mode fields
  const handleUpdatedModeFields = (e: any) => {
    setUpdateModeFields((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleReset = () => {
    if (paramMode === BILL_MODES.add) {
      setDataFields(initialFieldState)
    } else if (paramMode === BILL_MODES.update) {
      setUpdateModeFields(cachedUpdateModeField)
      setTableData(cachedTableData)
    }
  }

  useEffect(() => {
    if (paramMode === BILL_MODES.add) {
      if (dataFields.billType) {
        setBillSequence([])
        getData(dataFields.billType)
      }
    }
  }, [dataFields.billType])

  const getData = async (selectedBillType: any) => {
    const config = {
      url: `/api/billRouting/getall?billType=${encodeURIComponent(
        selectedBillType
      )}&latest=true`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)
      // console.log(res, "ressssssssssssssssssssssssssssa")
      // console.log(
      //   res.data[0]._id,
      //   "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
      // )

      if (res && res.data) {
        setInit_id(res.data[0]._id)
        const officerValues = res.data[0]?.sequence[1]?.officer || ""
        const linkOfficerValues = res.data[0]?.sequence[1]?.linkOfficer || ""
        console.log(officerValues, linkOfficerValues)
        setBillSequence([officerValues, linkOfficerValues])
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    if (
      (role === "Accounts I" ||
        role === "Accounts II" ||
        role === "Accounts IV") &&
      updateModeFields.PFMS === null
    ) {
      setDataFields({ ...dataFields, ...updateModeFields })
      setBool(true)
    } else if (
      (role != "Accounts I" ||
        role != "Accounts II" ||
        role != "Accounts IV") &&
      updateModeFields.PFMS === null
    ) {
      setBool(false)
    } else if (updateModeFields.PFMS !== null) {
      setDataFields({ ...dataFields, ...updateModeFields })
      setBool((prev: any) => true)
    }
  }, [updateModeFields])

  // console.log(billSequence, "ghghgg")
  return (
    <>
      <PageContainer
        title={paramMode === BILL_MODES.add ? "Add Claims" : "Update Claims"}
        description="Add bills here"
      >
        <DashboardNew
          title={
            paramMode === BILL_MODES.add ? "Add New Claims" : "Update Claims"
          }
          titleVariant="h5"
        >
          <Box mt={2}>
            <form
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {FIELDS_MANAGE_BILL.map((field, i) => {
                // Permanantly disabled fields
                const permanantDisable = ["name", "phone", "email"]
                const disabledPermananty = permanantDisable.includes(field.id)
                  ? true
                  : false

                // disables various fields if re-directed from 'User Bills' page
                const disableFromUserBills = [
                  "billNumber",
                  "billType",
                  "totalClaimedAmount",
                  "claimPeriodFrom",
                  "claimPeriodTo",
                  "claimReceivingDate",
                ]

                const disabledFromUserBills =
                  disableFromUserBills.includes(field.id) && !!paramUserpageId
                    ? true
                    : false

                // Fields to be editable in 'update' mode
                const enabledUpdateFields = [
                  "currentStatus",
                  "lastForwardedTo",
                  "currentremark",
                ]

                const disabledUpdateFields =
                  paramMode === BILL_MODES.update &&
                  !enabledUpdateFields.includes(field.id)
                    ? true
                    : false

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
                      {field.fieldName}{" "}
                      {field.required && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Typography>
                    <Tooltip
                      title={
                        field.type === "date"
                          ? "Select a date"
                          : field.placeholder
                      }
                      placement="top-start"
                    >
                      <>
                        {field.id == "lastForwardedTo" ? (
                          <>
                            <Select
                              name={field.id}
                              size="small"
                              value={billSequence[0]}
                              onChange={(e) => handleFieldChange(e)}
                              sx={{ width: "100%" }}
                              disabled={
                                disabledPermananty ||
                                disabledFromUserBills ||
                                disabledUpdateFields
                              }
                              error={
                                !validations[field.id]?.valid &&
                                validations[field.id]?.errMsg
                              }
                            >
                              {billSequence.map((bill: any, i: any) => (
                                <MenuItem value={bill} key={i}>
                                  {bill}
                                </MenuItem>
                              ))}
                            </Select>
                            <InputLabel
                              sx={{
                                color: "#fba088",
                                fontSize: "13px",
                                ml: 1,
                              }}
                            >
                              {validations[field.id]?.errMsg}
                            </InputLabel>
                          </>
                        ) : field.type === "select" ? (
                          <>
                            <Select
                              name={field.id}
                              size="small"
                              value={dataFields[field.id]}
                              onChange={(e) => handleFieldChange(e)}
                              sx={{ width: "100%" }}
                              disabled={
                                disabledPermananty ||
                                disabledFromUserBills ||
                                disabledUpdateFields
                              }
                              error={
                                !validations[field.id]?.valid &&
                                validations[field.id]?.errMsg
                              }
                            >
                              {field.id === "billNumber"
                                ? BillList.map((bill: any) => (
                                    <MenuItem
                                      value={bill.billNumber}
                                      key={bill._id}
                                    >
                                      {bill.billNumber}
                                    </MenuItem>
                                  ))
                                : field.selectOptions?.map(
                                    (option: any, i: any) => (
                                      <MenuItem value={option} key={i}>
                                        {option}
                                      </MenuItem>
                                    )
                                  )}
                            </Select>
                            <InputLabel
                              sx={{
                                color: "#fba088",
                                fontSize: "13px",
                                ml: 1,
                              }}
                            >
                              {validations[field.id]?.errMsg}
                            </InputLabel>
                          </>
                        ) : (
                          <TextField
                            name={field.id}
                            type={field.type}
                            inputProps={{
                              min: field.type === "number" ? 0 : undefined,
                            }}
                            size="small"
                            placeholder={field?.placeholder}
                            value={dataFields[field.id]}
                            onChange={(e) => handleFieldChange(e)}
                            sx={{ width: "100%" }}
                            disabled={
                              disabledPermananty ||
                              disabledFromUserBills ||
                              disabledUpdateFields
                            }
                            multiline={
                              field.id === "currentremark" ? true : false
                            }
                            rows={4}
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
                      </>
                    </Tooltip>

                    {/* Validation Message */}
                    {/* {!validations[field.id]?.valid &&
                    validations[field.id]?.errMsg ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          margin: "0px",
                        }}
                      >
                        {validations[field.id].errMsg}
                      </p>
                    ) : null} */}
                  </FormControl>
                )
              })}

              {paramMode === BILL_MODES.update &&
                FIELDS_MANAGE_BILL_UPDATE.map((field, i) => (
                  <FormControl key={i}>
                    {bool ? (
                      <>
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
                          {field.fieldName}{" "}
                          {field.required && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </Typography>

                        <TextField
                          name={field.id}
                          type={field.type}
                          value={updateModeFields[field.id]}
                          onChange={handleUpdatedModeFields}
                          sx={{ width: "100%" }}
                          size="small"
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

                        {/* Validation Message */}
                        {/* {!validations[field.id]?.valid &&
                        validations[field.id]?.errMsg ? (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              margin: "0px",
                            }}
                          >
                            {validations[field.id].errMsg}
                          </p>
                        ) : null} */}
                      </>
                    ) : null}
                  </FormControl>
                ))}
              <br />
              <br />
            </form>

            <br />
            <br />
            <Box
              sx={{
                width: "100%",
              }}
            >
              {/* for 'Telephone/Mobile' bill type */}
              {dataFields.billType === BILL_TYPE[3] ? (
                <DynamicTable
                  tableData={tableData}
                  setTableData={setTableData}
                />
              ) : null}
            </Box>
            <ButtonWrapper sx={{ gridColumn: "1/-1" }}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                onClick={handleFormSubmit}
                disabled={!Submitbool}
              >
                Submit
              </Button>
              {/* <Button
                type="button"
                variant="contained"
                size="small"
                onClick={() => handleReset()}
              >
                Cancel
              </Button> */}
              {dataFields?.billFilePath && (
                <Button
                  variant="contained"
                  sx={{
                    width: "100px",
                    backgroundColor: "#1eaf1e",
                    "&:hover": {
                      backgroundColor: "#7fcf7f", // Change the color on hover
                    },
                  }}
                >
                  {" "}
                  <RemoveRedEyeIcon
                    sx={{
                      mr: 1,
                    }}
                  />
                  <a
                    href={`${backendBaseUrl}/uploads/${dataFields.billFilePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      // color: "#4C7AFF",
                      textDecoration: "none",
                      color: "#ffff",
                      cursor: "pointer",
                    }}
                  >
                    Preview
                  </a>
                </Button>
              )}
            </ButtonWrapper>
          </Box>
        </DashboardNew>
      </PageContainer>
    </>
  )
}

export default ManageBill
