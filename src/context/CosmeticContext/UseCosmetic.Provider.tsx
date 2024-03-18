import { createContext, useContext, useMemo, useState } from "react"
import axios from "../../config/axios"
import { useAuth } from "../JWTContext/AuthContext.provider"

const initialCosmeticData = {
  // Define your initial cosmetic-related functions here
  modalLoading: false, // Initial value for modal loading
  setModalLoading: (loading: boolean) => {},
  userbill: false,
  setUserbill: (pre: boolean) => {},
  billType: [],
  setBillType: (prev: any) => {},
  authenticatedRoute: [],
  setAuthenticatedRoute: (prev: any) => {},
}

export const CosmeticContext = createContext(initialCosmeticData)

interface CosmeticContextProviderProps {
  children: React.ReactNode
}

export const useCosmetic = () => useContext(CosmeticContext)

function CosmeticContextProvider({ children }: CosmeticContextProviderProps) {
  const auth = useAuth()
  const [modalLoading, setModalLoading] = useState(false)
  const [userbill, setUserbill] = useState(false)
  const [billType, setBillType] = useState<any>([])
  const [authenticatedRoute, setAuthenticatedRoute] = useState<any>([])
  // Define your cosmetic-related functions here
  // console.log(billType)
  const globalCosmeticContextValue = useMemo(
    () =>
      ({
        // Add your cosmetic-related functions here
        modalLoading,
        setModalLoading,
        setBillType,
        billType,
        setUserbill,
        userbill,
        authenticatedRoute,
        setAuthenticatedRoute,
      } as any),
    [modalLoading, billType, userbill, authenticatedRoute]
  )

  return (
    <CosmeticContext.Provider value={globalCosmeticContextValue}>
      {children}
    </CosmeticContext.Provider>
  )
}

export default CosmeticContextProvider
