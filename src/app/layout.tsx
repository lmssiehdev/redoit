import { getSubscription } from "@/app/billing/page";
import { Content } from "@/app/page";
import { AuthProvider } from "@/context/AuthProvider";
import { virgilFont, walsheimFont } from "@/styles/font";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

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
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const sub = session && (await getSubscription(session?.user.id!));

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${virgilFont.variable} ${walsheimFont.variable}  font-handrawn max-w-screen-md w-full !mx-auto px-2 `}
      >
        <AuthProvider initialSession={session} initialSub={sub}>
          <main className=" mx-auto">
            <Content>{children}</Content>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
