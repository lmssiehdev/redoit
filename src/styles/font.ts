import localFont from "next/font/local";

export const virgilFont = localFont({
  src: "../../public/fonts/Virgil.woff2",
  display: "swap",
  variable: "--font-handrawn",
});

export const walsheimFont = localFont({
  src: "../../public/fonts/GT-Walsheim-Ultra-Bold.ttf",
  display: "swap",
  variable: "--font-walsheim",
});
