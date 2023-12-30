import axios, { AxiosRequestConfig } from "axios"
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
    return response.data
  } catch (erro: any) {
    throw new Error("An error occurred during the API call: ")
  }
}

export default axiosApi
