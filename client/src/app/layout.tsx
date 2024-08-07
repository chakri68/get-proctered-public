import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NotifProvider } from "@/providers/NotifProvider/NotifProvider";
import "./globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Get Proctered - Proctoring made easy!",
  description:
    "Get Proctered is a proctoring service that makes proctoring easy for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={inter.className}>
        <NotifProvider>{children}</NotifProvider>
      </body>
    </html>
  );
}
