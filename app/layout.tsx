import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Quiet Parts with Oga Peter | Podcast",
  description:
    "The Quiet Parts is a weekly podcast hosted by Oga Peter. Honest conversations on pop culture, careers, money, love and family. New episodes every Wednesday.",
  keywords: ["The Quiet Parts", "Oga Peter", "podcast", "Nigerian podcast", "pop culture", "money", "careers"],
  authors: [{ name: "Oga Peter" }],
  openGraph: {
    title: "The Quiet Parts with Oga Peter",
    description: "Honest conversations on pop culture, careers, money, love and family. New episodes every Wednesday.",
    siteName: "The Quiet Parts",
    type: "website",
    images: [{ url: "/host.png", alt: "Oga Peter, host of The Quiet Parts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Quiet Parts with Oga Peter",
    description: "Honest conversations on pop culture, careers, money, love and family.",
    images: ["/host.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full ">
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}