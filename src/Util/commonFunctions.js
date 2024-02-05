import { VALIDATION_TYPE } from "@/config/constants"

// Checks if the data passes the regular expression
const regExCheck = (data, regExpression) => {
  return regExpression.test(data)
}

// Checks if all the field inputs are valid and returns an updated validation state
const validateOnSubmit = (dataToValidate, validationState) => {
  // Creates a deep copy
  const validationStateCopy = JSON.parse(JSON.stringify(validationState))

  // Collects field ids used by both dataToValidate & validationState
  const fieldKeys = Object.keys(dataToValidate)

  // Date range data
  const dateRange = {
    start: "",
    end: "",
  }

  for (let key of fieldKeys) {
    // De-structures validation type for that key
    const { validationType } = validationState[key]

    //  Assumes valid data initially
    if (dataToValidate[key]) {
      validationStateCopy[key].valid = true
      validationStateCopy[key].errMsg = ""
    }

    if (validationType === VALIDATION_TYPE.amount) {
      // Checks if number is greater than 0 (includes decimals)
      const validAmount = regExCheck(dataToValidate[key], /^[1-9]\d*(\.\d+)?$/)

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
        validationStateCopy[key].errMsg = "Mobile number should be 10-digits"
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

    if (dateRange.start && dateRange.end) {
      if (dateRange.start > dateRange.end) {
        validationStateCopy[key].valid = false
        validationStateCopy[key].errMsg =
          "End date should not come before Start date"
      }

      dateRange.start = ""
      dateRange.end = ""
    }
  }

  const allValidationsPass = fieldKeys.every(
    (key) => validationStateCopy[key].valid
  )

  return {
    allValidationsPass,
    updatedValidationState: validationStateCopy,
  }
}

export { validateOnSubmit }
