import { Navbar } from "@/components/supabase/Navbar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { UserNav } from "@/components/Navbar";

const virgilFont = localFont({
  src: "../../public/fonts/Virgil.woff2",
  display: "swap",
  variable: "--font-handrawn",
});

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookiesStore,
  });
  console.log("layout loaded");
  // const { data: session } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={`${virgilFont.variable} font-handrawn`}>
        <AuthProvider>
          <div className="flex justify-between py-10 container mx-auto">
            <h1 className="font-bold">Redoit</h1>
            <UserNav />
          </div>
          <div>
            <Navbar />
          </div>
          <main className="container mx-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
