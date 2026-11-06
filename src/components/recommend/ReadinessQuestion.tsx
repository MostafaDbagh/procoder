import type { NextReadinessQuestion } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export function ReadinessQuestion({ question, locale, disabled, onAnswer }: {
 question: NextReadinessQuestion;
 locale: string;
 disabled: boolean;
 onAnswer: (value: string, label: string) => void;
}) {
 return (
  <section className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6" aria-labelledby="next-readiness-question" dir={locale === "ar" ? "rtl" : "ltr"}>
   <h2 id="next-readiness-question" className="font-semibold text-lg mb-4">{question.prompt}</h2>
   {question.options.length > 0 ? (
    <div className="grid gap-2 sm:grid-cols-2">
     {question.options.map(option => (
      <button key={option.value} type="button" disabled={disabled} onClick={() => onAnswer(option.value, option.label)}
       className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-start text-sm leading-relaxed transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-wait">
       <span>{option.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-primary rtl:rotate-180" aria-hidden />
      </button>
     ))}
    </div>
   ) : <p className="text-sm text-muted">{locale === "ar" ? "اكتب العمر في الرسالة أدناه." : "Type their age in the message below."}</p>}
  </section>
 );
}
