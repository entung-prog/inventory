import "./globals.css";

export const metadata = {
  title: "Smart Inventory - Management System",
  description: "Modern fullstack inventory management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}