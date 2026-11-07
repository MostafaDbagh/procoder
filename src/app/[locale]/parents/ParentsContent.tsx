import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight, ChevronDown, Compass, LayoutDashboard } from "lucide-react";

type GuideItem = { title: string; body: string };

export default function ParentsContent() {
  const t = useTranslations("parents");
  const steps = t.raw("guide.steps") as GuideItem[];
  const questions = t.raw("guide.questions") as GuideItem[];
  const stepLinks = ["/recommend", "/learning-path", "/free-trial"];
  const stepLabels = [t("heroCta"), t("guide.levelsLink"), t("guide.trialLink")];
  const linkStyle = "inline-flex min-h-11 items-center gap-2 rounded font-semibold text-purple-emphasis underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold text-purple-emphasis">{t("badge")}</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {t("heroTitleLead")} {t("heroTitleHighlight")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{t("guide.intro")}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <LocalizedLink href="/recommend" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-purple-emphasis px-6 py-3 font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <Compass className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("heroCta")}
          </LocalizedLink>
          <LocalizedLink href="/contact" className={linkStyle}>{t("contactLink")}</LocalizedLink>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t("guide.finderHint")}</p>
      </header>

      <section id="choosing-a-course" aria-labelledby="parent-course-heading" className="mt-14 scroll-mt-24 border-t border-border pt-10">
        <h2 id="parent-course-heading" className="text-2xl font-bold">{t("guide.stepsHeading")}</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
              <span aria-hidden="true" className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-purple-emphasis">{index + 1}</span>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mb-4 mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              <LocalizedLink href={stepLinks[index]} className={`${linkStyle} mt-auto self-start text-sm`}>
                {stepLabels[index]}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 rtl:rotate-180" />
              </LocalizedLink>
            </li>
          ))}
        </ol>
      </section>

      <section id="learning-approach" aria-labelledby="learning-approach-heading" className="mt-12 scroll-mt-24 max-w-3xl">
        <h2 id="learning-approach-heading" className="text-2xl font-bold">{t("guide.approachTitle")}</h2>
        <p className="mt-3 leading-relaxed text-muted">{t("guide.approachBody")}</p>
      </section>

      <section id="parent-questions" aria-labelledby="parent-questions-heading" className="mt-12 scroll-mt-24">
        <h2 id="parent-questions-heading" className="mb-5 text-2xl font-bold">{t("guide.questionsHeading")}</h2>
        <div className="divide-y divide-border border-y border-border">
          {questions.map(question => (
            <details key={question.title} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-5 text-start font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span>{question.title}</span>
                <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-muted group-open:rotate-180 motion-safe:transition-transform" />
              </summary>
              <p className="max-w-3xl pe-9 pb-5 text-sm leading-relaxed text-muted">{question.body}</p>
            </details>
          ))}
        </div>
        <LocalizedLink href="/privacy" className={`${linkStyle} mt-4 text-sm`}>{t("privacyLink")}</LocalizedLink>
      </section>

      <aside id="parent-progress" aria-labelledby="parent-progress-heading" className="mt-12 flex scroll-mt-24 flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="parent-progress-heading" className="text-lg font-bold">{t("guide.enrolledTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("guide.enrolledBody")}</p>
        </div>
        <LocalizedLink href="/parent/login" className={`${linkStyle} shrink-0 text-sm`}>
          <LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden="true" />{t("openDashboard")}
        </LocalizedLink>
      </aside>
    </div>
  );
}
