import '../styles/globals.css';

export const metadata = {
  title: '智慧养老系统',
  description: '综合智慧养老管理平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  )
}