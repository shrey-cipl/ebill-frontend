import { BILL_TYPE, ROLES, VALIDATION_TYPE } from "./constants"

const FIELDS_MANAGE_BILL = [
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

const FIELDS_MANAGE_BILL_UPDATE = [
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

const FIELDS_MANAGE_FORMERS = [
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

const FIELDS_USERS = [
  {
    id: "role",
    fieldName: "Role",
    type: "text",
  },
  {
    id: "name",
    fieldName: "User Name",
    type: "text",
  },
  {
    id: "email",
    fieldName: "E-Mail",
    type: "text",
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
  },
]

const FIELDS_FORMERS_ADD_BILL = [
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
  FIELDS_MANAGE_BILL,
  FIELDS_MANAGE_BILL_UPDATE,
  FIELDS_MANAGE_FORMERS,
  FIELDS_USERS,
  FIELDS_FORMERS_ADD_BILL,
}
