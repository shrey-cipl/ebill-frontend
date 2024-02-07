import { BILL_TYPE, ROLES, VALIDATION_TYPE } from "./constants"

const FIELDS_MANAGE_BILL = [
  {
    id: "diaryNumber",
    fieldName: "Diary Number",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "claimReceivingDate",
    fieldName: "Claim Receiving Date (DD-MM-YYYY)",
    type: "date",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "billType",
    fieldName: "Bill Type",
    type: "select",
    selectOptions: BILL_TYPE,
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "billNumber",
    fieldName: "Bill No.",
    type: "select",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "name",
    fieldName: "Name",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.email,
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.mobile,
  },
  {
    id: "fileNumber",
    fieldName: "File Number",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "claimPeriodFrom",
    fieldName: "Claimed Period From",
    type: "date",
    required: true,
    validationType: VALIDATION_TYPE.dateRangeStart,
  },
  {
    id: "claimPeriodTo",
    fieldName: "Claimed Period To",
    type: "date",
    required: true,
    validationType: VALIDATION_TYPE.dateRangeEnd,
  },
  {
    id: "totalClaimedAmount",
    fieldName: "Total Claimed Amount",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.amount,
  },
  {
    id: "totalAdmissibleAmount",
    fieldName: "Total Amissible Amount",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.amount,
  },
  {
    id: "maxAdmissibleAmount",
    fieldName: "Max Amissible Amount",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.amount,
  },
  {
    id: "currentStatus",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Open", "Closed", "Forwarded To Bank", "Rejected"],
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "lastForwardedTo",
    fieldName: "Forward To",
    type: "select",
    selectOptions: ROLES,
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "currentremark",
    fieldName: "Comments",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
]

const FIELDS_MANAGE_BILL_UPDATE = [
  {
    id: "sanctionedAmount",
    fieldName: "Sanctioned Amount",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.amount,
  },

  {
    id: "PFMS",
    fieldName: "PFMS",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "billProcessingStartDate",
    fieldName: "Bill Processing Start Date",
    type: "date",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
]

const FIELDS_MANAGE_FORMERS = [
  {
    id: "name",
    fieldName: "Name",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "status",
    fieldName: "Status",
    type: "select",
    selectOptions: ["Present", "Ex"],
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "designation",
    fieldName: "Designation",
    type: "select",
    selectOptions: ["Chairman", "Member"],
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.mobile,
  },
  {
    id: "email",
    fieldName: "E-mail",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.email,
  },
  {
    id: "password",
    fieldName: "Password",
    type: "password",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "isActive",
    fieldName: "Active",
    type: "select",
    selectOptions: ["Active", "Inactive"],
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "bankAccountNumber",
    fieldName: "Bank A/C",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "confrimbankAccountNumber",
    fieldName: "Confrim Bank A/C",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "ifscCode",
    fieldName: "IFSC Code",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },

  {
    id: "bankName",
    fieldName: "Bank Name",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },

  {
    id: "branchName",
    fieldName: "Branch Name",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
]

const FIELDS_USERS = [
  {
    id: "role",
    fieldName: "Role",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "name",
    fieldName: "User Name",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.none,
  },
  {
    id: "email",
    fieldName: "E-Mail",
    type: "text",
    required: true,
    validationType: VALIDATION_TYPE.email,
  },
  {
    id: "phone",
    fieldName: "Phone",
    type: "number",
    required: true,
    validationType: VALIDATION_TYPE.mobile,
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
