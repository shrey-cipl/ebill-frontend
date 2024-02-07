import {
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Select,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { BILL_TYPE } from "@/config/constants"
import { months } from "@/config/constants"

const StyledSelect = styled(Select)(({ theme }) => ({
  display: "block",
}))

const currentYear = new Date().getFullYear()
const startYear = currentYear - 30
const years = Array.from({ length: 31 }, (_, index) => startYear + index)

const InputFormerName = ({ formData, allReports, handleChange }: any) => {
  return (
    <>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        component="label"
        htmlFor="name"
        mb="5px"
      >
        Name
      </Typography>
      <FormControl>
        <InputLabel size="small" id="demo-simple-select-label">
          {" "}
          Name{" "}
        </InputLabel>
        <StyledSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData.name}
          name="name"
          label="Name"
          onChange={handleChange}
          size="small"
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled>
            <em>Name</em>
          </MenuItem>
          <MenuItem value="All">
            <em>All</em>
          </MenuItem>
          {allReports.map((el: any, i: any) => {
            return (
              <MenuItem value={el.former.name} key={i}>
                {el.former.name}
              </MenuItem>
            )
          })}
        </StyledSelect>
      </FormControl>
    </>
  )
}

const InputBillType = ({ formData, handleChange }: any) => {
  return (
    <>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        component="label"
        htmlFor="status"
        mb="5px"
      >
        Bill Type
      </Typography>
      <FormControl>
        <InputLabel size="small" id="demo-simple-select-label">
          Bill Type
        </InputLabel>
        <StyledSelect
          type="text"
          label="Bill Type"
          value={formData.billtype}
          name="billtype"
          onChange={handleChange}
          size="small"
        >
          <MenuItem disabled value="ctfc">
            <em>Bill Type</em>
          </MenuItem>

          {BILL_TYPE.map((ele, i) => {
            return (
              <MenuItem key={i} value={ele}>
                {ele}
              </MenuItem>
            )
          })}
        </StyledSelect>
      </FormControl>
    </>
  )
}

const InputMonthly = ({ formData, handleChange }: any) => {
  return (
    <>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        component="label"
        htmlFor="location"
        mb="5px"
        mt="15px"
      >
        Month
      </Typography>
      <FormControl size="small">
        <InputLabel>Month</InputLabel>
        <Select
          name="month"
          value={formData.month}
          onChange={handleChange}
          label="Month"
        >
          {months.map((month: any, index: any) => (
            <MenuItem key={index} value={index + 1}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

const InputYearly = ({ formData, handleChange }: any) => {
  return (
    <>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        component="label"
        htmlFor="designation"
        mb="5px"
        mt="15px"
      >
        Year
      </Typography>
      <FormControl size="small">
        <InputLabel>Year</InputLabel>
        <Select
          name="year"
          value={formData.year}
          onChange={handleChange}
          label="Year"
        >
          {/* <Box
                    sx={{
                      height: "320px",
                    }}
                  > */}
          {years.reverse().map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
          {/* </Box> */}
        </Select>
      </FormControl>
    </>
  )
}
export { InputBillType, InputFormerName, InputMonthly, InputYearly }
