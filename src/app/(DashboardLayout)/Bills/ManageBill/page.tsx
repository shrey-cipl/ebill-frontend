"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { enqueueSnackbar } from "notistack"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { styled } from "@mui/system"
import TableCell from "@mui/material/TableCell"
import dayjs from "dayjs"

import PageContainer from "../../components/container/PageContainer"
import DashboardNew from "../../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import DynamicTable from "../../components/dynamicTable/DynamicTable"

const DATA_FIELDS = [
  {
    id: "diaryNumber",
    fieldName: "Diary Number",
    type: "number",
  },
  {
    id: "claimReceivingDate",
    fieldName: "Claim Receiving Date (YYYY-MM-DD)",
    type: "date",
  },
  {
    id: "billType",
    fieldName: "Bill Type",
    type: "select",
    selectOptions: [
      "Domestic Help",
      "Medical Reimbursement",
      "F&Reimbursement for Defraying the Services of Orderly",
      "Resident Telephone/Mobile charges Reimbursement",
    ],
  },
  {
    id: "billNumber",
    fieldName: "Bill No.",
    type: "select",
    // selectOptions: [
    //   "Domestic Help",
    //   "Medical Reimbursement",
    //   "F&Reimbursement for Defraying the Services of Orderly",
    //   "Resident Telephone/Mobile charges Reimbursement",
    // ],
  },
  {
    id: "name",
    fieldName: "Name",
    type: "text",
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
  },
  {
    id: "fileNumber",
    fieldName: "File Number",
    type: "number",
  },
  {
    id: "claimPeriodFrom",
    fieldName: "Claimed Period From",
    type: "date",
  },
  {
    id: "claimPeriodTo",
    fieldName: "Claimed Period To",
    type: "date",
  },
  {
    id: "totalClaimedAmount",
    fieldName: "Total Claimed Amount",
    type: "number",
  },
  {
    id: "totalAdmissibleAmount",
    fieldName: "Total Amissible Amount",
    type: "number",
  },
  {
    id: "maxAdmissibleAmount",
    fieldName: "Max Amissible Amount",
    type: "number",
  },
  {
    id: "currentStatus",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Open", "Closed", "Forwarded To Bank", "Rejected"],
  },
  {
    id: "lastForwardedTo",
    fieldName: "Forward To",
    type: "select",
    selectOptions: [
      "Asst. Section Officer Admin I",
      "Asst. Section Officer Admin IV",
      "Section Officer Admin I",
      "Section Officer Admin IV",
      "Under Secretary O&M",
      "Deputy Secretary Admin",
      "Joint Secretary Admin",
      "Asst. Section Officer General II",
      "Section Officer General II",
      "Under Secretary General II",
      "Deputy Secretary General",
      "Joint Secretary General",
      "Accounts I",
      "Accounts II",
      "Accounts IV",
      "F&BO",
      "System Admin",
      "PAO",
      "Forwarded To Bank",
    ],
  },
  {
    id: "currentremark",
    fieldName: "Comments",
    type: "text",
  },
]

const UPDATE_FIELDS = [
  {
    id: "sanctionedAmount",
    fieldName: "Sanctioned Amount",
    type: "number",
  },
  {
    id: "PFMS",
    fieldName: "PFMS",
    type: "number",
  },
  {
    id: "billProcessingStartDate",
    fieldName: "Bill Processing Start Date",
    type: "date",
  },
]

// Add to constants folder
const BILL_MODES = { add: "add_bill", update: "update_bill" }

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
for (let arrEl of DATA_FIELDS) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = ""
}

const initialUpdateModeFields: any = {}
// Creates an initial state object (uses 'id')
for (let arrEl of UPDATE_FIELDS) {
  if (!initialUpdateModeFields[arrEl.id]) initialUpdateModeFields[arrEl.id] = ""
}

// Stores a cached data for UpdateModeFields and TableData field
// to reset to initial field state IF IN UPDATE MODE
let cachedUpdateModeField: any
let cachedTableData: any

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

// Used to later store selectedBill id
let selectedBillId: any
let selectedFormerId: any

