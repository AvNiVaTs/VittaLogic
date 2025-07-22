import './globals.css'

export const metadata = {
  title: 'VittaLogic',
  description: 'Created By Team Funcodes',
  icons: {
    icon: '/Picture1.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
