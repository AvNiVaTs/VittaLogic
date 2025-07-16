'use client'

import {
<<<<<<< HEAD
  ThemeProvider as NextThemesProvider,
=======
    ThemeProvider as NextThemesProvider,
>>>>>>> d5fd4873b3b25e02b440938e772d6e9611f3cee1
} from 'next-themes'
import * as React from 'react'

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
