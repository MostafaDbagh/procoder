import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ExplorerContent from "./ExplorerContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const t = await getTranslations({ locale, namespace: "explorer" });
  const title = t("meta.pageTitle");
  const description = t("meta.pageDesc");

  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(lang, "/explorer"),
    openGraph: {
      title,
      description,
      url: siteUrl(lang, "/explorer"),
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_AE" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
      images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ExplorerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
          { name: bcLabel("Courses", locale), url: `${SITE_URL}/${locale}/courses` },
          { name: "Explorer", url: `${SITE_URL}/${locale}/explorer` },
        ]}
      />
      <ExplorerContent />
    </>
  );
}
