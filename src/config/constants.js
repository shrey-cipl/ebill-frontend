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
    fieldName: "Claim Receiving Date (YYYY-MM-DD)",
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

export {
  BILL_MODES,
  BILL_TYPE,
  ROLES,
  MANAGEBILL_DATA_FIELDS,
  MANAGEBILL_UPDATE_FIELDS,
}
