import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import dayjs from "dayjs"

import { VALIDATION_TYPE } from "@/config/constants"

// Checks if the data passes the regular expression
const regExCheck = (data, regExpression) => {
  return regExpression.test(data)
}

// Checks if all the field inputs are valid and returns an updated validation state
const validateOnSubmit = (dataToValidate, validationState) => {
  // delete dataToValidate?.former
  // delete validationState?.former
  // delete dataToValidate?.billFilePath
  // delete validationState?.billFilePath

  // Creates a deep copy
  const validationStateCopy = JSON.parse(JSON.stringify(validationState))

  // Collects field ids used by both dataToValidate & validationState
  const fieldKeys = Object.keys(dataToValidate)

  // Date range data
  const dateRange = {
    start: "",
    end: "",
  }

  // For matching any 2 fields
  let inputMatch = {
    one: "",
    fieldOneName: "",
    two: "",
    fieldTwoName: "",
  }
  // console.log(fieldKeys, "ggggggggggg")

  for (let key of fieldKeys) {
    if (
      // key !== "billFilePath" &&
      key !== "maxAdmissibleAmount" &&
      key !== "former" &&
      key !== "telephoneNumbers"
    ) {
      // De-structures validation type for that key
      const { validationType } = validationState[key]

      // Assumes valid data initially
      validationStateCopy[key].valid = true
      validationStateCopy[key].errMsg = ""

      console.log(dataToValidate[key], "aaaaalll  VALIDATION_TYPE.name")
      if (validationType === VALIDATION_TYPE.name) {
        const nameRegex = regExCheck(
          dataToValidate[key],
          /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
        )

        if (!nameRegex) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg = "only valid name is allowed"
        }
      }
      if (validationType === VALIDATION_TYPE.file) {
        const fileValidation = regExCheck(
          dataToValidate[key].name,
          /\.(jpg|png|jpeg|pdf)$/i
        )

        if (!fileValidation) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg =
            "Only .jpg , .png , .jpeg , .pdf is allowed"
        }
      }
      // const fileValidation = /\.(jpg|png|jpeg|pdf)$/i;
      if (validationType === VALIDATION_TYPE.alphaNumeric) {
        // Allows alpha-numeric, with (.), (-), (/) and characters upto 30
        const validAlphanumeric = regExCheck(
          dataToValidate[key],
          /^[a-zA-Z0-9./-]{1,30}$/
        )

        if (!validAlphanumeric) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg =
            "Only alphanumeric with (.), (/), (-) is allowed"
        }
      }

      if (validationType === VALIDATION_TYPE.amount) {
        // Checks if number is greater than 0 (includes decimals)
        const validAmount = regExCheck(
          dataToValidate[key],
          /^[1-9]\d*(\.\d+)?$/
        )

        if (!validAmount) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg = "Amount should be greater than 0"
        }
      }

      if (validationType === VALIDATION_TYPE.mobile) {
        // ensures input data is exactly 10-digit number
        const validMobile = regExCheck(dataToValidate[key], /^\d{10}$/)

        if (!validMobile) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg = "Phone number should be 10-digits"
        }
      }

      if (validationType === VALIDATION_TYPE.ifsc) {
        // Valid IFSC: 11 characters long, first 4 character uppercase letters
        // fifth character '0', last six are alpha-numeric
        const validIFSC = regExCheck(
          dataToValidate[key],
          /^[A-Z]{4}[0][A-Z0-9]{6}$/
        )

        if (!validIFSC) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg = "Invalid IFSC Code"
        }
      }

      if (validationType === VALIDATION_TYPE.email) {
        // ensures email does not start/end with: '@', space, period (.)
        // contains exactly 1 '@' which is followed by a period (.)
        const validEmail = regExCheck(
          dataToValidate[key],
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        )

        if (!validEmail) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg = "Please enter a valid Email address"
        }
      }

      if (validationType === VALIDATION_TYPE.empty) {
        const validInput = regExCheck(dataToValidate[key], /.+/)

        if (!validInput) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg = "Please enter a Input"
        }
      }
      if (validationType === VALIDATION_TYPE.file) {
        // 5MB file size limit
        const maxSizeInBytes = 5 * 1024 * 1024

        if (dataToValidate[key].size > maxSizeInBytes) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg =
            "File size should not be greater than 5MB"
        }
      }

      if (validationType === VALIDATION_TYPE.dateRangeStart) {
        // Sets timestamp
        dateRange.start = new Date(dataToValidate[key]).getTime()
      }

      if (validationType === VALIDATION_TYPE.dateRangeEnd) {
        // Sets timestamp
        dateRange.end = new Date(dataToValidate[key]).getTime()
      }

      // Input to match - 1
      if (validationType === VALIDATION_TYPE.matchOne) {
        inputMatch.one = dataToValidate[key]
        inputMatch.fieldOneName = key
      }

      // Input to match - 2
      if (validationType === VALIDATION_TYPE.matchTwo) {
        inputMatch.two = dataToValidate[key]
        inputMatch.fieldTwoName = key
      }

      if (dateRange.start && dateRange.end) {
        if (dateRange.start > dateRange.end) {
          validationStateCopy[key].valid = false
          validationStateCopy[key].errMsg =
            "End date should not come before Start date"
        }

        dateRange.start = ""
        dateRange.end = ""
      }

      if (inputMatch.one && inputMatch.two) {
        if (inputMatch.one !== inputMatch.two) {
          validationStateCopy[key].valid = false
          validationStateCopy[
            key
          ].errMsg = `${inputMatch.fieldOneName} and ${inputMatch.fieldTwoName} do no match`
        }

        inputMatch = {}
      }
    }
  }
  const keysToRemove = [
    // "billFilePath",
    "maxAdmissibleAmount",
    "former",
    "telephoneNumbers",
  ]
  const filteredFieldKeys = fieldKeys.filter(
    (key) => !keysToRemove.includes(key)
  )

  const allValidationsPass = filteredFieldKeys.every(
    (key) => validationStateCopy[key].valid
  )
  // const allValidationsPass = fieldKeys.every((key) => {
  //   if (key !== "billFilePath" && key !== "maxAdmissibleAmount") {
  //     return validationStateCopy[key].valid
  //   }
  // })
  // console.log(validationStateCopy, "validationStateCopy")
  return {
    allValidationsPass,
    updatedValidationState: validationStateCopy,
  }
}

