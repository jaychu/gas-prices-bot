import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import NavLink from "../components/nav/nav-link";
import "./globals.css";
import 'material-symbols/outlined.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
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
      className={`${manrope.className} ${inter.className} h-full antialiased`}
    >
      <body>
        <main>
          <header>
            <span className="material-symbols-outlined home-logo">
              local_gas_station
            </span>
            <h1>
              Gas Price Bot Info
            </h1>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
