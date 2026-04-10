import Script from "next/script";

export function LocaleHtmlAttrs({ locale }: { locale: string }) {
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Script
      id="locale-attrs"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dir}";`,
      }}
    />
  );
}
