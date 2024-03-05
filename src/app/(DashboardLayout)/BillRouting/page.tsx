"use client"

import { useEffect, useState } from "react"

import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"

import { enqueueSnackbar } from "notistack"
import { InputLabel } from "@mui/material"

import { BILL_TYPE, ROLES } from "@/config/constants"

const BillRouting = () => {
  const [selectedBillType, setSelectedBillType] = useState("")
  const [billSequence, setBillSequence] = useState<any>([])

  const authCtx: any = useAuth()

  useEffect(() => {
    const getData = async () => {
      const config = {
        url: `/api/billRouting/getall?billType=${encodeURIComponent(
          selectedBillType
        )}&latest=true`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user?.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)

        if (res && res.data) {
          console.log(res.data[0].sequence)
          setBillSequence(res.data[0].sequence)
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
    console.log(e, "sdsd")
    // const billSequenceCopy = [...billSequence.sequence]
    let updated = [...billSequence]
    const val = e.target.value
    const name = e.target.name
    console.log(name.charAt(0))
    if (name.includes("officer")) {
      updated[name.charAt(0)].officer = val
      setBillSequence(updated)
    } else {
      updated[name.charAt(0)].linkOfficer = val
      setBillSequence(updated)
    }

    // Update the billSequence array at the specified index
    // console.log(key, "key ")
    // setBillSequence((prevState: any) => {
    //   const updatedSequence = [...prevState]
    //   updatedSequence[i][key] = val
    //   return updatedSequence
    // })
    // console.log(val, name, "scfswcewscfwercfwercfdewfcwe")

    // setBillSequence((prevState: any) => ({
    //   ...prevState,
    //   sequence: billSequenceCopy,
    // }))
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    const config = {
      url: `/api/billRouting/create`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authCtx.user?.token}`,
      },
      data: {
        billType: selectedBillType,
        sequence: [...billSequence],
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
    // Create a new array with the item inserted at the specified

    const newArray = [...array.slice(0, index), item, ...array.slice(index)]

    setBillSequence(newArray)
  }

  function removeItemAtIndex(array: any, index: any) {
    // Create a new array without the item at the specified index
    const newArray = [...array.slice(0, index), ...array.slice(index + 1)]
    setBillSequence(newArray)
  }
  console.log(billSequence, "jhwedhkbas")
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
              width: "1000px",
            }}
          >
            <form>
              <InputLabel>Bill Type</InputLabel>
              <Select
                // name={former.id}
                size="small"
                value={selectedBillType}
                onChange={(e: any) => setSelectedBillType(e?.target?.value)}
                sx={{ width: "90%" }}
              >
                {BILL_TYPE?.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              <Box
                sx={{
                  // display: "flex",
                  width: "90%",
                  mt: 3,
                }}
              >
                {billSequence.length != 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      width: "440px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Officer</div>
                    <div>LinkOfficer</div>
                  </Box>
                )}

                {billSequence?.map((sequenceItem: any, i: any, array: any) => {
                  // console.log("bankai:", sequenceItem)
                  return (
                    <>
                      <Box
                        key={i}
                        sx={{
                          my: 2,
                        }}
                      ></Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "20px",
                          alignItems: "center",
                        }}
                      >
                        <Select
                          key={i}
                          name={i + "officer"}
                          size="small"
                          value={sequenceItem.officer}
                          //  onChange={(e: any) => setSelectedBillType(e?.target?.value)}
                          onChange={(e: any) => handleSequence(e, i)}
                          sx={{ width: "100%" }}
                        >
                          {ROLES?.map((item: any, i: any) => (
                            <MenuItem key={i} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>

                        <Select
                          key={i}
                          name={i + "link"}
                          size="small"
                          value={sequenceItem.linkOfficer}
                          //  onChange={(e: any) => setSelectedBillType(e?.target?.value)}
                          onChange={(e: any) => handleSequence(e, i)}
                          sx={{ width: "100%" }}
                        >
                          {ROLES?.map((item: any, i: any) => (
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
                            addItemAtIndex(
                              array,
                              { officer: "", linkOfficer: "" },
                              i + 1
                            )
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
                            "&:hover": {
                              backgroundColor: "#e68282", // Change the color on hover
                            },
                          }}
                          onClick={() => {
                            removeItemAtIndex(array, i)
                          }}
                        >
                          <CloseIcon /> Remove
                        </Button>
                      </Box>
                    </>
                  )
                })}
              </Box>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box>
                  {billSequence.length != 0 && (
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
                  )}
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
