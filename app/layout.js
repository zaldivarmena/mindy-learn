import localFont from "next/font/local";
import "./globals.css";
import { Montserrat} from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";
export const metadata = {
  title: "Mindy - The learning companion",
  description: "Mindy is a learning companion that helps you learn better",
};
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "800"]
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={montserrat.className}
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
