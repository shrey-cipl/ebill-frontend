"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Select, Stack, Typography } from "@mui/material";

import axiosApi from "@/Util/axiosApi";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import { useAuth } from "@/context/JWTContext/AuthContext.provider";
import {
  InputBillType,
  InputFormerName,
  InputYearly,
} from "../components/InputComponents/InputComponents";
import FilterTable from "../components/filterTable/FilterTable";

const DashboardNew = dynamic(() => import("../components/shared/DashboardNew"));
const PageContainer = dynamic(
  () => import("../components/container/PageContainer")
);

const YearlyWiseReport = () => {
  const auth: any = useAuth();

  const [get, setGet]: any = useState(false);
  const [allReports, setAllReports]: any = useState([]);
  const [allReportsByfilter, setAllReportsByfilter]: any = useState([]);
  const [formData, setFormData] = useState<any>({
    name: "",
    billtype: "",
    month: "",
    year: "",
  });

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 30;
  const years = Array.from({ length: 31 }, (_, index) => startYear + index);

  async function getReports(token: any) {
    try {
      const url = "/api/former/getall";
      const method = "GET";
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      };
      const res = await axiosApi(url, method, headers);
      setAllReports([...res.data]);
      if (res.success != true || !res) {
        console.log("Bad Request");
      } else {
        console.log("200");
      }
    } catch (error) {
      console.error("Error fetching ", error);
    }
  }

  async function getReportsbyfilter() {
    setGet(true);
    try {
      const url = `/api/claim/getall?billType=${formData.billtype}&year=${
        formData.year
      }&name=${formData.name == "All" ? "" : formData.name}`;
      const method = "GET";
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${auth.user.token}`,
      };
      const res = await axiosApi(url, method, headers);
      for (let item of res.data) {
        item.id = item._id;
      }
      setAllReportsByfilter([...res.data]);
      if (res.success != true || !res) {
        console.log("Bad Request");
      } else {
        console.log("200");
      }
    } catch (error) {
      console.error("Error fetching ", error);
    }
  }

  const handleChange = (e: any) => {
    const val = e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };
  useEffect(() => {
    getReports(auth.user.token);
  }, [auth.user.token]);

  return (
    <PageContainer title="Yearly Report" description="List">
      <DashboardNew title="Yearly Report" titleVariant="h5">
        <>
          <Box
            sx={{
              display: {
                xs: "block",
                sm: "flex",
                md: "flex",
              },
              m: "auto",
            }}
          >
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                },
                mr: 2,
                mb: 2,
              }}
            >
              <InputFormerName
                formData={formData}
                allReports={allReports}
                handleChange={handleChange}
              />
              <InputYearly formData={formData} handleChange={handleChange} />
            </Stack>
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                },
              }}
            >
              <InputBillType formData={formData} handleChange={handleChange} />
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              my: 2,
              width: "200px",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              fullWidth
              onClick={getReportsbyfilter}
            >
              <Typography
                sx={{
                  fontWeight: 750,
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                GET
              </Typography>
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              fullWidth
              onClick={() => {
                setFormData({
                  name: "",
                  billtype: "",
                  month: "",
                  year: "",
                  from: "",
                  to: "",
                });
                setAllReportsByfilter([]);
                setGet(false);
              }}
            >
              <Typography
                sx={{
                  fontWeight: 750,
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                CLEAR
              </Typography>
            </Button>
          </Box>
        </>
      </DashboardNew>

      <br />

      <br />

      <FilterTable allReportsByfilter={allReportsByfilter} get={get} />
    </PageContainer>
  );
};

export default YearlyWiseReport;
