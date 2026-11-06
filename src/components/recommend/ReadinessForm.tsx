"use client";

import { useId, useState } from "react";
import { Blocks, Cake, Compass, HeartHandshake, Pencil, Rocket, Sparkles, Check, Loader2 } from "lucide-react";
import { ReadinessSelect } from "./ReadinessSelect";
import type { ReadinessAnswers } from "@/lib/api";

export function ReadinessForm({ value, onChange, onSubmit, disabled, waiting = false, locale }: {
 value: ReadinessAnswers;
 onChange: (value: ReadinessAnswers) => void;
 onSubmit: () => void;
 disabled: boolean;
 waiting?: boolean;
 locale: string;
}) {
 const ageId = useId();
 const ar = locale === "ar";
 const [editingAge, setEditingAge] = useState(value.age === undefined);
 const say = (en: string, arabic: string) => ar ? arabic : en;
 const fields = [
  { key: "experience" as const, icon: Blocks, tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300", label: say("Previous learning experience", "الخبرة التعليمية السابقة"), options: [
   ["none", say("No previous experience", "دون خبرة سابقة")],
   ["beginner", say("Tried a few guided activities", "جرّب أنشطة قليلة بالتوجيه")],
   ["intermediate", say("Completed several projects", "أنجز عدة مشاريع")],
   ["advanced", say("Sustained experience with substantial projects", "خبرة مستمرة في مشاريع متكاملة")],
  ] },
  { key: "readiness" as const, icon: Compass, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", label: say("What can your child currently do?", "ماذا يستطيع طفلك فعله حالياً؟"), options: [
   ["sequences", say("Practise simple sequences through stories and play", "يتدرّب على خطوات بسيطة عبر القصص واللعب")],
   ["guided", say("Build a small project with step-by-step guidance", "ينجز مشروعاً صغيراً بتوجيه خطوة بخطوة")],
   ["independent", say("Make and explain a small project independently", "ينجز مشروعاً صغيراً ويشرحه باستقلالية")],
   ["open_ended", say("Compare solutions and improve an open-ended project", "يقارن الحلول ويحسّن مشروعاً مفتوحاً")],
   ["specialization", say("Plan, test and explain substantial projects in a chosen field", "يخطط ويختبر ويشرح مشاريع متكاملة في مجال مختار")],
  ] },
  { key: "support" as const, icon: HeartHandshake, tone: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300", label: say("When a task gets difficult…", "عندما تصبح المهمة صعبة…"), options: [
   ["frequent", say("Needs frequent adult guidance", "يحتاج إلى توجيه متكرر من شخص بالغ")],
   ["occasional", say("Continues with occasional prompts", "يتابع مع تلميحات أحياناً")],
   ["independent", say("Tries alternatives and explains what changed", "يجرّب بدائل ويشرح ما تغيّر")],
  ] },
 ];
 const validAge = Number.isInteger(value.age) && value.age! >= 3 && value.age! <= 20;
 const answered = [validAge, value.experience, value.readiness, value.support].filter(Boolean).length;
 const complete = answered === 4;
 return (
  <form dir={ar ? "rtl" : "ltr"} className="relative mb-6 rounded-3xl border-2 border-primary/15 bg-surface p-5 sm:p-7"
   onSubmit={event => { event.preventDefault(); if (complete && !disabled && !waiting) onSubmit(); }}>
   <fieldset disabled={disabled} className="min-w-0 space-y-6 disabled:opacity-60">
    <legend className="sr-only">{say("Understand your child’s starting point", "لنفهم نقطة البداية لطفلك")}</legend>
    <div className="flex items-start gap-4">
     <span className="flex h-12 w-12 shrink-0 -rotate-6 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
      <Rocket className="h-6 w-6" aria-hidden />
     </span>
     <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5" aria-hidden />{say("A little about your explorer", "لنتعرّف على مستكشفك الصغير")}</p>
      <h3 className="font-display text-xl font-extrabold leading-snug text-foreground">{say("Let’s find their starting point", "لنجد نقطة البداية المناسبة")}</h3>
     </div>
    </div>
    <p className="text-sm leading-relaxed text-muted">{say("Tell us what you’ve noticed about one child. No coding experience needed — and “I’m not sure” is always okay.", "أخبرنا بما لاحظته عن طفل واحد. لا نحتاج خبرة في البرمجة، وإجابة «لست متأكداً» مقبولة دائماً.")}</p>
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-border pb-4">
     <span className="text-xs font-semibold text-muted">{say(`${answered} of 4 answers ready`, `${answered} من 4 إجابات جاهزة`)}</span>
     <div className="flex gap-1.5" aria-hidden>{[0,1,2,3].map(index => <span key={index} className={`h-2 w-7 rounded-full ${index < answered ? "bg-primary" : "bg-primary/10"}`} />)}</div>
    </div>
    <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
     <div className="flex items-center gap-3">
      <Cake className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
      <div className="min-w-0 flex-1">
       <label htmlFor={editingAge ? ageId : undefined} className="block text-sm font-bold text-foreground">{say("Child’s age", "عمر الطفل")}</label>
       {!editingAge && validAge && <p className="mt-1 text-sm text-muted">{say(`${value.age} years old · Already noted`, `${value.age} سنة · تم تسجيل العمر`)}</p>}
      </div>
      {!editingAge && <button type="button" onClick={() => setEditingAge(true)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-foreground hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-primary dark:hover:bg-amber-900"><Pencil className="h-3 w-3" aria-hidden />{say("Change", "تعديل")}</button>}
     </div>
     {editingAge && <div className="mt-3 flex gap-2">
      <input id={ageId} type="number" min={3} max={20} step={1} inputMode="numeric" required value={value.age ?? ""}
       onChange={event => onChange({ ...value, age: event.target.value === "" ? undefined : Number(event.target.value) })}
       placeholder={say("Age in years", "العمر بالسنوات")}
       className="min-h-12 min-w-0 flex-1 rounded-xl border-2 border-border bg-surface px-4 text-sm focus:border-primary focus:outline-none" />
      {validAge && <button type="button" onClick={() => setEditingAge(false)} className="rounded-xl bg-primary/10 px-4 font-semibold text-primary"><Check className="h-4 w-4" aria-hidden /><span className="sr-only">{say("Confirm age", "تأكيد العمر")}</span></button>}
     </div>}
    </div>
    {fields.map(field => (
     <div key={field.key} className="space-y-3">
      <div className="flex items-center gap-3">
       <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${field.tone}`}><field.icon className="h-4 w-4" aria-hidden /></span>
       <p className="text-sm font-bold leading-relaxed text-foreground">{field.label}</p>
      </div>
      <ReadinessSelect label={field.label} value={value[field.key] ?? ""} disabled={disabled}
       placeholder={say("Pick the answer that feels closest", "اختر الإجابة الأقرب لطفلك")}
       options={[...field.options.map(([key,label]) => ({value:key,label})), {value:"unsure",label:say("I’m not sure yet", "لست متأكداً بعد")}]}
       onChange={answer => onChange({ ...value, [field.key]: answer })} />
     </div>
    ))}
    <div className="border-t border-dashed border-border pt-5">
     <button type="submit" disabled={!complete || disabled || waiting} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-primary/30 disabled:shadow-none">
      {disabled ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Sparkles className="h-5 w-5" aria-hidden />}
      {disabled ? say("Reviewing…", "جارٍ المراجعة…") : waiting ? say("Ready again in a moment…", "جاهز مجدداً بعد لحظات…") : say("Find their starting point", "لنجد نقطة البداية")}
     </button>
     <p className="mt-3 text-center text-xs leading-relaxed text-muted">{say("A helpful first step. A teacher helps confirm the fit.", "خطوة أولى مفيدة، ويساعد المعلم على تأكيد الملاءمة.")}</p>
    </div>
   </fieldset>
  </form>
 );
}
