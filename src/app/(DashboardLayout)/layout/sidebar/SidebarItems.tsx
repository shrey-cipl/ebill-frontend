import React, { useState } from "react"
import Menuitems from "./MenuItems"
import { usePathname } from "next/navigation"
import { Box, List } from "@mui/material"
import NavItem from "./NavItem"
import NavGroup from "./NavGroup/NavGroup"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname()
  const pathDirect = pathname

  const auth: any = useAuth()
 
  // const [state ,setstate] =useState(auth?.user?.role?.name);
  const [allData, setItems] = useState<any>(
    Menuitems["Joint Secretary Admin"]
  )

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
