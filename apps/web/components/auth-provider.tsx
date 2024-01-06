"use client"

import * as React from "react"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { ClerkProvider } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"

export function AuthProvider({ children, ...props }: ThemeProviderProps) {
    const { theme } = useTheme()

    return <ClerkProvider
        appearance={{
            ...(theme !== 'light' && {
                baseTheme: dark,
            }),
        }} {...props}>
        {children}
    </ClerkProvider>
}
