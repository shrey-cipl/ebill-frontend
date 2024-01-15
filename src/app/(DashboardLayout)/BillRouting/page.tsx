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

import PageContainer from "../components/container/PageContainer"
import DashboardNew from "../components/shared/DashboardNew"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"

import { enqueueSnackbar } from "notistack"

const billType = [
  "Domestic Help",
  "Medical Reimbursement",
  "F&Reimbursement for Defraying the Services of Orderly",
  "Resident Telephone/Mobile charges Reimbursement",
]

const dummyApiResponse = [
  "Asst. Section Officer Admin I",
  "Asst. Section Officer Admin IV",
  "Section Officer Admin I",
  "Section Officer Admin IV",
]

// To show list of available options within the select field
let sequenceOptions: any

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
        //   console.log(res)
        if (res && res.data) {
          setBillSequence(res.data[0])
          sequenceOptions = res.data[0]
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

    console.log("abcd:", billSequence.sequence)

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

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <PageContainer title="Bill Routing" description="Manage Former data here">
      <DashboardNew title="Bill Routing" titleVariant="h5">
        <form onSubmit={handleFormSubmit}>
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
          <div>
            {billSequence?.sequence?.map((sequenceItem: any, i: any) => {
              return (
                <>
                  <div>Role</div>
                  <Select
                    // name={former.id}
                    size="small"
                    value={sequenceItem}
                    //  onChange={(e: any) => setSelectedBillType(e?.target?.value)}
                    onChange={(e: any) => handleSequence(e, i)}
                    sx={{ width: "100%" }}
                  >
                    {sequenceOptions?.sequence?.map(
                      (item: any, innerIndex: any) => (
                        <MenuItem key={innerIndex} value={item}>
                          {item}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </>
              )
            })}
          </div>
          <button type="submit">Submit</button>
        </form>
      </DashboardNew>
    </PageContainer>
  )
}

export default BillRouting
