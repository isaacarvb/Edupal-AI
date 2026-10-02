import "./globals.css";
import Providers from "@/components/Providers";
import Shell from "@/components/Shell";
import { Suspense } from "react";

export const metadata = { title: "EduPal AI", description: "AI exam prep tutor for WAEC/JAMB" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Providers>
          <Suspense>
            <Shell>{children}</Shell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
