import localFont from 'next/font/local'

export const montserrat = localFont({
  src: [
    { path: '../public/fonts/Montserrat/Montserrat-VariableFont_wght.ttf', style: 'normal', weight: '100 900' },
    { path: '../public/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf', style: 'italic', weight: '100 900' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
})
