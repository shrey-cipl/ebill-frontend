import { createContext, useContext, useMemo } from "react"
import axios from "../../config/axios"
import { useAuth } from "../JWTContext/AuthContext.provider"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const illegalStateFunction = async (..._args: any) => {
  throw new Error("You must wrap your components in <UserContextProvider />")
}

const initialData = {
  GetAllDetails: illegalStateFunction,
  Userlogin: illegalStateFunction,
  createFamilyHistory: illegalStateFunction,
  createWorkExperienceDetails: illegalStateFunction,
  saveAsDraft: illegalStateFunction,
  getBasicDetails: illegalStateFunction,
  getcandidateDetails: illegalStateFunction,
  getEducationDetails: illegalStateFunction,
  getWorkExperiences: illegalStateFunction,
  getFamilyHistory: illegalStateFunction,
}

// export type BasicDetails = {
//     candidate_fname: string;
//     candidate_mname: string;
//     candidate_lname: string;
//     candidate_father_fname: string;
//     candidate_father_mname: string;
//     candidate_father_lname: string;
//     candidate_mother_fname: string;
//     candidate_mother_mname: string;
//     candidate_mother_lname: string;
//     date_of_birth: string;
//     gender: string;
//     marital_status: string;
//     mother_tongue: string;
//     place_of_birth: string;
//     citizenship: string;
//     religion: string;
//     community: string;
//     creamy_layer: string;
//     community_cert_num: string;
//     community_cert_auth_desig: string;
//     community_cert_date: string;
//     income_asset_cert_date: string;
//     pwd_pwbd_cat: string;
//     bench_perc_above_forty: string;
//     ph_cat: string;
//     ph_cat_2: string;
//     ph_cat_3: string;
//     ph_cat_4: string;
//     ph_cat_5: string;
//     ph_cat_1: string;
//     disability_cert: string;
//     id_proof_type: string;
//     id_proof_num: string;
//     id_proof_file_path: string;
//     phone_num: string;
//     alt_phone_num: string;
//     email_id: string;
//     alt_email_id: string;
//     corresponding_addressFirst: string;
//     corresponding_addressSecond: string;
//     corresponding_addressThird: string;
//     corresponding_country: string;
//     corresponding_district: string;
//     corresponding_nationality: string;
//     corresponding_pinCode: number;
//     corresponding_state: string;
//     permanent_addressFirst: string;
//     permanent_addressSecond: string;
//     permanent_addressThird: string;
//     permanent_country: string;
//     permanent_district: string;
//     permanent_nationality: string;
//     permanent_pinCode: number;
//     permanent_state: string;
//     profile_pic: string;
// };

// export type EducationDetails = {
//     qualification: string;
//     school_college: string;
//     board_univ: string;
//     rollNumber: string;
//     result_type: string;
//     marks: string;
//     document: string;
// };

// export type FamilHistoryDetails = {
//     name: string;
//     relation: string;
//     gender: string;
//     date_of_birth: string;
//     nationality: string;
//     profession: string;
// };

export type credentials = {
  email: string
  password: string
}

export const UserContext = createContext(initialData)

interface UserContextProviderProps {
  children: React.ReactNode
}

export const useUser = () => useContext(UserContext)

function UserContextProvider({ children }: UserContextProviderProps) {
  const auth = useAuth()
  const GetAllDetails = () => {
    console.log("AA")
    const response = axios.get("/api/user/getAll")
    return response
  }

  const Userlogin = (credentials: credentials[]) => {
    console.log(credentials, "Abhiprops")
    const response = axios.post("/api/user/login", credentials)
    return response
  }

  const saveAsDraft = (Arr: any, form_name: string, token: string) => {
    console.log(Arr)
    axios
      .post("/api/candidate/saveAsDraft", Arr, {
        headers: {
          form_name,
          token,
        },
      })
      .then((response) => console.log(response))
    // console.log(response);
  }

  const getBasicDetails = async (id: any) => {
    console.log(id, "addddddd")
    const response = await axios.get(`/api/user/getAll`)
    return response
  }
  const getcandidateDetails = async (id: any) => {
    console.log(id, "addddddd")
    const response = await axios.get(`/api/candidate/getCandidate/${id}`)
    return response
  }

  const getEducationDetails = async (id: any) => {
    const response = await axios.get(`/api/education/getEducationByOTR/${id}`)
    return response
  }

  const getFamilyHistory = async (id: any) => {
    const response = await axios.get(`/api/family/getHistory/${id}`)
    return response
  }

  const getWorkExperiences = async (id: any) => {
    const response = await axios.get(`/api/work/getWork/${id}`)
    return response
  }

  const globalContextValue = useMemo(
    () =>
      ({
        GetAllDetails,
        Userlogin,
        saveAsDraft,
        getBasicDetails,
        getcandidateDetails,
        getEducationDetails,
        getFamilyHistory,
        getWorkExperiences,
      } as any),
    []
  )
  return (
    <UserContext.Provider value={globalContextValue}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
