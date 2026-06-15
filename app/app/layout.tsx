"use client";

import { useState } from "react";
import PlatformSidebar from "@/components/platform/PlatformSidebar";

/* Оболочка внутренних страниц платформы: фиксированный сайдбар +
   область контента с фоном во всю ширину (без пустых полей по краям).
   Скролл по body — чтобы работали scroll-анимации встроенных отчётов. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-dvh bg-[#edf0ee]" style={{ color: "#183833", fontFamily: "var(--font-display), system-ui, sans-serif" }}>
      <PlatformSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`min-h-dvh transition-all duration-300 ease-in-out ${collapsed ? "lg:pl-[76px]" : "lg:pl-[272px]"}`}>
        <main className="min-h-dvh bg-[#edf0ee]">{children}</main>
      </div>
    </div>
  );
}
