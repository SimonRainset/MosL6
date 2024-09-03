export const metadata = {
  title: "More Than Chat Container",
  description: "Hey",
};

export default function RootLayout({ children }) {
  const editorLayoutCSS = {
    width: "100vw",
    height: "100vh",
  };

  return (
    <html lang="en">
      <body style={editorLayoutCSS}>{children}</body>
    </html>
  );
}
