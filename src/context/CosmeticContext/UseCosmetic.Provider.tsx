import { createContext, useContext, useMemo ,useState } from "react";
import axios from "../../config/axios";
import { useAuth } from "../JWTContext/AuthContext.provider";

const initialCosmeticData = {
  // Define your initial cosmetic-related functions here 
  modalLoading: false, // Initial value for modal loading
  setModalLoading: (loading: boolean) => {},
};

export const CosmeticContext = createContext(initialCosmeticData);

interface CosmeticContextProviderProps {
  children: React.ReactNode;
}

export const useCosmetic = () => useContext(CosmeticContext);

function CosmeticContextProvider({ children }: CosmeticContextProviderProps) {
  const auth = useAuth();
  const [modalLoading, setModalLoading] = useState(false);
  // Define your cosmetic-related functions here

  const globalCosmeticContextValue = useMemo(
    () => ({
      // Add your cosmetic-related functions here
      modalLoading,
      setModalLoading,
    } as any),
    [modalLoading]
  );

  return (
    <CosmeticContext.Provider value={globalCosmeticContextValue}>
      {children}
    </CosmeticContext.Provider>
  );
}

export default CosmeticContextProvider;
