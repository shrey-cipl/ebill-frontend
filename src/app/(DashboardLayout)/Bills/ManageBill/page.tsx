"use client"

import { useCallback, useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { styled } from "@mui/system"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
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
    fieldName: "fileNumber",
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
    id: "currentStatus",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Open", "Closed", "Forwarded To Bank", "Rejected"],
  },
  {
    id: "currentremark",
    fieldName: "Comments",
    type: "text",
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

const TABLE_HEADERS = ["S.No", "Date", "From", "To", "Status", "Remarks"]
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

  const [allReportsByfilter, setAllReportsByfilter]: any = useState([])
  const [updateModeFields, setUpdateModeFields] = useState(
    initialUpdateModeFields
  )

  const router = useRouter()
  const searchParams = useSearchParams()

  const paramBillId = searchParams.get("bill_id")
  const paramMode = searchParams.get("mode")

  const authCtx: any = useAuth()

  // Populates form fields with bill data
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
            currentStatus,
            lastForwardedTo,
            currentremark,
            sanctionedAmount,
            PFMS,
            billProcessingStartDate,
            telephoneNumbers,
          } = billData.data;
  
          setDataFields({
            diaryNumber:diaryNumber,
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
            currentStatus,
            lastForwardedTo,
            currentremark,
          });
  
          setUpdateModeFields({
            sanctionedAmount,
            PFMS,
            billProcessingStartDate: dayjs(billProcessingStartDate).format(
              "YYYY-MM-DD"
            ),
          });
  
          for (let item of telephoneNumbers) {
            item.periodFrom = dayjs(item.periodFrom).format("YYYY-MM-DD");
            item.periodTo = dayjs(item.periodTo).format("YYYY-MM-DD");
          }
  
          // console.log("finall:", telephoneNumbers)
  
          setTableData(telephoneNumbers);
        } else {
          console.error("Invalid or missing data in the API response.");
        }
      })
      .catch((error) => {
        console.error("Error fetching bill data:", error);
      });
  } else {
    console.error("Invalid 'bill_id' parameter in the URL.");
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
        console.log(res.data,"kjhjkhweiusekjhcsql");
        for (let item of res.data) {
          transformedArr.push({ name: item.name, _id: item._id ,  email:item.email  ,  phone:item.phone})
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

        delete fieldsCopy.name
        delete fieldsCopy.email
        delete fieldsCopy.phone
console.log(tableData[0].phone ,"tableData[0].phone ");
        let obj= tableData[0].phone !== ""? {
          ...fieldsCopy,
          lastForwardedBy: authCtx.user.data.role.name,
          // former: dataFields.name,
          fileNumber: dataFields.fileNumber,
          // bill: "650834eeec89bb1b15cb69cb0",
          telephoneNumbers: tableData,
          maxAdmissibleAmount: 123, // ask about this field 
        
        }:{
          ...fieldsCopy,
          lastForwardedBy: authCtx.user.data.role.name,
          // former: dataFields.name,
          fileNumber: dataFields.fileNumber,
          // bill: "650834eeec89bb1b15cb69cb0",
         
          maxAdmissibleAmount: 123, // ask about this field
        }
        const config = {
          url: `/api/claim/create`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${authCtx.user.token}`,
          },
          data: {
            ...obj
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
         let obj= tableData[0].phone !== ""? {
          claimId: paramBillId,
          currentStatus,
          lastForwardedTo,
          currentremark,
          lastForwardedBy: authCtx.user.data.role.name,
          // Update Fields

          sanctionedAmount: updateModeFields.sanctionedAmount,
          PFMS: updateModeFields.PFMS,
          billProcessingStartDate: updateModeFields.billProcessingStartDate,
          telephoneNumbers: tableData,
        }: {
          claimId: paramBillId,
          currentStatus,
          lastForwardedTo,
          currentremark,
          lastForwardedBy: authCtx.user.data.role.name,
          // Update Fields

          sanctionedAmount: updateModeFields.sanctionedAmount,
          PFMS: updateModeFields.PFMS,
          billProcessingStartDate: updateModeFields.billProcessingStartDate,
         
        }
        const config = {
          url: `/api/claim/approveClaim`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${authCtx.user.token}`,
          },
          
          data: {
            claimId: paramBillId,
            currentStatus,
            lastForwardedTo,
            currentremark,
            lastForwardedBy: authCtx.user.data.role.name,
            // Update Fields

            sanctionedAmount: updateModeFields.sanctionedAmount,
            PFMS: updateModeFields.PFMS,
            billProcessingStartDate: updateModeFields.billProcessingStartDate,
            telephoneNumbers: obj,
          }
        }

        res = await axiosApi(
          config.url,
          config.method,
          config.headers,
          config.data
        )
        console.log(config.data,"saaddddddddddddddddda")
        console.log("ssdssds", tableData)
      }
      if (res) {
        alert("Data Added!")
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
  const handleFieldChange = (event:any, formerEmp:any) => {
    const { name, value } = event.target;
  
    // If the field is 'name', find the corresponding emp object and set its _id
    if (name === 'name') {
      const selectedEmp = formerEmp.find((emp:any) => emp.name === value);
      const empId = selectedEmp ? selectedEmp._id : null;
        console.log(selectedEmp,"selectedEmp");
      setDataFields((prevDataFields:any) => ({
        ...prevDataFields,
        [name]: value,
        // Set emp._id in dataFields
        email: selectedEmp.email,
        phone: selectedEmp.phone,
        former: empId,
      }));
    } else {
      // For other fields, directly set the value
      console.log("SDsdds");
      setDataFields((prevDataFields:any) => ({
        ...prevDataFields,
        [name]: value,

      }));
    }
  };
  // async function getBillMovement() {
  //   try {
  //     const url = `/api/claim/get/${paramBillId}`
  //     const method = "GET"
  //     const headers = {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${authCtx.user.token}`,
  //     }
  //     const res = await axiosApi(url, method, headers)
  //     setAllReportsByfilter([...res.data.movement])
  //     if (res.success != true || !res) {
  //       console.log("Bad Request")
  //     } else {
  //       console.log("200")
  //     }
  //   } catch (error) {
  //     console.error("Error fetching ", error)
  //   }
  // }

  const getBillMovement = useCallback(async () => {
    try {
      const url = `/api/claim/get/${paramBillId}`;
      const method = "GET";
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user.token}`,
      };
      const res = await axiosApi(url, method, headers);
      setAllReportsByfilter([...res.data.movement]);
      if (res.success != true || !res) {
        console.log("Bad Request");
      } else {
        console.log("200");
      }
    } catch (error) {
      console.error("Error fetching ", error);
    }
  }, [authCtx.user.token, paramBillId]);

  // Updates 'update' mode fields
  const handleUpdatedModeFields = (e: any) => {
    setUpdateModeFields((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  // useEffect(() => {
  //   getBillMovement()
  // }, [authCtx.user.token,getBillMovement])


  useEffect(() => {
    getBillMovement();
  }, [getBillMovement]);

  console.log(formerEmp, "formerEmp")
  return (
    <>
      <PageContainer title="Add Bill" description="Add bills here">
        <DashboardNew title="Add New Bill" titleVariant="h5">
          <Box mt={2}>
            <form
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {DATA_FIELDS.map((field, i) => {
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
                      key={i}
                      mb={1}
                    >
                      {field.fieldName}
                    </Typography>

                    {field.type === "select" ? (
                      <Select
                        name={field.id}
                        size="small"
                        value={dataFields[field.id]}
                        onChange={(event) => handleFieldChange(event, formerEmp)}
                        sx={{ width: "100%" }}
                        disabled={disabledUpdateFields}
                        key={i}
                      >
                        {field.id === "name"
                          ? formerEmp.map((emp: any) => (
                              <MenuItem value={emp.name} key={emp._id}>{emp.name}</MenuItem>
                            ))
                          : field.selectOptions?.map((option,i) => (
                              <MenuItem value={option} key={i} >{option}</MenuItem>
                            ))}
                      </Select>
                    ) : (
                      <TextField
                        name={field.id}
                        type={field.type}
                        size="small"
                        value={dataFields[field.id]}
                        onChange={(event) => handleFieldChange(event,{})}
                        sx={{ width: "100%" }}
                        disabled={disabledUpdateFields}
                        // disabled={!!dataFields.name} 
                       key={i}
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
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </ButtonWrapper>
          </Box>
        </DashboardNew>
      </PageContainer>
      <br />

      {/* {allReportsByfilter.length !== 0 ? (
        <DashboardNew>
          <Box sx={{ overflow: "auto", width: { xs: "600px", sm: "100%" } }}>
            <TableContainer>
              <Table
                sx={{
                  // display: "block",
                  overflowX: "auto",
                  // maxWidth: 500,
                  minWidth: "500px",
                  // "& .MuiTableCell-root": { border: "1px solid #333" },
                }}
                size="medium"
              >
                <TableHead>
                  <TableRow sx={{ background: "#4C7AFF" }}>
                    {TABLE_HEADERS.map((header, i) => (
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
                  {allReportsByfilter.map((bills: any, i: any) => {
                    const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff"

                    return (
                      <TableRow key={bills._id} sx={{ background: rowColor }}>
                        <TabelCellStyled>{i + 1}</TabelCellStyled>
                        <TabelCellStyled>
                          {bills.forwardedAt.substring(0, 10)}
                        </TabelCellStyled>
                        <TabelCellStyled>{bills.forwardedBy}</TabelCellStyled>
                        <TabelCellStyled>{bills.forwardedTo}</TabelCellStyled>
                        <TabelCellStyled>{bills.status}</TabelCellStyled>
                        <TabelCellStyled>{bills.remarks}</TabelCellStyled>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DashboardNew>
      ) : null} */}
    </>
  )
}

export default ManageBill

