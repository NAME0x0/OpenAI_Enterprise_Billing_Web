import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "./client-layout";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "OpenAI Enterprise Billing",
  description: "Enterprise billing management dashboard for OpenAI API usage",
  openGraph: {
    title: "OpenAI Enterprise Billing",
    description: "Monitor spending, usage, quotas, and sustainability metrics across your organization.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="noise-overlay">
        <a className="skip-to-content" href="#main-content">
          Skip to content
        </a>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
