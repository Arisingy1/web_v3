"use client";

import CultureReportEn from "@/components/platform/CultureReportEn";

/* English corporate-culture report inside the platform shell.
   Full-width content with 60px gutter from the sidebar; marketing CTA hidden. */
export default function AppEnCulturePage() {
  return (
    <div className="pb-8 px-4 sm:px-6 lg:px-0 [&_.report-cta]:!hidden [&>div>section]:!max-w-none [&>div>div]:!max-w-none [&>div>section:first-of-type]:!pt-8 [&>div>section:first-of-type]:!pb-2 lg:[&>div>section]:!px-[60px] lg:[&>div>div]:!px-[60px]">
      <CultureReportEn />
    </div>
  );
}
