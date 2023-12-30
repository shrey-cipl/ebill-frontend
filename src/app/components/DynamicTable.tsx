import React, { useState } from 'react';
import { Button, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface TableRowData {
    phone: string;
  periodFrom: string;
  periodTo: string;
  claimedAmount: string;
  admissibleAmount: string;
}
interface DynamicTableProps {
    tableData: TableRowData[];
    setTableData: React.Dispatch<React.SetStateAction<TableRowData[]>>;
  }

const DynamicTable: React.FC<DynamicTableProps>  = ({ tableData, setTableData }) => {
    
 
  const addRow = () => {
    setTableData([...tableData, { phone: '', periodFrom: '', periodTo: '', claimedAmount: '', admissibleAmount: '' }]);
  };

  const removeRow = (index: number) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  const handleInputChange = (index: number, field: keyof TableRowData, value: string) => {
    const updatedData = [...tableData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    };
    setTableData(updatedData);
  };

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
              <TableCell>Add/Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input type="text" value={row.phone} onChange={(e) => handleInputChange(index, 'phone', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="date" value={row.periodFrom} onChange={(e) => handleInputChange(index, 'periodFrom', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="date" value={row.periodTo} onChange={(e) => handleInputChange(index, 'periodTo', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="text" value={row.claimedAmount} onChange={(e) => handleInputChange(index, 'claimedAmount', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="text" value={row.admissibleAmount} onChange={(e) => handleInputChange(index, 'admissibleAmount', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Button onClick={index === tableData.length - 1 ? addRow : () => removeRow(index)} variant="contained" color={index === tableData.length - 1 ? "primary" : "secondary"}>
                    {index === tableData.length - 1 ? "Add More" : "Remove"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DynamicTable;
