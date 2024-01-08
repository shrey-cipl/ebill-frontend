"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

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
    id: "name",
    fieldName: "Name",
    type: "select",
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
      "Under Secretary",
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
      "Additional Secretary Office",
      "Secretary Office",
      "Chairman Office",
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
const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "5px",
  // wordBreak: "break-all",
}))

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

const ManageBill = () => {
  const [dataFields, setDataFields] = useState(initialFieldState)
  const [formerEmp, setFormerEmp] = useState([])
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

  const authCtx: any = useAuth()

  console.log(formerEmp,"formerEmp");
  useEffect(() => {
    if (paramBillId) {
      getBillData(paramBillId, authCtx.user.token).then((billData: any) => {
        console.log("billDATA: ", billData)
        if (billData && billData.data) {
          const {
            diaryNumber,
            claimReceivingDate,
            billType,
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

  // Fetches list of former emoloyee
  useEffect(() => {
    const getFormerEmp = async () => {
      const transformedArr: any = []

      const config = {
        url: `/api/former/getAll`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)
        // Data transformation
        for (let item of res.data) {
          transformedArr.push({
            name: item.name,
            _id: item._id,
            email: item.email,
            phone: item.phone,
          })
        }

        setFormerEmp(transformedArr)
      } catch (err: any) {
        console.log(err.message)
      }
    }

    getFormerEmp()
  }, [authCtx.user.token])

  // Posts form data
  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    try {
      let res

      if (paramMode === BILL_MODES.add) {
        // creates a copy of the state
        const fieldsCopy: any = { ...dataFields }

        let obj =
          tableData[0]?.phone !== ""
            ? {
                ...fieldsCopy,
                lastForwardedBy: authCtx.user.data.role.name,
                // former: dataFields.name,
                fileNumber: dataFields.fileNumber,
                telephoneNumbers: tableData,
              }
            : {
                ...fieldsCopy,
                lastForwardedBy: authCtx.user.data.role.name,
                // former: dataFields.name,
                fileNumber: dataFields.fileNumber,
              }


              console.log(obj);
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

      if (res) {
        if (paramMode === BILL_MODES.add) {
          alert("Data Added!")
        }

        if (paramMode === BILL_MODES.update) {
          alert("Data Updated!")
        }

        // view mode -> redirect instead && update mode -> redirect
        router.push("/Bills")
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }

  // Updates field values
  // const handleFieldChange = (e: any) => {

  //   setDataFields((prevState: any) => ({
  //     ...prevState,

  //     [e.target.name]: e.target.value,

  //   }))
  // }

  const handleFieldChange = (event: any, formerEmp: any) => {
    const { name, value } = event.target

    // If the field is 'name', find the corresponding emp object and set its _id
    if (name === "name") {
      const selectedEmp = formerEmp.find((emp: any) => emp.name === value)
      const empId = selectedEmp ? selectedEmp._id : null

      setDataFields((prevDataFields: any) => ({
        ...prevDataFields,
        [name]: value,
        // Set emp._id in dataFields
        email: selectedEmp.email,
        phone: selectedEmp.phone,
        former: empId,
      }))
    } else {
      // For other fields, directly set the value
      setDataFields((prevDataFields: any) => ({
        ...prevDataFields,
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
                const permanantDisable = ["phone", "email"]

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
                        onChange={(event) =>
                          handleFieldChange(event, formerEmp)
                        }
                        sx={{ width: "100%" }}
                        disabled={disabledPermananty || disabledUpdateFields}
                      >
                        {field.id === "name"
                          ? formerEmp.map((emp: any) => (
                              <MenuItem value={emp.name} key={emp._id}>
                                {emp.name}
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
                        onChange={(event) => handleFieldChange(event, {})}
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
