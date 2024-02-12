"use client"

import { redirect } from "next/navigation"

const Reports = () => {
  redirect("/not-found")

  return (
    <>
      {/* <DashboardCard title="Reports">
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
              <FormControl></FormControl>
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
                  Name{""}
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
                  <MenuItem disabled value="">
                    <em>Name</em>
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

              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="status"
                mb="5px"
                mt="25px"
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

                  <MenuItem value="Domestic Help">Domestic Help</MenuItem>
                  <MenuItem value="Medical Reimbursement">
                    Medical Reimbursement
                  </MenuItem>
                  <MenuItem value=" F&Reimbursement for Defraying the Services of Orderly">
                    F&Reimbursement for Defraying the Services of Orderly
                  </MenuItem>
                  <MenuItem value="Resident Telephone/Mobile charges Reimbursement">
                    Resident Telephone/Mobile charges Reimbursement
                  </MenuItem>
                </StyledSelect>
              </FormControl>
            </Stack>
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="designation"
                mb="5px"
              >
                Claim Year
              </Typography>
              <FormControl size="small">
                <InputLabel>Claim Year</InputLabel>
                <Select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  label="Claim Year"
                >
                  {years.reverse().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="status"
                mb="5px"
                mt="25px"
              >
                Bill Status
              </Typography>
              <FormControl>
                <InputLabel size="small" id="demo-simple-select-label">
                  Bill Status
                </InputLabel>
                <StyledSelect
                  type="text"
                  label="Bill status"
                  value={formData.billstatus}
                  name="billstatus"
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem disabled value="ctfc">
                    <em>Bill Status</em>
                  </MenuItem>

                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Close">Close</MenuItem>
                </StyledSelect>
              </FormControl>
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              my: 2,
              width: "300px",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              fullWidth
              onClick={() => {
                router.push(`/BillStatusLog?name=${formData.name}`)
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
                GET STATUS
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
                  billstatus: "",
                  month: "",
                  year: "",
                  from: "",
                  to: "",
                })
                setAllReportsByfilter([])
                setGet(false)
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
      </DashboardCard>

      <br />

      {get && allReportsByfilter.length != 0 && (
        <DashboardNew>
          <PageContainer title="Bills" description="List of all the bills">
            <Box sx={{ overflow: "auto", width: { xs: "600px", sm: "100%" } }}>
              <TableContainer>
                <Table
                  sx={{
                    overflowX: "auto",
                    minWidth: "500px",
                  }}
                  size="small"
                >
                  {get && allReportsByfilter.length != 0 && (
                    <TableHead>
                      <TableRow sx={{ background: "#4C7AFF" }}>
                        {TABLE_HEADERS.map((header, i) => (
                          <TableCell
                            key={i}
                            sx={{
                              color: "white",
                              padding: "15px 10px",
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                  )}

                  <TableBody>
                    {allReportsByfilter.map((bills: any, i: any) => {
                      const rowColor = (i + 1) % 2 === 0 ? "#eee" : "#fff"

                      return (
                        <TableRow key={bills._id} sx={{ background: rowColor }}>
                          <TabelCellStyled>{bills.diaryNumber}</TabelCellStyled>
                          <TabelCellStyled>{bills.name}</TabelCellStyled>
                          <TabelCellStyled>{bills.billType}</TabelCellStyled>
                          <TabelCellStyled>
                            {bills.totalClaimedAmount}
                          </TabelCellStyled>
                          <TabelCellStyled>
                            {bills.totalAdmissibleAmount}
                          </TabelCellStyled>
                          <TabelCellStyled>
                            {bills.currentStatus}
                          </TabelCellStyled>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </PageContainer>
        </DashboardNew>
      )}
      {get && allReportsByfilter.length == 0 && (
        <Typography
          sx={{
            color: "red",
          }}
        >
          No report found !!
        </Typography>
      )} */}
    </>
  )
}

export default Reports
