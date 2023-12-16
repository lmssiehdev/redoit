"use client";
import { UserNav } from "@/components/Navbar";
import { AuthProvider, useUser } from "@/context/AuthProvider";
import { DateProvider } from "@/context/DateProvider";
import { HabitsProvider } from "@/context/HabitsProvider";
import { ReplicacheProvider } from "@/context/ReplicacheProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { cn } from "@/utils/misc";
import { buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${virgilFont.variable} font-handrawn max-w-screen-md w-full !mx-auto px-2`}
      >
        <AuthProvider>
          <div className="flex justify-between py-7  mx-auto">
            <Link href="/">Redoit</Link>
            <UserNav />
          </div>
          <main className=" mx-auto">
            <Content>{children}</Content>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { session } = useUser();

  return (
    <div>
      {session?.user?.id != null ? (
        <>
          {children}
          <Toaster />
        </>
      ) : (
        <Link
          href="/auth/signin"
          className={cn(buttonVariants({ variant: "link" }), "text-lg")}
        >
          Login
        </Link>
      )}
    </div>
  );
}
