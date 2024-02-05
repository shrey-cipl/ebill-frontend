import { BILL_TYPE, ROLES, VALIDATION_TYPE } from "./constants"

const FIELDS_MANAGE_BILL = [
  {
    id: "diaryNumber",
    fieldName: "Diary Number",
    type: "number",
    required: true,
  },
  {
    id: "claimReceivingDate",
    fieldName: "Claim Receiving Date (DD-MM-YYYY)",
    type: "date",
    required: true,
  },
  {
    id: "billType",
    fieldName: "Bill Type",
    type: "select",
    selectOptions: BILL_TYPE,
    required: true,
  },
  {
    id: "billNumber",
    fieldName: "Bill No.",
    type: "select",
    required: true,
  },
  {
    id: "name",
    fieldName: "Name",
    type: "text",
    required: true,
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
    required: true,
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
    required: true,
  },
  {
    id: "fileNumber",
    fieldName: "File Number",
    type: "number",
    required: true,
  },
  {
    id: "claimPeriodFrom",
    fieldName: "Claimed Period From",
    type: "date",
    required: true,
  },
  {
    id: "claimPeriodTo",
    fieldName: "Claimed Period To",
    type: "date",
    required: true,
  },
  {
    id: "totalClaimedAmount",
    fieldName: "Total Claimed Amount",
    type: "number",
    required: true,
  },
  {
    id: "totalAdmissibleAmount",
    fieldName: "Total Amissible Amount",
    type: "number",
    required: true,
  },
  {
    id: "maxAdmissibleAmount",
    fieldName: "Max Amissible Amount",
    type: "number",
    required: true,
  },
  {
    id: "currentStatus",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Open", "Closed", "Forwarded To Bank", "Rejected"],
    required: true,
  },
  {
    id: "lastForwardedTo",
    fieldName: "Forward To",
    type: "select",
    selectOptions: ROLES,
    required: true,
  },
  {
    id: "currentremark",
    fieldName: "Comments",
    type: "text",
    required: true,
  },
]

const FIELDS_MANAGE_BILL_UPDATE = [
  {
    id: "sanctionedAmount",
    fieldName: "Sanctioned Amount",
    type: "number",
    required: true,
  },
  {
    id: "PFMS",
    fieldName: "PFMS",
    type: "number",
    required: true,
  },
  {
    id: "billProcessingStartDate",
    fieldName: "Bill Processing Start Date",
    type: "date",
    required: true,
  },
]

const FIELDS_MANAGE_FORMERS = [
  {
    id: "name",
    fieldName: "Name",
    type: "text",
    required: true,
  },
  {
    id: "status",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Present", "Ex"],
    required: true,
  },
  {
    id: "designation",
    fieldName: "Designation",
    type: "select",
    selectOptions: ["Chairman", "Member"],
    required: true,
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
    required: true,
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
    required: true,
  },
  {
    id: "password",
    fieldName: "Password",
    type: "password",
    required: true,
  },
  {
    id: "isActive",
    fieldName: "Active",
    type: "select",
    selectOptions: ["Active", "Inactive"],
    required: true,
  },
  {
    id: "bankAccountNumber",
    fieldName: "Bank A/C",
    type: "text",
    required: true,
  },
  {
    id: "ifscCode",
    fieldName: "IFSC Code",
    type: "text",
    required: true,
  },
  {
    id: "bankName",
    fieldName: "Bank Name",
    type: "text",
    required: true,
  },
  {
    id: "branchName",
    fieldName: "Branch Name",
    type: "text",
    required: true,
  },
]

const FIELDS_USERS = [
  {
    id: "role",
    fieldName: "Role",
    type: "text",
    required: true,
  },
  {
    id: "name",
    fieldName: "User Name",
    type: "text",
    required: true,
  },
  {
    id: "email",
    fieldName: "E-Mail",
    type: "text",
    required: true,
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
    required: true,
  },
]

const FIELDS_FORMERS_ADD_BILL = [
  {
    id: "billType",
    fieldName: "Bill Type",
    type: "select",
    selectOptions: BILL_TYPE,
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "claimedAmount",
    fieldName: "Amount",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.amount,
  },
  {
    id: "billPeriodFrom",
    fieldName: "Bill Period From",
    type: "date",
    required: true,

    validationType: VALIDATION_TYPE.dateRangeStart,
  },
  {
    id: "billPeriodTo",
    fieldName: "Bill Period To",
    type: "date",
    required: true,

    validationType: VALIDATION_TYPE.dateRangeEnd,
  },
  {
    id: "billFilePath",
    fieldName: "Upload File",
    type: "file",
    required: true,

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
