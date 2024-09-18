import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const alata = Jost({ subsets: ["latin"] });
import Providers from "./providers";

export const metadata: Metadata = {
  title: "LearnHub | Learn Anything, Anytime, Anywhere",
  description: "An e-Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={alata.className}>
          {children} <Toaster richColors closeButton position="top-center" />
        </body>
      </Providers>
    </html>
  );
}
