import "./globals.css";

export const metadata = {
  title: "Student Resolve Hub",
  description: "Complaint management for students & staff"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body>
        {children}
      </body>
    </html>
  );
}
