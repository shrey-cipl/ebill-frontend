"use client";
import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material";

import PageContainer from "../../components/container/PageContainer";
import DashboardNew from "../../components/shared/DashboardNew";
import { useAuth } from "@/context/JWTContext/AuthContext.provider";
import axiosApi from "@/Util/axiosApi";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import Tooltip from "@mui/material/Tooltip";

import { FIELDS_FORMERS_ADD_BILL } from "@/config/formFields";
import { validateOnSubmit } from "@/Util/commonFunctions";

const initialFieldState: any = {};
const initialValidationState: any = {};
// Creates an initial state object (uses 'id')
for (let arrEl of FIELDS_FORMERS_ADD_BILL) {
  if (!initialFieldState[arrEl.id]) initialFieldState[arrEl.id] = "";

  // Setup collective validation state
  initialValidationState[arrEl.id] = {
    validationType: arrEl.validationType,
    valid: false,
    errMsg: "",
  };
}

const FormerAddBill = () => {
  const [formerFieldState, setFormerFieldState] = useState(initialFieldState);
  const [validations, setValidations] = useState(initialValidationState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const authCtx: any = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { allValidationsPass, updatedValidationState } = validateOnSubmit(
      formerFieldState,
      validations
    );

    setValidations(updatedValidationState);

    if (!allValidationsPass) {
      return;
    }

    const formDataToSend = new FormData();

    const fieldKeysArr = Object.keys(formerFieldState);

    fieldKeysArr.forEach((key) =>
      formDataToSend.append(key, formerFieldState[key])
    );

    try {
      const config = {
        url: `/api/bill/create`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${authCtx.user?.token}`,
        },
        data: formDataToSend,
      };

      const res: any = await axiosApi(
        config.url,
        config.method,
        config.headers,
        config.data
      );

      if (res) {
        enqueueSnackbar(res.message, {
          preventDuplicate: true,
          variant: "success",
        });

        router.push("/Formers/ViewBill");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   console.log(formerFieldState)
  //   const { allValidationsPass, updatedValidationState } = validateOnSubmit(
  //     formerFieldState,
  //     validations
  //   )

  //   setValidations(updatedValidationState)
  // }, [formerFieldState])

  const handleFieldChange = (e: any) => {
    const { name, value, type, files } = e.target;

    setFormerFieldState((prevState: any) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));

    if (type === "file") setPreviewUrl(URL.createObjectURL(files[0]));
  };

  function getCurrentDate() {
    const today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    return yyyy + "-" + mm + "-" + dd;
  }
  return (
    <PageContainer title="Add Bills" description="Manage Former data here">
      <DashboardNew title="Add Bills" titleVariant="h5">
        <>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {FIELDS_FORMERS_ADD_BILL.map((field, i) => {
                return (
                  <FormControl key={i}>
                    <Typography
                      fontWeight={600}
                      component="label"
                      sx={{
                        display: "block",
                        fontSize: "13px",
                        lineHeight: "12px",
                      }}
                      mb={1}
                    >
                      {field.fieldName}
                    </Typography>
                    <Tooltip
                      title={
                        field.type === "date"
                          ? "Select a date"
                          : field.placeholder
                      }
                      placement="top-start"
                    >
                      {field.type === "select" ? (
                        <Select
                          name={field.id}
                          size="small"
                          value={formerFieldState[field.id]}
                          onChange={(e) => handleFieldChange(e)}
                          sx={{ width: "100%" }}
                          required
                          error={
                            !validations[field.id].valid &&
                            validations[field.id].errMsg
                          }
                        >
                          {field.selectOptions?.map((option, i) => (
                            <MenuItem value={option} key={i}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : field.type === "file" ? (
                        <TextField
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          size="small"
                          onChange={(e) => handleFieldChange(e)}
                          error={
                            !validations[field.id].valid &&
                            validations[field.id].errMsg
                          }
                          sx={{ width: "100%" }}
                          required
                        />
                      ) : field.type === "date" ? (
                        <TextField
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          size="small"
                          value={formerFieldState[field.id]}
                          error={
                            !validations[field.id].valid &&
                            validations[field.id].errMsg
                          }
                          // id="outlined-error"
                          onChange={(e) => handleFieldChange(e)}
                          sx={{ width: "100%" }}
                          required={field.required}
                          InputProps={{
                            inputProps: {
                              max: getCurrentDate(),
                            },
                          }}
                        />
                      ) : (
                        <TextField
                          name={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          size="small"
                          value={formerFieldState[field.id]}
                          error={
                            !validations[field.id].valid &&
                            validations[field.id].errMsg
                          }
                          // id="outlined-error"
                          onChange={(e) => handleFieldChange(e)}
                          sx={{ width: "100%" }}
                          required={field.required}
                        />
                      )}
                    </Tooltip>

                    {/* Validation Message */}
                    {!validations[field.id].valid &&
                    validations[field.id].errMsg ? (
                      <span style={{ color: "red", fontSize: "13px" }}>
                        {validations[field.id].errMsg}
                      </span>
                    ) : null}
                  </FormControl>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}
            >
              <Button type="submit" size="small" variant="contained">
                Submit
              </Button>
            </div>{" "}
          </form>

          {previewUrl && (
            <Box
              sx={{
                ml: 6,
              }}
            >
              <h2>Preview:</h2>
              {formerFieldState.billFilePath.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="File Preview"
                  style={{ maxWidth: "100%", maxHeight: "600px" }}
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  width="100%"
                  height="600px"
                />
              )}
            </Box>
          )}
        </>
      </DashboardNew>
    </PageContainer>
  );
};

export default FormerAddBill;
