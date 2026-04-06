import "./globals.css";

export const metadata = {
  title: "Inventory App",
  description: "Fullstack Inventory System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}