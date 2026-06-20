"use client";

import { useState } from "react";
import PlatformSidebar from "@/components/platform/PlatformSidebar";

/* English platform shell: fixed sidebar (EN) + full-width content area. */
export default function AppEnLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-dvh bg-[#edf0ee]" style={{ color: "#183833", fontFamily: "var(--font-display), system-ui, sans-serif" }}>
      <PlatformSidebar collapsed={collapsed} setCollapsed={setCollapsed} lang="en" />
      <div className={`min-h-dvh transition-all duration-300 ease-in-out ${collapsed ? "lg:pl-[76px]" : "lg:pl-[272px]"}`}>
        <main className="min-h-dvh bg-[#edf0ee]">{children}</main>
      </div>
    </div>
  );
}