const exportDataToExcel = (data, fileName) => {
  const currentDate = dayjs(Date.now()).format("DD-MM-YYYY")
  fileName = `${fileName}_${currentDate}`

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  saveAs(
    new Blob([excelBuffer], { type: "application/octet-stream" }),
    fileName + ".xlsx"
  )
}

const exportDataToPDF = (data, fileName) => {
  // const currentDate = dayjs(Date.now()).format("DD-MM-YYYY")
  // fileName = `${fileName}_${currentDate}`

  const doc = new jsPDF({
    orientation: "landscape",
  })
  // Define header function
  const header = function (data) {
    doc.setFontSize(18)
    doc.setTextColor(40)
    doc.setFontStyle("normal")
    // Main title
    doc.text("Main Header", data.settings.margin.left, 15)
    // Subtitle
    doc.setFontSize(14)
    doc.text(fileName, data.settings.margin.left, 25)
  }

  // Define footer function
  const footer = function (data) {
    const pageCount = doc.internal.getNumberOfPages()
    // Page number
    doc.text(
      "Page " + data.pageNumber,
      data.settings.margin.left,
      doc.internal.pageSize.height - 10
    )
    // System IP and datetime
    doc.text(
      `   Date: ${dayjs(Date.now()).format("DD-MM-YYYY h:mm A")}`,
      100,
      doc.internal.pageSize.height - 10
    )
  }

  // Assign header and footer functions to autoTable options
  const options = {
    beforePageContent: header,
    afterPageContent: footer,
  }

  // Convert data to PDF format
  const tableData = data.map((obj) => Object.values(obj))
  const headers = Object.keys(data[0])

  // Add table to PDF using autoTable
  doc.autoTable({
    head: [headers],
    body: tableData,
    margin: { top: 60 }, // Adjust margin to make space for header
    startY: 20, // Start table below the custom header
    beforePageContent: function (data) {
      const textWidth = doc.getTextWidth(fileName) // Get the width of the text
      const textX = (doc.internal.pageSize.getWidth() - textWidth) / 2 // Calculate the X coordinate to center the text horizontally
      const textY = 15 // Y coordinate for the header text
      doc.setFontSize(18)
      doc.setTextColor(40)
      doc.setFont("helvetica", "normal") // Set font and style
      doc.text(fileName, textX, textY) // Render header text
    },
    afterPageContent: footer, // Render footer
  })

  // Save PDF file
  doc.save(fileName + ".pdf")
}

// Function to get current datetime
function getCurrentDateTime() {
  const now = new Date()
  return now.toLocaleString()
}

export { exportDataToExcel, exportDataToPDF, validateOnSubmit }
