import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

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
