import { getTranslations } from "next-intl/server";
import { FAQ_KEYS_BY_TAB } from "@/data/faqKeys";

/** Native disclosure keeps every answer in the server HTML and works without JS. */
export async function FAQ() {
 const t = await getTranslations("faq");
 return (
  <section className="py-20 sm:py-28">
   <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <header className="mb-12">
     <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")} {t("titleHighlight")}</h1>
     <p className="text-muted text-lg">{t("subtitle")}</p>
    </header>
    {Object.entries(FAQ_KEYS_BY_TAB).map(([group, ids]) => (
     <section key={group} aria-labelledby={`faq-${group}`} className="mb-10">
      <h2 id={`faq-${group}`} className="text-xl font-bold mb-4">{t(`tab_${group}`)}</h2>
      <div className="space-y-3">
       {ids.map(id => (
        <details key={id} className="rounded-xl border border-border bg-surface p-5 sm:p-6">
         <summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4">{t(`${id}_q`)}</summary>
         <p className="mt-4 text-muted leading-relaxed">{t(`${id}_a`)}</p>
        </details>
       ))}
      </div>
     </section>
    ))}
   </div>
  </section>
 );
}
