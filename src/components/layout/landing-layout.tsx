import React from "react";
import { useLocation } from "@tanstack/react-router";
import Navbar from "../navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  return (
    <div className="h-screen bg-[#fff0f3] flex flex-col overflow-hidden">
      {!isRoot && <Navbar />}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
