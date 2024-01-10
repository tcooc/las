import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LAS",
  description: "Lost Ark Build Helper",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
