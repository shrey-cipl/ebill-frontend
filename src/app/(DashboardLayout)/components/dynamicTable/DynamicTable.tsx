import React, { useState } from "react"
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import InputLabel from "@mui/material/InputLabel"
import { useSearchParams } from "next/navigation"
interface TableRowData {
  phone: string
  periodFrom: string
  periodTo: string
  claimedAmount: string
  admissibleAmount: string
}
interface DynamicTableProps {
  tableData: TableRowData[]
  setTableData: React.Dispatch<React.SetStateAction<TableRowData[]>>
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  tableData,
  setTableData,
}) => {
  const addRow = () => {
    setTableData([
      ...tableData,
      {
        phone: "",
        periodFrom: "",
        periodTo: "",
        claimedAmount: "",
        admissibleAmount: "",
      },
    ])
  }

  const [Validetion, SetValidetion]: any = useState({
    phone: { msg: "", error: false },
    periodFrom: { msg: "", error: false },
    periodTo: { msg: "", error: false },
    claimedAmount: { msg: "", error: false },
    admissibleAmount: { msg: "", error: false },
  })
  const removeRow = (index: number) => {
    const updatedData = [...tableData]
    updatedData.splice(index, 1)
    setTableData(updatedData)
  }

  const searchParams = useSearchParams()

  const paramBillId = searchParams.get("bill_id")
  const paramMode = searchParams.get("mode")

  const isValidPhone = (phone: string): boolean => {
    return /^\d{10}$/.test(phone) // Allow up to 10 digits
  }

  const isValidDateRange = (from: string, to: string): boolean => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    return fromDate <= toDate
  }

  const isValidNumber = (number: string): boolean => {
    return /^\d+(\.\d+)?$/.test(number) // Validate as a number
  }

  const handleInputChange = (
    index: number,
    field: keyof TableRowData,
    value: string
  ) => {
    const updatedData = [...tableData]

    switch (field) {
      case "phone":
        if (!isValidPhone(value)) {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            phone: {
              msg: "Phone number should not exceed 10 digits",
              error: true,
            },
          }))
          // alert("Phone number should not exceed 10 digits")
        } else {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            phone: { msg: "" },
          }))
        }
        break
      case "periodFrom":
        if (isValidDateRange(updatedData[index].periodFrom, value)) {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            periodFrom: {
              msg: "Period From should be less than Period To",
              error: true,
            },
          }))
        } else {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            periodFrom: {
              msg: "",
              error: false,
            },
          }))
        }
        break
      case "periodTo":
        if (isValidDateRange(value, updatedData[index].periodTo)) {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            periodTo: {
              msg: "Period From should be less than Period To",
              error: true,
            },
          }))
        } else {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            periodTo: {
              msg: "",
              error: false,
            },
          }))
        }
        break
      case "claimedAmount":
        if (!isValidNumber(value)) {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            claimedAmount: {
              msg: "Claimed Amount should contain only numbers",
              error: true,
            },
          }))
          // alert("Claimed Amount should contain only numbers")
        } else {
          SetValidetion((prevState: any) => ({
            ...Validetion,
            claimedAmount: {
              msg: "",
              error: false,
            },
          }))
        }
        break
      default:
        break
    }

    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    }

    setTableData(updatedData)
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mobile</TableCell>
              <TableCell>Period From</TableCell>
              <TableCell>Period To</TableCell>
              <TableCell>Claimed Amount</TableCell>
              {/* <TableCell>Admissible Amount</TableCell> */}
              {paramBillId || paramMode ? null : (
                <TableCell>Add/Remove</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="text"
                    value={row?.phone}
                    onChange={(e) =>
                      handleInputChange(index, "phone", e.target.value)
                    }
                    error={Validetion.phone.error}
                  />
                  <InputLabel
                    sx={{
                      color: "#fba088",
                      fontSize: "13px",
                    }}
                  >
                    {Validetion.phone.msg}
                  </InputLabel>
                </TableCell>
                <TableCell>
                  {paramBillId || paramMode ? (
                    <Typography>
                      {row.periodFrom?.substring(8, 10) +
                        "-" +
                        row.periodFrom?.substring(5, 7) +
                        "-" +
                        row.periodFrom?.substring(0, 4)}
                    </Typography>
                  ) : (
                    <Input
                      type="date"
                      value={row?.periodFrom}
                      onChange={(e) =>
                        handleInputChange(index, "periodFrom", e.target.value)
                      }
                      error={Validetion.periodFrom.error}
                    />
                  )}
                  <InputLabel
                    sx={{
                      color: "#fba088",
                      fontSize: "13px",
                    }}
                  >
                    {Validetion.periodFrom.msg}
                  </InputLabel>
                </TableCell>
                <TableCell>
                  {paramBillId || paramMode ? (
                    <Typography>
                      {row.periodTo?.substring(8, 10) +
                        "-" +
                        row.periodTo?.substring(5, 7) +
                        "-" +
                        row.periodTo?.substring(0, 4)}
                    </Typography>
                  ) : (
                    <Input
                      type="date"
                      value={row?.periodTo}
                      onChange={(e) =>
                        handleInputChange(index, "periodTo", e.target.value)
                      }
                      error={Validetion.periodTo.error}
                    />
                  )}
                  <InputLabel
                    sx={{
                      color: "#fba088",
                      fontSize: "13px",
                    }}
                  >
                    {Validetion.periodTo.msg}
                  </InputLabel>
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={row?.claimedAmount}
                    onChange={(e) =>
                      handleInputChange(index, "claimedAmount", e.target.value)
                    }
                    error={Validetion.claimedAmount.error}
                  />
                  {/* {Validetion.claimedAmount} */}
                  <InputLabel
                    sx={{
                      color: "#fba088",
                      fontSize: "13px",
                    }}
                  >
                    {Validetion.claimedAmount.msg}
                  </InputLabel>
                </TableCell>
                {/* <TableCell>
                  <Input
                    type="text"
                    value={row.admissibleAmount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "admissibleAmount",
                        e.target.value
                      )
                    }
                  />
                </TableCell> */}
                {paramBillId || paramMode ? null : (
                  <TableCell>
                    <Button
                      onClick={() => removeRow(index)}
                      variant="contained"
                      color="secondary"
                    >
                      Remove
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {paramBillId || paramMode ? null : (
          <div style={{ width: "100%", textAlign: "center" }}>
            <Button onClick={addRow} variant="contained" color={"primary"}>
              Add More
            </Button>
          </div>
        )}
      </TableContainer>
    </div>
  )
}

export default DynamicTable
