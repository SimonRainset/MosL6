export const metadata = {
  title: "More Than Chat API Test",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const layoutCSS = {
    backgroundColor: "#F9FAFB",
    margin: 0,
    height: "98vh",
    padding: 0,
  };

  return (
    <html lang="en">
      <body style={layoutCSS}>{children}</body>
    </html>
  );
}
