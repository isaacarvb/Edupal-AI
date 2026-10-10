import "./globals.css";
import Providers from "@/components/Providers";
import Shell from "@/components/Shell";
import LiteMode from "@/components/LiteMode";
import ThemeMode from "@/components/ThemeMode";
import InstallPWA from "@/components/InstallPWA";
import { Suspense } from "react";

export const metadata = {
  title: "EduPal AI",
  description: "AI exam prep tutor for WAEC/JAMB",
  manifest: "/manifest.webmanifest",
  themeColor: "#0F766E",
  appleWebApp: { capable: true, title: "EduPal AI", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-180.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Providers>
          <LiteMode />
          <ThemeMode />
          <InstallPWA />
          <Suspense>
            <Shell>{children}</Shell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
