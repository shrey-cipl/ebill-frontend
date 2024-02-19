import React, { useEffect, useState } from "react"
import { Menuitems } from "./MenuItems"
import { usePathname } from "next/navigation"
import { Box, List } from "@mui/material"
import NavItem from "./NavItem"
import NavGroup from "./NavGroup/NavGroup"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"
import axiosApi from "@/Util/axiosApi"
import { uniqueId } from "lodash"
import AssessmentIcon from "@mui/icons-material/Assessment"
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

  const obj: any = {
    id: uniqueId(),
    title: "User Bills",
    icon: AssessmentIcon,
    href: "/UserBills",
    present: "yes",
  }

  useEffect(() => {
    getDataSideBar()
  }, [role])

  const getDataSideBar = async () => {
    const config = {
      url: `/api/billRouting/getall`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${auth.user.token}`,
      },
    }

    try {
      const res = await axiosApi(config.url, config.method, config.headers)

      // if (res && res.data) {
      //   setBillSequence(res.data[0])
      // }
      console.log(res.data, "jjjjjjokokokokokkok")
      {
        res.data[0].sequence[0] === auth?.user?.data?.role?.name &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            if (!titleExists) {
              menuItemsArray.push(obj)
            }
          })()
        // SetbillTypeSequence([res.data[0].billType])
      }
      {
        res.data[1].sequence[0] === auth?.user?.data?.role?.name &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            if (!titleExists) {
              menuItemsArray.push(obj)
            }
          })()
        // SetbillTypeSequence([res.data[0].billType])
      }
      {
        res.data[2].sequence[0] === auth?.user?.data?.role?.name &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            if (!titleExists) {
              menuItemsArray.push(obj)
            }
          })()
        // SetbillTypeSequence([res.data[0].billType])
      }
      {
        res.data[3].sequence[0] === auth?.user?.data?.role?.name &&
          (() => {
            const menuItemsArray = Menuitems[auth?.user?.data?.role?.name]
            const titleExists = menuItemsArray.some(
              (item: any) => item.title === obj.title
            )
            if (!titleExists) {
              menuItemsArray.push(obj)
            }
          })()
        SetbillTypeSequence([res.data[0].billType])
      }
      // console.log(Menuitems, "Menuitems")
      console.log(Menuitems[auth?.user?.data?.role?.name], "kkk")
    } catch (err: any) {
      console.log(err.message)
    }
  }
  // console.log(billTypeSequence, "billtype")
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
