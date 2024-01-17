import dynamic from "next/dynamic";
import { styled } from "@mui/material/styles";

const ApexChart:any = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => null,
});

export const Chart = styled(ApexChart)``;
