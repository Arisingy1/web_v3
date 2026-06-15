"use client";

import ReportPage from "@/app/(tm)/otchet/primer/page";

/* Отчёт по кандидату — переиспользуем готовую страницу «Пример отчёта»
   с сайта (те же блоки, данные и модальные окна soft-skills), встроенную
   в оболочку платформы. Снимаем внутреннее ограничение ширины (max-w-1100),
   чтобы контент заполнял область с отступом 60px от сайдбара (без пустых полей). */
export default function AppReportPage() {
  return (
    <div className="pb-8 px-4 sm:px-6 lg:px-0 [&_.report-cta]:!hidden [&>div>section]:!max-w-none [&>div>div]:!max-w-none [&>div>section:first-of-type]:!pt-8 [&>div>section:first-of-type]:!pb-2 lg:[&>div>section]:!px-[60px] lg:[&>div>div]:!px-[60px]">
      <ReportPage />
    </div>
  );
}
