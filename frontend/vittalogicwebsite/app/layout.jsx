import './globals.css'

export const metadata = {
  title: 'VittaLogic',
  description: 'Created By Team Funcodes'
  //generator: 'v0.dev',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
