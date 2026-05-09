import { Jost, Poppins } from "next/font/google";
import "./globals.css";

// Setup Jost Font
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  // Jost variable font hai, isliye isme direct weights ki zaroorat nahi hoti
});

// Setup Poppins Font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Regular se leke Bold tak
});

export const metadata = {
  title: "Asset Management Panel",
  description: "Enterprise Asset Lifecycle Management",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // Dono fonts ke variables ko HTML mein inject kar diya
      className={`${poppins.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
