import StoreProvider from "@/store/StoreProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "DTF Sticker Shop",
  description: "Custom DTF stickers, made to order."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
