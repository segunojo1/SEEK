import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Seek Auth",
  description: "Authentication",
};
export default function AuthLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  )
}