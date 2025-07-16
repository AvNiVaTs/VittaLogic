import './globals.css'

export const metadata = {
  title: 'VittaLogic',
  icons: {
    icon: '/favicon2.png', // or '/favicon.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
