"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const authPages = [
    "/login",
    "/signup",
    "/forget-password",
    "/verify-code",
    "/reset-password",
  ];

  if (authPages.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}