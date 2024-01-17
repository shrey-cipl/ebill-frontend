"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { styled } from "@mui/system"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import SouthIcon from "@mui/icons-material/South"
import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"

import { enqueueSnackbar } from "notistack"
import { InputLabel } from "@mui/material"

const billType = [
  "Domestic Help",
  "Medical Reimbursement",
  "F&Reimbursement for Defraying the Services of Orderly",
  "Resident Telephone/Mobile charges Reimbursement",
]

const selectOptions = [
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
  "System Admin", // remove this for only bill routing page
  "PAO",
  "Forwarded To Bank",
]

const BillRouting = () => {
  const [selectedBillType, setSelectedBillType] = useState("")
  const [billSequence, setBillSequence] = useState<any>([])

  const authCtx: any = useAuth()

  useEffect(() => {
    const getData = async () => {
      const config = {
        url: `/api/billRouting/getall?billType=${selectedBillType}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)

        if (res && res.data) {
          setBillSequence(res.data[0])
        }
      } catch (err: any) {
        console.log(err.message)
      }
    }

    if (selectedBillType) {
      getData()
    }
  }, [selectedBillType, authCtx?.user?.token])

  const handleSequence = (e: any, i: any) => {
    const billSequenceCopy = [...billSequence.sequence]

    billSequenceCopy[i] = e.target.value

    setBillSequence((prevState: any) => ({
      ...prevState,
      sequence: billSequenceCopy,
    }))
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    const config = {
      url: `/api/billRouting/update/${billSequence._id}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user.token}`,
      },
      data: {
        sequence: [...billSequence.sequence],
      },
    }

    try {
      const res = await axiosApi(
        config.url,
        config.method,
        config.headers,
        config.data
      )

      enqueueSnackbar(res.message, {
        preventDuplicate: true,
        variant: "success",
      })
    } catch (err) {
      console.log(err)
    }
  }

  function addItemAtIndex(array: any, item: any, index: any) {
    // Create a new array with the item inserted at the specified index
    const newArray = [...array.slice(0, index), item, ...array.slice(index)]

    setBillSequence((prevState: any) => ({ ...prevState, sequence: newArray }))
  }

  function removeItemAtIndex(array: any, index: any) {
    // Create a new array without the item at the specified index
    const newArray = [...array.slice(0, index), ...array.slice(index + 1)]
    setBillSequence((prevState: any) => ({ ...prevState, sequence: newArray }))
  }

  return (
    <PageContainer title="Bill Routing" description="Manage Former data here">
      <DashboardNew title="Bill Routing" titleVariant="h5">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "500px",
            }}
          >
            <form>
              <InputLabel>Bill Type</InputLabel>
              <Select
                // name={former.id}
                size="small"
                value={selectedBillType}
                onChange={(e: any) => setSelectedBillType(e?.target?.value)}
                sx={{ width: "100%" }}
              >
                {billType?.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              <Box
                sx={{
                  width: "90%",
                  mt: 3,
                }}
              >
                {billSequence?.sequence?.map(
                  (sequenceItem: any, i: any, array: any) => {
                    //   console.log("bankai:", array)
                    return (
                      <Box key={i}>
                        <div>Role</div>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                          }}
                        >
                          <Select
                            // name={former.id}
                            size="small"
                            value={sequenceItem}
                            //  onChange={(e: any) => setSelectedBillType(e?.target?.value)}
                            onChange={(e: any) => handleSequence(e, i)}
                            sx={{ width: "100%" }}
                          >
                            {selectOptions?.map((item: any, i: any) => (
                              <MenuItem key={i} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>

                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              height: "30px",
                            }}
                            onClick={() => {
                              addItemAtIndex(array, "", i + 1)
                            }}
                          >
                            <AddIcon /> Add
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "red",
                              height: "30px",
                              px: 3,
                            }}
                            onClick={() => {
                              removeItemAtIndex(array, i)
                            }}
                          >
                            <CloseIcon /> Remove
                          </Button>
                        </Box>
                      </Box>
                    )
                  }
                )}
              </Box>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box>
                  {billSequence?.sequence?.length > 0 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        height: "30px",
                        px: 3,
                      }}
                      onClick={handleFormSubmit}
                    >
                      Submit
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </DashboardNew>
    </PageContainer>
  )
}

export default BillRouting
