import "./globals.css";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";

export const metadata = { title: "EduPal AI", description: "AI exam prep tutor for WAEC/JAMB" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
