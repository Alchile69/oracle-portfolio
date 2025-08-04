import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        /* Forcer le design sombre partout */
        * {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%) !important;
          color: #ffffff !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          min-height: 100vh !important;
        }
        
        /* Override tous les styles Tailwind clairs */
        .bg-white { background-color: #1a1a2e !important; }
        .bg-gray-50 { background-color: #0f0f23 !important; }
        .bg-slate-50 { background-color: #0f0f23 !important; }
        .bg-slate-100 { background-color: #1a1a2e !important; }
        
        .text-black { color: #ffffff !important; }
        .text-slate-900 { color: #ffffff !important; }
        .text-slate-600 { color: #4a4a5e !important; }
        
        .border-slate-200 { border-color: #2a2a3e !important; }
        .border-gray-300 { border-color: #2a2a3e !important; }
        
        /* Styles pour les cartes */
        .shadow-sm { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important; }
        
        /* Styles pour les boutons */
        .bg-blue-600 { background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%) !important; }
        .hover\\:bg-blue-700:hover { background: linear-gradient(135deg, #0099cc 0%, #006699 100%) !important; }
        
        /* Styles pour les selects */
        select {
          background-color: #1a1a2e !important;
          border-color: #2a2a3e !important;
          color: #ffffff !important;
        }
        
        select option {
          background-color: #1a1a2e !important;
          color: #ffffff !important;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
} 