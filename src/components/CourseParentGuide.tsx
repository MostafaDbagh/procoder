import Link from "next/link";

const guides = {
 robotics: {
  en: {
   heading: "Is online robotics right for your child?",
   intro: "This introductory course explores how robots move, sense their surroundings and follow instructions through virtual simulations. It is a children's learning course, not a professional robotics engineering qualification.",
   sections: [
    ["What to look for", "A child who enjoys puzzles, routes and asking why something moved a particular way may enjoy robotics. They do not need to own a robot to discuss the course. Check the listed age range and ask which simulator and equipment are used before buying anything."],
    ["Try a simple activity together", "Draw a start and a finish on squared paper. Ask your child to write a route using ‘move forward’, ‘turn left’ and ‘turn right’. Follow the instructions exactly, then add an obstacle. Can they find the instruction that needs changing? This optional home activity introduces sequencing and debugging; it is not a promised course assignment."],
    ["How to notice progress", "Ask your child to predict a robot's next move, explain a sensor's purpose and describe how they fixed an incorrect instruction. A working simulation is useful, but explaining the reasoning is a better conversation starter than asking whether they finished quickly."],
    ["Joining from the UAE", "Lessons are live online. Prepare a laptop or desktop, audio and a stable connection. Confirm the device/software requirements and lesson time in UAE time (UTC+4). Classes have a maximum of three students; confirm the teaching language and current availability before enrolling."],
   ],
  },
  ar: {
   heading: "هل تناسب الروبوتات أونلاين طفلك؟",
   intro: "تستكشف هذه الدورة التمهيدية حركة الروبوتات واستشعار محيطها واتباع التعليمات عبر المحاكاة الافتراضية. إنها دورة تعليمية للأطفال وليست مؤهلاً مهنياً في هندسة الروبوتات.",
   sections: [
    ["ما الذي تبحث عنه؟", "قد يستمتع بالروبوتات الطفل الذي يحب الألغاز والمسارات ويسأل عن سبب حركة الأشياء. لا يلزم امتلاك روبوت للاستفسار عن الدورة. راجع الفئة العمرية واسأل عن برنامج المحاكاة والأجهزة المستخدمة قبل شراء أي معدات."],
    ["نشاط بسيط لتجربته معاً", "ارسم بداية ونهاية على ورق مربعات. اطلب من طفلك كتابة مسار باستخدام: تقدم، انعطف يساراً، انعطف يميناً. نفّذ التعليمات حرفياً، ثم أضف عائقاً. هل يستطيع تحديد التعليمة التي تحتاج إلى تعديل؟ هذا نشاط منزلي اختياري للتسلسل وتصحيح الأخطاء، وليس واجباً نعد بتقديمه ضمن الدورة."],
    ["كيف تلاحظ التقدم؟", "اطلب من طفلك توقع الحركة التالية وشرح وظيفة المستشعر وكيف أصلح تعليمة خاطئة. نجاح المحاكاة مفيد، لكن شرح التفكير يفتح حواراً أفضل من السؤال عن سرعة إنهاء المهمة."],
    ["الانضمام من الإمارات", "الحصص مباشرة أونلاين. جهّز حاسوباً وصوتاً واتصالاً مستقراً بالإنترنت. تأكد من متطلبات الجهاز والبرامج وموعد الحصة بتوقيت الإمارات (UTC+4). تضم المجموعة ثلاثة طلاب كحد أقصى؛ تأكد من لغة التدريس والتوفر قبل التسجيل."],
   ],
  },
 },
 python: {
  en: {
   heading: "Choosing a first Python course for your child",
   intro: "The course introduces calculations, text, lists, conditions and loops, then builds toward Turtle drawing, functions and objects. Use the current course facts above to check ages, level and duration; prior experience and typing confidence also matter.",
   sections: [
    ["Python or a visual starting point?", "Python uses typed instructions. If typing and punctuation frustrate your child, discuss a programming-foundations course first. A child who can patiently edit short instructions may be ready to try Python even without a previous coding course."],
    ["A small loop to discuss", "Consider: for step in range(4): then, on an indented next line, print(step). Before running it, ask what numbers it will print. The output is 0, 1, 2, 3. Change 4 to 3 and predict again. This optional example is about making and checking a prediction, not memorising syntax."],
    ["What progress can look like", "Ask your child to change a value, explain what changed and find one mistake independently. Later, ask why a repeated action belongs in a loop or how a function makes a program easier to reuse. Keep examples small enough for the child to explain in their own words."],
    ["Before the first online lesson", "Prepare a laptop or desktop and reliable audio/internet. Ask which Python editor is needed and whether installation is required. Confirm the teaching language, UAE-time schedule (UTC+4) and current price. The free trial helps discuss fit; it does not guarantee a particular learning outcome."],
   ],
  },
  ar: {
   heading: "اختيار أول دورة بايثون لطفلك",
   intro: "تبدأ الدورة بالحسابات والنصوص والقوائم والشروط والحلقات، ثم تتدرج إلى الرسم باستخدام Turtle والدوال والكائنات. راجع بيانات الدورة أعلاه للعمر والمستوى والمدة؛ فالخبرة السابقة والثقة بالكتابة مهمتان أيضاً.",
   sections: [
    ["بايثون أم بداية بصرية؟", "تستخدم بايثون تعليمات مكتوبة. إذا كانت الكتابة وعلامات الترقيم ترهقان طفلك، ناقش البدء بأساسيات البرمجة. وقد يكون الطفل القادر على تعديل تعليمات قصيرة بصبر مستعداً لتجربة بايثون حتى دون دورة سابقة."],
    ["حلقة صغيرة للنقاش", "جرّبا التعليمة for step in range(4): ثم print(step) في سطر جديد بمسافة بادئة. قبل التشغيل، اسأل طفلك عن الأرقام المتوقعة. النتيجة هي 0 و1 و2 و3. بدّل 4 إلى 3 وتوقعا مجدداً. الهدف من المثال الاختياري هو التوقع والتحقق، لا حفظ الصياغة."],
    ["كيف يبدو التقدم؟", "اطلب من طفلك تغيير قيمة وشرح النتيجة والعثور على خطأ واحد بنفسه. لاحقاً، اسأله لماذا نستخدم حلقة لفعل متكرر، وكيف تجعل الدالة إعادة استخدام التعليمات أسهل. اختر أمثلة صغيرة يستطيع شرحها بكلماته."],
    ["قبل أول حصة أونلاين", "جهّز حاسوباً واتصالاً وصوتاً موثوقين. اسأل عن محرر بايثون المطلوب وما إذا كان يحتاج إلى تثبيت. تأكد من لغة التدريس والموعد بتوقيت الإمارات (UTC+4) والسعر الحالي. تساعد الحصة التجريبية في مناقشة الملاءمة ولا تضمن نتيجة تعليمية محددة."],
   ],
  },
 },
};

export function CourseParentGuide({ slug, locale }: { slug: string; locale: string }) {
 if (slug !== "robotics" && slug !== "python") return null;
 const lang = locale === "ar" ? "ar" : "en";
 const guide = guides[slug][lang];
 return <section className="bg-surface rounded-2xl border border-border p-7 sm:p-9 mb-8" aria-labelledby="course-parent-guide">
  <h2 id="course-parent-guide" className="text-xl font-bold mb-4">{guide.heading}</h2>
  <p className="text-muted leading-relaxed mb-6">{guide.intro}</p>
  <div className="space-y-6">{guide.sections.map(([title, body]) => <div key={title}>
   <h3 className="font-semibold mb-2">{title}</h3><p className="text-muted leading-relaxed">{body}</p>
  </div>)}</div>
  <Link href={`/${lang}/parents#choosing-a-course`} className="inline-block mt-6 text-primary underline underline-offset-4">{lang === "ar" ? "دليل اختيار دورة لطفلك" : "Read the parent's course-selection guide"}</Link>
 </section>;
}
