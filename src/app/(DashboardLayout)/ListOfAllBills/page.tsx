"use client";
import { useEffect, useState } from "react";

import axios from "axios";
import dayjs from "dayjs";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/system";

import PageContainer from "../components/container/PageContainer";
import DashboardNew from "../components/shared/DashboardNew";
import Pagination from "../components/Pagination/Pagination";
import { useAuth } from "@/context/JWTContext/AuthContext.provider";
import axiosApi from "@/Util/axiosApi";
import Link from "next/link";

const LIST_OF_BILLS_HEADERS = [
  "S.No",
  "Name",
  "Bill No.",
  "Bill Type",
  "Receiving Date",
  "Claimed Amount",
  "Sanctioned Amount",
  "Bill Status",
  "Pending Branch",
  "Updated on",
  "Forward To",
  "Channel Log",
];

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "10px 5px",
}));

const ListOfAllBills = () => {
  const [billList, setBillList] = useState([]);
  const [pageNo, setPageNo] = useState(1);

  const authCtx: any = useAuth();

  const handleFetchListOfBills = async () => {
    const config = {
      url: `/api/claim/getall?limit=10&page=${pageNo}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user.token}`,
      },
    };

    try {
      const res = await axiosApi(config.url, config.method, config.headers);

      setBillList(res.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleFetchListOfBills();
  }, [pageNo, authCtx.user.token]);

  return (
    <PageContainer
      title="List"
      description="List"
    >
      <DashboardNew title="All Bills Report" titleVariant="h5">
        <>
          <Table sx={{ marginTop: "20px" }}>
            <TableHead>
              <TableRow sx={{ background: "#4C7AFF" }}>
                {LIST_OF_BILLS_HEADERS.map((header, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      color: "white",
                      padding: "5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {billList?.map((bill: any, i) => {
                const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff";

                const itemNumber = (pageNo - 1) * 10 + (i + 1);

                return (
                  <TableRow key={bill._id} sx={{ background: rowColor }}>
                    <TabelCellStyled>{`${itemNumber}.`}</TabelCellStyled>
                    <TabelCellStyled>{bill.name}</TabelCellStyled>
                    <TabelCellStyled>{bill.billNumber}</TabelCellStyled>
                    <TabelCellStyled>{bill.billType}</TabelCellStyled>
                    <TabelCellStyled>
                      {dayjs(bill.claimReceivingDate).format("YYYY-MM-DD")}
                    </TabelCellStyled>
                    <TabelCellStyled>{bill.totalClaimedAmount}</TabelCellStyled>
                    <TabelCellStyled>{bill.totalClaimedAmount}</TabelCellStyled>
                    <TabelCellStyled
                      sx={{
                        color: bill.currentStatus === "Open" ? "green" : "red",
                      }}
                    >
                      {bill.currentStatus}
                    </TabelCellStyled>
                    <TabelCellStyled>
                      {bill.lastForwardedTo
                        ? `Pending at ${bill.lastForwardedTo}`
                        : "Completed"}
                    </TabelCellStyled>
                    <TabelCellStyled>
                      {dayjs(bill.updatedAt).format("YYYY-MM-DD")}
                    </TabelCellStyled>
                    <TabelCellStyled>{bill.lastForwardedTo}</TabelCellStyled>
                    <TabelCellStyled>
                      {bill.pendingBranch ? (
                        <Link
                          style={{
                            color: "#4C7AFF",
                            textDecoration: "none",
                          }}
                          // href={`/Bills/ManageBill?bill_id=${bill._id}&mode=${BILL_MODES.update}`}

                          href={`/Bills/View?bill_id=${bill._id}`}
                        >
                          Log
                        </Link>
                      ) : (
                        // <button
                        //   style={{
                        //     background: "none",
                        //     border: "none",
                        //     color: "#4C7AFF",
                        //     fontSize: "13px",
                        //     padding: 0,
                        //     cursor: "pointer",
                        //   }}
                        //   onClick={() => handleViewBill(bill._id)}
                        // >
                        //   View
                        // </button>
                        <Link
                          style={{
                            color: "#4C7AFF",
                            textDecoration: "none",
                          }}
                          href={`/Bills/View?bill_id=${bill._id}`}
                        >
                          Log
                        </Link>
                      )}
                    </TabelCellStyled>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Pagination
            url={`/api/claim/getall`}
            data={billList}
            setPageNo={setPageNo}
          />
        </>
      </DashboardNew>
    </PageContainer>
  );
};

export default ListOfAllBills;
