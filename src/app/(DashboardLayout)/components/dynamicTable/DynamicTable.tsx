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

  const removeRow = (index: number) => {
    const updatedData = [...tableData]
    updatedData.splice(index, 1)
    setTableData(updatedData)
  }


  const searchParams = useSearchParams()

  const paramBillId = searchParams.get("bill_id")
  const paramMode = searchParams.get("mode")


  const handleInputChange = (
    index: number,
    field: keyof TableRowData,
    value: string
  ) => {
    console.log(tableData,"tableData");
    const updatedData = [...tableData]

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
              <TableCell>Admissible Amount</TableCell>
              {paramBillId||paramMode?null:<TableCell>Add/Remove</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="text"
                    value={row.phone}
                    onChange={(e) =>
                      handleInputChange(index, "phone", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                {paramBillId||paramMode? <Typography>
                  {row.periodFrom.substring(8,  9) +"-"+ row.periodFrom.substring(5,  7) + "-"+ row.periodFrom.substring(0,  4)}
                </Typography>:
                  <Input
                    type="date"
                    value={row.periodFrom}
                    onChange={(e) =>
                      handleInputChange(index, "periodFrom", e.target.value)
                    }
                  />
                }
                </TableCell>
                <TableCell>
                {paramBillId||paramMode? <Typography>
                  {row.periodTo.substring(8,  9) +"-"+ row.periodTo.substring(5,  7) + "-"+ row.periodTo.substring(0,  4)}
                </Typography>:
                  <Input
                    type="date"
                    value={row.periodTo}
                    onChange={(e) =>
                      handleInputChange(index, "periodTo", e.target.value)
                    }
                  />
                   }
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={row.claimedAmount}
                    onChange={(e) =>
                      handleInputChange(index, "claimedAmount", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                {paramBillId||paramMode?null:<Button
                    onClick={() => removeRow(index)}
                    variant="contained"
                    color="secondary"
                  >
                    Remove
                  </Button>}
                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {paramBillId||paramMode?null:
         <div style={{ width: "100%", textAlign: "center" }}>
         <Button onClick={addRow} variant="contained" color={"primary"}>
           Add More
         </Button>
       </div>
        }
       
      </TableContainer>
    </div>
  )
}

export default DynamicTable
