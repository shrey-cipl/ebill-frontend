const BILL_MODES = { add: "add_bill", update: "update_bill" }

// Do not change order
// (used in managebill page)
const BILL_TYPE = [
  "Domestic Help",
  "Medical Reimbursement",
  "F&Reimbursement for Defraying the Services of Orderly",
  "Resident Telephone/Mobile charges Reimbursement",
]

const ROLES = [
  "Asst. Section Officer Admin I",
  "Asst. Section Officer Admin IV",
  "Section Officer Admin I",
  "Section Officer Admin IV",
  "Under Secretary O&M",
  "Deputy Secretary Admin",
  "Joint Secretary Admin",
  "Asst. Section Officer General II",
  "Section Officer General II",
  "Under Secretary General II",
  "Deputy Secretary General",
  "Joint Secretary General",
  "Accounts I",
  "Accounts II",
  "Accounts IV",
  "F&BO",
  "System Admin", // remove this for bill routing page
  "PAO",
  "Forwarded To Bank",
]

const MANAGEBILL_DATA_FIELDS = [
  {
    id: "diaryNumber",
    fieldName: "Diary Number",
    type: "number",
  },
  {
    id: "claimReceivingDate",
    fieldName: "Claim Receiving Date (DD-MM-YYYY)",
    type: "date",
  },
  {
    id: "billType",
    fieldName: "Bill Type",
    type: "select",
    selectOptions: BILL_TYPE,
  },
  {
    id: "billNumber",
    fieldName: "Bill No.",
    type: "select",
  },
  {
    id: "name",
    fieldName: "Name",
    type: "text",
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
  },
  {
    id: "fileNumber",
    fieldName: "File Number",
    type: "number",
  },
  {
    id: "claimPeriodFrom",
    fieldName: "Claimed Period From",
    type: "date",
  },
  {
    id: "claimPeriodTo",
    fieldName: "Claimed Period To",
    type: "date",
  },
  {
    id: "totalClaimedAmount",
    fieldName: "Total Claimed Amount",
    type: "number",
  },
  {
    id: "totalAdmissibleAmount",
    fieldName: "Total Amissible Amount",
    type: "number",
  },
  {
    id: "maxAdmissibleAmount",
    fieldName: "Max Amissible Amount",
    type: "number",
  },
  {
    id: "currentStatus",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Open", "Closed", "Forwarded To Bank", "Rejected"],
  },
  {
    id: "lastForwardedTo",
    fieldName: "Forward To",
    type: "select",
    selectOptions: ROLES,
  },
  {
    id: "currentremark",
    fieldName: "Comments",
    type: "text",
  },
]

const MANAGEBILL_UPDATE_FIELDS = [
  {
    id: "sanctionedAmount",
    fieldName: "Sanctioned Amount",
    type: "number",
  },
  {
    id: "PFMS",
    fieldName: "PFMS",
    type: "number",
  },
  {
    id: "billProcessingStartDate",
    fieldName: "Bill Processing Start Date",
    type: "date",
  },
]

const FORMER_MODES = { add: "add_former", update: "update_former" }

const FORMER_FIELDS = [
  {
    id: "name",
    fieldName: "Name",
    type: "text",
  },
  {
    id: "status",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Present", "Ex"],
  },
  {
    id: "designation",
    fieldName: "Designation",
    type: "select",
    selectOptions: ["Chairman", "Member"],
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
  },
  {
    id: "password",
    fieldName: "Password",
    type: "password",
  },
  {
    id: "isActive",
    fieldName: "Active",
    type: "select",
    selectOptions: ["Active", "Inactive"],
  },
  {
    id: "bankAccountNumber",
    fieldName: "Bank A/C",
    type: "text",
  },
  {
    id: "ifscCode",
    fieldName: "IFSC Code",
    type: "text",
  },
  {
    id: "bankName",
    fieldName: "Bank Name",
    type: "text",
  },
  {
    id: "branchName",
    fieldName: "Branch Name",
    type: "text",
  },
]

const VALIDATION_TYPE = {
  alphaNumeric: "alpha_numeric",
  amount: "amount",
  dateRangeEnd: "date_end",
  dateRangeStart: "date_start",
  email: "email",
  file: "file",
  ifsc: "ifsc",
  mobile: "mobile",
  none: "none",
}

const FORMER_ADD_BILL_FIELDS = [
  {
    id: "billType",
    fieldName: "Bill Type",
    type: "select",
    selectOptions: BILL_TYPE,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "claimedAmount",
    fieldName: "Amount",
    type: "number",
    validationType: VALIDATION_TYPE.amount,
  },
  {
    id: "billPeriodFrom",
    fieldName: "Bill Period From",
    type: "date",
    validationType: VALIDATION_TYPE.dateRangeStart,
  },
  {
    id: "billPeriodTo",
    fieldName: "Bill Period To",
    type: "date",
    validationType: VALIDATION_TYPE.dateRangeEnd,
  },
  {
    id: "billFilePath",
    fieldName: "Upload File",
    type: "file",
    validationType: VALIDATION_TYPE.file,
  },
]

export {
  BILL_MODES,
  BILL_TYPE,
  ROLES,
  MANAGEBILL_DATA_FIELDS,
  MANAGEBILL_UPDATE_FIELDS,
  FORMER_MODES,
  FORMER_FIELDS,
  FORMER_ADD_BILL_FIELDS,
  VALIDATION_TYPE,
}
