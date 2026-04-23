"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "./AnimatedSection";
import { BookOpen, CheckCircle2, Send, Rocket, Star, Zap, Atom } from "lucide-react";
import { sendContactMessage } from "@/lib/api";

export function CTABanner() {
 const n = useTranslations("newsletter");
 const [email, setEmail] = useState("");
 const [loading, setLoading] = useState(false);
 const [done, setDone] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || loading) return;
  setLoading(true);
  try {
   await sendContactMessage({
    name: "Newsletter",
    email,
    phone: "",
    subject: "Newsletter Subscription",
    message: `Newsletter signup: ${email}`,
   } as never);
   setDone(true);
  } catch {
   setDone(true);
  } finally {
   setLoading(false);
  }
 };

 return (
  <section className="py-20 sm:py-28">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <AnimatedSection>
     <div className="relative overflow-hidden rounded-3xl border-0 border-t-4 border-l-4 border-r-4 border-b-8 border-t-border border-l-border border-r-border border-b-primary/50 bg-surface p-8 sm:p-16 text-center ">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-purple/8 blur-3xl" />

      {/* Corner icons */}
      <div className="absolute top-5 left-5 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center rotate-[-15deg]">
       <Rocket className="w-5 h-5 text-primary" />
      </div>
      <div className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-purple/10 flex items-center justify-center rotate-[15deg]">
       <Star className="w-5 h-5 text-purple" />
      </div>
      <div className="absolute bottom-5 left-5 w-10 h-10 rounded-2xl bg-orange/10 flex items-center justify-center rotate-[10deg]">
       <Zap className="w-5 h-5 text-orange-400" />
      </div>
      <div className="absolute bottom-5 right-5 w-10 h-10 rounded-2xl bg-mint/10 flex items-center justify-center rotate-[-10deg]">
       <Atom className="w-5 h-5 text-mint" />
      </div>

      <div className="relative">
       <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
        <BookOpen className="w-3.5 h-3.5" />
        {n("footerTitle")}
       </div>

       <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
        {n("title")}
       </h2>

       <p className="text-muted text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
        {n("subtitle")}
       </p>

       {done ? (
        <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-base border border-emerald-200 dark:border-emerald-500/20">
         <CheckCircle2 className="w-5 h-5" />
         {n("success")}
        </div>
       ) : (
        <form
         onSubmit={handleSubmit}
         className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
        >
         <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={n("placeholder")}
          className="flex-1 px-5 py-3.5 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
         />
         <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 whitespace-nowrap"
         >
          {loading ? (
           <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
           <>
            <Send className="w-4 h-4" />
            {n("subscribe")}
           </>
          )}
         </button>
        </form>
       )}

       <p className="text-muted text-xs mt-5">{n("privacy")}</p>
      </div>
     </div>
    </AnimatedSection>
   </div>
  </section>
 );
}
