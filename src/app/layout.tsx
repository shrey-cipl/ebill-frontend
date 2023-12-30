"use client"
import { baselightTheme } from "@/utils/theme/DefaultColors"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import AuthProvider from "../context/JWTContext/AuthContext.provider"
import UserContextProvider from "@/context/UserContext/UserContext.provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      <body>
        <AuthProvider>
          <UserContextProvider>
            <ThemeProvider theme={baselightTheme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </UserContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
