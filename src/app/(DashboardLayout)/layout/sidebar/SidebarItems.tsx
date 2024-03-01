import React, { useContext, useEffect, useState } from "react"
import { Menuitems } from "./MenuItems"
import { usePathname } from "next/navigation"
import { Box, List } from "@mui/material"
import NavItem from "./NavItem"
import NavGroup from "./NavGroup/NavGroup"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import { uniqueId } from "lodash"
import AssessmentIcon from "@mui/icons-material/Assessment"
import {
  CosmeticContext,
  useCosmetic,
} from "@/context/CosmeticContext/UseCosmetic.Provider"

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const [billTypeSequence, SetbillTypeSequence] = useState<any>([])
  const pathname = usePathname()
  const pathDirect = pathname

  const auth: any = useAuth()
  const role: any = auth?.user?.data?.role?.name
  // const [state ,setstate] =useState(auth?.user?.role?.name);
  const [allData, setItems] = useState(
    role ? Menuitems[role] : Menuitems["former"]
  )
  const cosmeticContext = useContext(CosmeticContext)
  const { billType, setBillType, setUserbill } = cosmeticContext
  // setBillType(["pops"])

  const obj: any = {
    id: uniqueId(),
    title: "User Bills",
    icon: AssessmentIcon,
    href: "/UserBills",
    present: "yes",
  }

  const obj1: any = {
    id: uniqueId(),
    title: "Add Bills",
    icon: AssessmentIcon,
    href: "/Formers/AddBills",
    present: "yes",
  }

  useEffect(() => {
    getDataSideBar()
  }, [])

  console.log(billType, "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")

  const getDataSideBar = async () => {
    console.log("ds")
    const config = {
      url: `/api/billRouting/getall`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${auth.user?.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      // if (res && res.data) {
      //   setBillSequence(res.data[0])
      // }
      console.log(res.data, "jjjjjjokokokokokkok")
      setBillType([])
      setUserbill(false)

      console.log(
        auth?.user?.data?.role?.name,
        "===",
        res.data[1].sequence[0].officer,
        "===",
        res.data[1].sequence[0].linkOfficer
      )
      {
        ;(res.data[0].sequence[0].officer === auth?.user?.data?.role?.name ||
          res.data[0].sequence[0].linkOfficer ===
            auth?.user?.data?.role?.name) &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            setBillType((prev: any) => [...prev, res.data[0].billType])
            if (!titleExists) {
              menuItemsArray.push(obj, obj1)
            }
            setUserbill(true)
          })()
      }
      {
        ;(res.data[1].sequence[0].officer === auth?.user?.data?.role?.name ||
          res.data[1].sequence[0].linkOfficer ===
            auth?.user?.data?.role?.name) &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            setBillType((prev: any) => [...prev, res.data[1].billType])
            if (!titleExists) {
              menuItemsArray.push(obj, obj1)
            }
            setUserbill(true)
          })()
      }
      {
        ;(res.data[2].sequence[0].officer === auth?.user?.data?.role?.name ||
          res.data[2].sequence[0].linkOfficer ===
            auth?.user?.data?.role?.name) &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            setBillType((prev: any) => [...prev, res.data[2].billType])
            if (!titleExists) {
              menuItemsArray.push(obj, obj1)
            }
            setUserbill(true)
          })()
      }
      {
        ;(res.data[3].sequence[0].officer === auth?.user?.data?.role?.name ||
          res.data[3].sequence[0].linkOfficer ===
            auth?.user?.data?.role?.name) &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            setBillType((prev: any) => [...prev, res.data[3].billType])
            if (!titleExists) {
              menuItemsArray.push(obj, obj1)
            }
            setUserbill(true)
          })()
      }
      console.log(Menuitems[auth?.user?.data?.role?.name], "kkk")
    } catch (err: any) {
      console.log(err.message)
    }
  }
  // console.log(billTypeSequence, "billtype")
  console.log(billType, "sdcs")
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {allData?.map((item: any) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            )
          }
        })}
      </List>
    </Box>
  )
}
export default SidebarItems
