import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gas Price Bot Page",
  description: "Get more specifics about the gas prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header>
          <h1>
            Gas Price Bot Info
          </h1>
        </header>
        <nav>
          <ul>
            <li>
              <a href="/">
               Home
              </a>
            </li>
            <li>
              <a href="/historical-data">
                Historical Data
              </a>
            </li>
          </ul>
        </nav>
        <main>
            {children}
        </main>
      </body>
    </html>
  );
}
