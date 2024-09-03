import "./globals.css";

export const metadata = {
  title: "More Than Chat",
  description: "Home Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
