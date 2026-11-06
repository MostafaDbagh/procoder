import { User } from "lucide-react";
import type { ChildProfile } from "@/lib/api";

const interestLabels: Record<string, [string, string]> = {
 coding: ["Coding", "البرمجة"],
 programming: ["Programming", "البرمجة"],
 games: ["Games", "الألعاب"],
 gaming: ["Games", "الألعاب"],
 robots: ["Robotics", "الروبوتات"],
 robotics: ["Robotics", "الروبوتات"],
 building: ["Building & making", "البناء وصنع الأشياء"],
 electronics: ["Electronics", "الإلكترونيات"],
 math: ["Math", "الرياضيات"],
 mathematics: ["Math", "الرياضيات"],
 art: ["Art", "الفنون"],
 drawing: ["Drawing", "الرسم"],
 science: ["Science", "العلوم"],
 research: ["Research & discovery", "البحث والاكتشاف"],
 ai: ["Artificial intelligence", "الذكاء الاصطناعي"],
 web: ["Web design", "تصميم المواقع"],
 technology: ["Technology", "التكنولوجيا"],
 computers: ["Computers", "الحاسوب"],
 music: ["Music", "الموسيقى"],
 sports: ["Sports", "الرياضة"],
 arabic: ["Arabic", "اللغة العربية"],
};

function readableLabel(value: string) {
 const words = value.replace(/[_-]+/g, " ").trim();
 return words.charAt(0).toUpperCase() + words.slice(1);
}

export function ProfileSummary({ profile, locale }: { profile: ChildProfile; locale: string }) {
 const isAr = locale === "ar";
 const experienceLabels: Record<string, string> = {
  none: isAr ? "دون خبرة سابقة" : "No prior experience",
  beginner: isAr ? "خبرة أولية" : "Getting started",
  intermediate: isAr ? "خبرة سابقة" : "Some experience",
  advanced: isAr ? "خبرة متقدمة" : "Advanced experience",
 };
 const interests = [...new Set(profile.interests.map(value =>
  interestLabels[value]?.[isAr ? 1 : 0] ?? readableLabel(value)
 ))];
 if (!profile.age && !profile.experience_level && interests.length === 0) return null;

 return (
  <section dir={isAr ? "rtl" : "ltr"} className="mb-6 overflow-hidden rounded-2xl border border-border bg-background/50">
   <div className="flex items-start gap-3 border-b border-border px-4 py-4 sm:px-5">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
     <User className="h-4 w-4" aria-hidden />
    </span>
    <div className="min-w-0">
     <h3 className="text-sm font-semibold leading-5 text-foreground">
      {isAr ? "ما شاركته عن طفلك" : "What you’ve shared about your child"}
     </h3>
     <p className="mt-1 text-xs leading-relaxed text-muted">
      {isAr ? "ملخص يساعدنا على فهم نقطة البداية." : "A little context to help us understand their starting point."}
     </p>
    </div>
   </div>
   <dl className="grid grid-cols-1 gap-5 px-4 py-5 min-[360px]:grid-cols-2 sm:grid-cols-[1fr_1.4fr_2fr] sm:px-5">
    {profile.age != null && (
     <div className="min-w-0">
      <dt className="text-xs font-medium text-muted">{isAr ? "العمر" : "Age"}</dt>
      <dd className="mt-2 text-sm font-semibold leading-6 text-foreground">
       {isAr ? `${profile.age} سنة` : `${profile.age} years old`}
      </dd>
     </div>
    )}
    {profile.experience_level && (
     <div className="min-w-0">
      <dt className="text-xs font-medium text-muted">{isAr ? "الخبرة السابقة" : "Previous experience"}</dt>
      <dd className="mt-2 break-words text-sm font-semibold leading-6 text-foreground">
       {experienceLabels[profile.experience_level] ?? readableLabel(profile.experience_level)}
      </dd>
     </div>
    )}
    {interests.length > 0 && (
     <div className="min-w-0 min-[360px]:col-span-2 sm:col-span-1">
      <dt className="text-xs font-medium text-muted">{isAr ? "الاهتمامات" : "Interests"}</dt>
      <dd className="mt-2 flex flex-wrap gap-2">
       {interests.map(interest => (
        <span key={interest} className="max-w-full rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium leading-5 text-primary [overflow-wrap:anywhere]">
         {interest}
        </span>
       ))}
      </dd>
     </div>
    )}
   </dl>
  </section>
 );
}
