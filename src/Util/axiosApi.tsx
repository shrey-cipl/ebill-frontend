import axios, { AxiosRequestConfig } from "axios"
import { enqueueSnackbar } from "notistack"

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

async function axiosApi(
  url: string,
  method: string,
  headers: any,
  data?: any
): Promise<any> {
  const config: AxiosRequestConfig = {
    method: method,
    url: backendBaseUrl + url,
    headers: headers,
    data: data,
  }

  try {
    const response = await axios(config)

    if (String(response.status).charAt(0) === "2") {
      return response.data
    }
  } catch (error: any) {
    if (String(error.response.status).charAt(0) === "4") {
      // prevents 'enqueueSnackbar' error
      if (error.response.data.message) {
        enqueueSnackbar(error.response.data.message, {
          preventDuplicate: true,
          variant: "error",
        })
      }
    }
  }
}

export default axiosApi
