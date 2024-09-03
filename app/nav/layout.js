import Script from "next/script";

export const metadata = {
  title: "More Than Chat API Test",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const layoutCSS = {
    backgroundColor: "#F5F5F5",
    margin: 0,
    height: "98vh",
  };

  return (
    <html lang="en">
      <body style={layoutCSS}>
        <Script src="/library/p5llm.js" strategy="beforeInteractive"></Script>
        {children}
      </body>
    </html>
  );
}
