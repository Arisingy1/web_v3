"use client";

import CulturePrimerPage from "@/app/(tm)/culture/primer/page";

/* Отчёт по корпоративной культуре — переиспользуем готовую страницу с сайта,
   встроенную в оболочку платформы. Снимаем внутреннее ограничение ширины
   (max-w-1100), чтобы контент заполнял область с отступом 60px от сайдбара
   (без пустых полей). */
export default function AppCulturePage() {
  return (
    <div className="pb-8 px-4 sm:px-6 lg:px-0 [&_.report-cta]:!hidden [&>div>section]:!max-w-none [&>div>div]:!max-w-none [&>div>section:first-of-type]:!pt-8 [&>div>section:first-of-type]:!pb-2 lg:[&>div>section]:!px-[60px] lg:[&>div>div]:!px-[60px]">
      <CulturePrimerPage />
    </div>
  );
}
