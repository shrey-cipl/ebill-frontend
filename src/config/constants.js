const BILL_MODES = { add: "add_bill", update: "update_bill" }

const FORMER_MODES = { add: "add_former", update: "update_former" }

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

const VALIDATION_TYPE = {
  alphaNumeric: "alpha_numeric",
  amount: "amount",
  dateRangeEnd: "date_end",
  dateRangeStart: "date_start",
  email: "email",
  file: "file",
  ifsc: "ifsc",
  matchOne: "match_one",
  matchTwo: "match_two",
  mobile: "mobile",
  none: "none",
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export { BILL_MODES, FORMER_MODES, BILL_TYPE, ROLES, VALIDATION_TYPE, months }
