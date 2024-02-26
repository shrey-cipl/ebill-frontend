"use client";
import { useEffect, useState } from "react";

import dayjs from "dayjs";

import PageContainer from "../components/container/PageContainer";
import DashboardNew from "../components/shared/DashboardNew";
import { useAuth } from "@/context/JWTContext/AuthContext.provider";
import axiosApi from "@/Util/axiosApi";
import Link from "next/link";

import { GridColDef } from "@mui/x-data-grid";
import CustomGrid from "../components/CustomGrid";
import { Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";

const ResetOfAllBills = () => {
  const [billList, setBillList] = useState<any>([]);

  const authCtx: any = useAuth();

  const handleFetchBills = async () => {
    const config = {
      url: `/api/claim/getall`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx?.user?.token}`,
      },
    };

    try {
      const res = await axiosApi(config.url, config.method, config.headers);

      if (res && res.data) {
        for (let item of res.data) {
          item.id = item._id;
          item.billNumber = item.bill.billNumber;
        }

        setBillList(res.data);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // collect bills and updates list
  useEffect(() => {
    handleFetchBills();
  }, [authCtx?.user?.token]);

  const columns: GridColDef[] = [
    {
      field: "s.no", // confirm this
      headerName: "S.NO",
      valueGetter: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "name", headerName: "NAME" },
    { field: "diaryNumber", headerName: "DAIRY NO." },
    { field: "billType", headerName: "BILL TYPE" },
    { field: "billNumber", headerName: "BILL NO." },
    {
      field: "claimReceivingDate",
      headerName: "RECEIVING DATE",
      valueFormatter: (params) => {
        return dayjs(params.value).format("YYYY-MM-DD");
      },
    },
    { field: "totalClaimedAmount", headerName: "CLAIMED AMOUNT" },
    { field: "sanctionedAmount", headerName: "SANCTIONED AMOUNT" },
    { field: "currentStatus", headerName: "BILL STATUS" },
    {
      field: "pendingBranch",
      headerName: "PENDING BRANCH",
      valueFormatter: (params) => {
        return `Pending at ${params.value}`;
      },
    },
    {
      field: "createdAt",
      headerName: "CREATED AT",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A");
      },
    },
    {
      field: "updatedAt",
      headerName: "UPDATED ON",

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY h:mm A");
      },
    },
    { field: "lastForwardedTo", headerName: "FORWARD TO" },
    {
      field: "random_2",
      headerName: "CHANNEL LOG",
      renderCell: (params) => {
        console.log(params.row.bill.claim);
        return (
          <Typography
            sx={{
              color: "blue",
              cursor: "pointer",
            }}
            onClick={async () => {
              const config = {
                url: `/api/claim/resetClaimToLast`,
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${authCtx?.user?.token}`,
                },
                data: {
                  claimId: params.row.bill.claim,
                },
              };

              try {
                const res = await axiosApi(
                  config.url,
                  config.method,
                  config.headers,
                  config.data
                );
                if (res) {
                  enqueueSnackbar(res.message, {
                    preventDuplicate: true,
                    variant: "success",
                  });
                }
              } catch (err: any) {
                console.log(err.message);
              }
            }}
          >
            Roll back
          </Typography>
        );
      },
    },
  ];

  console.log(billList);
  return (
    <PageContainer title="Reset Bill Status" description="List">
      <DashboardNew title=" All Bills" titleVariant="h5">
        <>
          <CustomGrid
            rows={billList}
            columns={columns}
            sx={{
              ".text-green": {
                color: "green",
              },
              ".text-red": {
                color: "red",
              },
            }}
            getCellClassName={(params: any) => {
              if (params.field === "currentStatus") {
                return params.row.currentStatus === "Open"
                  ? "text-green"
                  : "text-red";
              }

              return "";
            }}
          />
        </>
      </DashboardNew>
    </PageContainer>
  );
};

export default ResetOfAllBills;
