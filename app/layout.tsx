// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "Note Hub",
  description: "Notes demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <footer>
            <p>
              Created <time dateTime="2025">2025</time>
            </p>
          </footer>
        </TanStackProvider>
      </body>
    </html>
  );
}