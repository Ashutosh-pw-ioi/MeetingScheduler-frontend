import "./globals.css";

export const metadata = {
  title: "Meeting Scheduler",
  description: "Student Interview Scheduler System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
