import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/lib/provider";

export const metadata: Metadata = {
  title: "Телефоны",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-[100vh]">

          <Providers>
            <Header />

            <main className="main">
              {children}
              <Toaster/>
            </main>

            <Footer />
          </Providers>
      
        </div>
      </body>
    </html>
  );
}
