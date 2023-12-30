import { useState, useEffect } from "react"

import Box from "@mui/material/Box"
import Fab from "@mui/material/Fab"

import axiosApi from "@/Util/axiosApi"
import { useAuth } from "@/context/JWTContext/AuthContext.provider"

const Pagination = ({ url, data, setPageNo }: any) => {
  const [paginationBtns, setPaginationBtns] = useState([])

  const authCtx: any = useAuth()

  useEffect(() => {
    const handlePagination = async () => {
      const config = {
        url: url,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authCtx.user.token}`,
        },
      }

      try {
        const res = await axiosApi(config.url, config.method, config.headers)

        const totalPages = Math.ceil(res.data.length / 10)

        const pageCountArr: any = []

        for (let i = 1; i <= totalPages; i++) {
          pageCountArr.push(i)
        }

        setPaginationBtns(pageCountArr)
      } catch (err) {
        console.log(err, "error from pagination component")
      }
    }

    handlePagination()
  }, [data])

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      {paginationBtns.map((btn) => (
        <Fab
          // variant="contained"
          size="small"
          sx={{
            background: "#4C7AFF",
            color: "#fff",
            fontSize: "12px",
            ":hover": { background: "#1954FF" },
          }}
          onClick={() => setPageNo(btn)}
        >
          {btn}
        </Fab>
      ))}
    </Box>
  )
}

export default Pagination
