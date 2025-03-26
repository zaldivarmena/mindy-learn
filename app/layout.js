import localFont from "next/font/local";
import "./globals.css";
import { Inter} from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";
export const metadata = {
  title: "Mindy - The learning companion",
  description: "Mindy is a learning companion that helps you learn better",
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <Provider>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