const ManageBill = () => {
  const [dataFields, setDataFields] = useState(initialFieldState)
  const [BillList, setBillList] = useState([])

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

  const router = useRouter()
  const searchParams = useSearchParams()

  const paramBillId = searchParams.get("bill_id")
  const paramMode = searchParams.get("mode")
  // re-direct from 'UserBills' page
  const paramUserpageId = searchParams.get("id_from_userpage")

  const authCtx: any = useAuth()

  // Populates form fields with bill data
  useEffect(() => {
    if (paramBillId) {
      getBillData(paramBillId, authCtx.user.token).then((billData: any) => {
        // console.log("billDATA: ", billData)
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
            currentremark,
            sanctionedAmount,
            PFMS,
            billProcessingStartDate,
            telephoneNumbers,
          } = billData.data

          setDataFields({
            diaryNumber: diaryNumber,
            claimReceivingDate: dayjs(claimReceivingDate).format("YYYY-MM-DD"),
            billType,
            billNumber: bill.billNumber,
            name: former?.name,
            email: former?.email,
            phone: former?.phone,
            fileNumber,
            claimPeriodFrom: dayjs(claimPeriodFrom).format("YYYY-MM-DD"),
            claimPeriodTo: dayjs(claimPeriodTo).format("YYYY-MM-DD"),
            totalClaimedAmount,
            totalAdmissibleAmount,
            maxAdmissibleAmount,
            currentStatus,
            lastForwardedTo,
            currentremark,
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

  useEffect(() => {
    const getBills = async () => {
      const config = {
        url: `/api/bill/getAll`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)
        setBillList(res.data)
      } catch (err: any) {
        console.log(err.message)
      }
    }

    // if (paramMode === BILL_MODES.add) {
    getBills()
    // }
  }, [paramMode, authCtx.user.token])

  // Auto selects bill number and its corresponding data
  // when re-directed from 'UserBills page'
  useEffect(() => {
    if (paramUserpageId) {
      const selectedBill: any = BillList.find(
        (bill: any) => bill._id === paramUserpageId
      )

      if (selectedBill) {
        // used only in add-mode
        selectedBillId = selectedBill._id
        selectedFormerId = selectedBill.former._id

        setDataFields((prevState: any) => ({
          ...prevState,
          billNumber: selectedBill.billNumber,
          name: selectedBill.former.name,
          email: selectedBill.former.email,
          phone: selectedBill.former.phone,
          // former: empId,
        }))
      }
    }
  }, [paramUserpageId, BillList])

  // Posts form data
  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    try {
      let res

      if (paramMode === BILL_MODES.add) {
        // creates a copy of the state
        const fieldsCopy: any = { ...dataFields }

        delete fieldsCopy.name
        delete fieldsCopy.email
        delete fieldsCopy.phone
        delete fieldsCopy.billNumber

        let obj =
          tableData[0]?.phone !== ""
            ? {
                ...fieldsCopy,
                bill: selectedBillId,

                lastForwardedBy: authCtx.user.data.role.name,
                former: selectedFormerId,
                fileNumber: dataFields.fileNumber,
                telephoneNumbers: tableData,
              }
            : {
                ...fieldsCopy,
                bill: selectedBillId,
                lastForwardedBy: authCtx.user.data.role.name,
                former: selectedFormerId,
                fileNumber: dataFields.fileNumber,
              }

        const config = {
          url: `/api/claim/create`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${authCtx.user.token}`,
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
            authorization: `Bearer ${authCtx.user.token}`,
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
      }

      enqueueSnackbar(res.message, {
        preventDuplicate: true,
        variant: "success",
      })

      router.push("/Bills")
    } catch (err: any) {
      console.log("ManageBill Error:", err)
    }
  }

  const handleFieldChange = (e: any) => {
    // 'value' extracted here is uniquie billNumber
    const { name, value } = e.target

    if (name === "billNumber") {
      // here 'value' contains bill number
      const selectedBill: any = BillList.find(
        (bill: any) => bill.billNumber === value
      )

      // used only in add-mode
      selectedBillId = selectedBill._id
      selectedFormerId = selectedBill.former._id

      setDataFields((prevState: any) => ({
        ...prevState,
        [name]: value,
        name: selectedBill.former.name,
        email: selectedBill.former.email,
        phone: selectedBill.former.phone,
        // former: empId,
      }))
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

  return (
    <>
      <PageContainer
        title={paramMode === BILL_MODES.add ? "Add Bill" : "Update Bill"}
        description="Add bills here"
      >
        <DashboardNew
          title={paramMode === BILL_MODES.add ? "Add New Bill" : "Update Bill"}
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
              {DATA_FIELDS.map((field, i) => {
                // Permanantly disabled fields
                const permanantDisable = ["name", "phone", "email"]

                const disabledPermananty = permanantDisable.includes(field.id)
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
                      {field.fieldName}
                    </Typography>

                    {field.type === "select" ? (
                      <Select
                        name={field.id}
                        size="small"
                        value={dataFields[field.id]}
                        onChange={(e) => handleFieldChange(e)}
                        sx={{ width: "100%" }}
                        disabled={disabledPermananty || disabledUpdateFields}
                      >
                        {field.id === "billNumber"
                          ? BillList.map((bill: any) => (
                              <MenuItem value={bill.billNumber} key={bill._id}>
                                {bill.billNumber}
                              </MenuItem>
                            ))
                          : field.selectOptions?.map((option, i) => (
                              <MenuItem value={option} key={i}>
                                {option}
                              </MenuItem>
                            ))}
                      </Select>
                    ) : (
                      <TextField
                        name={field.id}
                        type={field.type}
                        size="small"
                        value={dataFields[field.id]}
                        onChange={(e) => handleFieldChange(e)}
                        sx={{ width: "100%" }}
                        disabled={disabledPermananty || disabledUpdateFields}
                        multiline={field.id === "currentremark" ? true : false}
                        rows={4}
                      />
                    )}
                  </FormControl>
                )
              })}

              {paramMode === BILL_MODES.update &&
                UPDATE_FIELDS.map((field, i) => (
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
                      {field.fieldName}
                    </Typography>
                    <TextField
                      name={field.id}
                      type={field.type}
                      value={updateModeFields[field.id]}
                      onChange={handleUpdatedModeFields}
                      sx={{ width: "100%" }}
                      size="small"
                      // disabled={disabledUpdateFields}
                    />
                  </FormControl>
                ))}
            </form>
            <br />
            <br />
            <Box
              sx={{
                width: "100%",
              }}
            >
              {dataFields.billType ===
              "Resident Telephone/Mobile charges Reimbursement" ? (
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
          </Box>
        </DashboardNew>
      </PageContainer>
    </>
  )
}

export default ManageBill
