import './globals.css';
import { Toaster } from '@/components/ui/toaster';
export const metadata = {
    title: 'Virtual Health Assistant',
    description: 'An online symptom checker and health guide.',
    manifest: '/manifest.json',
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>);
}
