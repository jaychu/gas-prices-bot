import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
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

        <nav>
          <span className="material-symbols-outlined home-logo">
            local_gas_station
          </span>
          <ul>
            <li>
              <a href="/">
                <span className="material-symbols-outlined">
                  online_prediction
                </span>
                <span className="nav-title">
                  Gas Forecast
                </span>
              </a>
            </li>
            <li>
              <a href="/historical-data">
                <span className="material-symbols-outlined">
                  finance_mode
                </span>
                <span className="nav-title">
                  Historical Data
                </span>
              </a>
            </li>
          </ul>
        </nav>
        <main>
          <header>
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
