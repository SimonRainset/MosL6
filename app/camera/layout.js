import Script from "next/script";

export const metadata = {
  title: "More Than Chat API Test",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const layoutCSS = {
    backgroundColor: "#FFFFFF",
    margin: 0,
    height: "98vh",
    padding: 0,
  };

  return (
    <html lang="en">
      <body style={layoutCSS}>
        {/* <Script src="/library/cos-js-sdk-v5.min.js" /> */}
        {children}
      </body>
    </html>
  );
}