"use client";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import Link from "next/link";

import axiosApi from "@/Util/axiosApi";
import { useAuth } from "@/context/JWTContext/AuthContext.provider";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import DashboardNew from "../../components/shared/DashboardNew";
import { get } from "lodash";

const TabelCellStyled = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "5px",
  // wordBreak: "break-all",
}));
//   useEffect(() => {
//     if (paramBillId) {
//       getBillData(paramBillId, authCtx.user.token).then((billData: any) => {
//         console.log("billDATA: ", billData?.data)
//         const {
//           diaryNumber,
//           claimReceivingDate,
//           billType,
//           former,
//           fileNumber,
//           claimPeriodFrom,
//           claimPeriodTo,
//           totalClaimedAmount,
//           totalAdmissibleAmount,
//           currentStatus,
//           lastForwardedTo,
//           currentremark,
//           sanctionedAmount,
//           PFMS,
//           billProcessingStartDate,
//           telephoneNumbers,
//         } = billData?.data

//         setDataFields({
//           diaryNumber,
//           claimReceivingDate: dayjs(claimReceivingDate).format("YYYY-MM-DD"),
//           billType,
//           name: former?.name,
//           email: former?.email,
//           phone: former?.phone,
//           fileNumber: fileNumber,
//           claimPeriodFrom: dayjs(claimPeriodFrom).format("YYYY-MM-DD"),
//           claimPeriodTo: dayjs(claimPeriodTo).format("YYYY-MM-DD"),
//           totalClaimedAmount,
//           totalAdmissibleAmount,
//           currentStatus,
//           lastForwardedTo,
//           currentremark,
//         })

//         setUpdateModeFields({
//           sanctionedAmount,
//           PFMS,
//           billProcessingStartDate: dayjs(billProcessingStartDate).format(
//             "YYYY-MM-DD"
//           ),
//         })

//         for (let item of telephoneNumbers) {
//           item.periodFrom = dayjs(item.periodFrom).format("YYYY-MM-DD")
//           item.periodTo = dayjs(item.periodTo).format("YYYY-MM-DD")
//         }

//         // console.log("finall:", telephoneNumbers)

//         setTableData(telephoneNumbers)
//       })
//     }
//   }, [paramBillId, authCtx.user.token])

const Page = () => {
  const authCtx: any = useAuth();

  const searchParams = useSearchParams();
  const paramBillId = searchParams.get("bill_id");
  const TABLE_HEADERS = ["S.No", "Date", "From", "To", "Status", "Remarks"];
  const [allReportsByfilter, setAllReportsByfilter]: any = useState([]);
  async function getBillMovement() {
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
  }
  useEffect(() => {
    getBillMovement();
  }, [authCtx.user.token]);
  //   const getBillData = async (id: any, token: any) => {
  //     const config = {
  //       url: `/api/claim/get/${paramBillId}`,
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: `Bearer ${token}`,
  //       },
  //     };

  //     try {
  //       const res = await axiosApi(config.url, config.method, config.headers);
  //       return res;
  //     } catch (err: any) {
  //       console.log(err.message);
  //     }
  //   };

  return (
    <div>
        <h3> Channel Log </h3>
      {allReportsByfilter.length !== 0 ? (
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
                    const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff";

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
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DashboardNew>
      ) : null}
    </div>
  );
};

export default Page;
