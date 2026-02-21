import "./globals.css";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { LanguageProvider } from "@/lib/language";

export const metadata = {
  title: "Stock Guardian AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">
        <LanguageProvider>
          <ParticleBackground />
          
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <Navbar />
          <main className="relative z-10 mx-auto max-w-6xl px-6 py-8">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
