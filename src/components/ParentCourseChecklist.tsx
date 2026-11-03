import Link from "next/link";

export function ParentCourseChecklist({ locale }: { locale: string }) {
 const ar = locale === "ar";
 const lang = ar ? "ar" : "en";
 const items = ar ? [
  ["ابدأ بما يستطيع طفلك شرحه", "اطلب منه وصف خطوات لعبة أو طريق إلى مكان مألوف. إذا استمتع بترتيب الخطوات، فقد تناسبه بداية في أساسيات البرمجة. العمر نقطة بداية؛ الانتباه والخبرة والثقة أهم من اختيار اسم دورة يبدو متقدماً."],
  ["اختر طريقة تعلم مناسبة", "قد تناسب الأنشطة البصرية الطفل الذي لا يرتاح للكتابة بعد. تناسب بايثون من يستعد لتجربة تعليمات مكتوبة وتعديلها. أما الروبوتات فتربط التعليمات بالحركة والمستشعرات؛ تأكد هل يستخدم المسار محاكاة أم معدات فعلية."],
  ["جرّب نشاطاً قبل اختيار المسار", "اكتب خمس خطوات لرسم شكل بسيط، ثم اطلب من طفلك تنفيذها حرفياً. غيّرا تعليمة واحدة وتوقعا النتيجة. لاحظ هل يستمتع باكتشاف الخطأ وشرحه؛ لا تختبر سرعة الإنجاز ولا تحوّل النشاط إلى امتحان."],
  ["استخدم الحصة التجريبية لطرح أسئلة محددة", "شارك عمر طفلك وخبرته وأي مشروع جرّبه. اسأل عن لغة التدريس والأجهزة وما يتعلمه في البداية وكيف يتعامل المعلم مع اختلاف السرعات. اسأل طفلك بعدها: ماذا جربت؟ أين تعثرت؟ وما الذي تود بناءه لاحقاً؟"],
  ["راجع التفاصيل العملية في الإمارات", "تأكد من الموعد بتوقيت الإمارات (UTC+4)، والسعر وعملة الدفع والمدة وعدد الحصص وسياسة الغياب. مجموعاتنا ثلاثة طلاب كحد أقصى. جهّز مكاناً هادئاً وحاسوباً واتصالاً مستقراً؛ لا تشتر أدوات قبل تأكيد الحاجة إليها."],
  ["ساعد دون تنفيذ المهمة عنه", "اطلب من طفلك شرح توقعه قبل تشغيل البرنامج. عندما يظهر خطأ، اسأل أي خطوة يمكن فحصها أولاً. شجّع شرح الفكرة وتحسين المحاولة، ولا تقارن تقدمه بسرعة طفل آخر."],
 ] : [
  ["Start with what your child can explain", "Ask them to describe the steps of a game or a familiar route. If they enjoy putting steps in order, programming foundations may be a useful starting point. Age is a guide; attention, experience and confidence matter more than choosing an advanced-sounding course."],
  ["Choose a learning format that fits", "Visual activities can suit a child who is not comfortable typing yet. Python suits children ready to try and edit written instructions. Robotics connects instructions to movement and sensors; check whether the selected course uses simulations or physical equipment."],
  ["Try one small activity first", "Write five instructions for drawing a simple shape and ask your child to follow them literally. Change one instruction and predict the result together. Notice whether they enjoy finding and explaining a mistake. This is an optional home activity, not a speed test or an entry exam."],
  ["Use the trial to ask specific questions", "Share your child's age, previous experience and a project they have tried. Ask about the teaching language, device requirements, first learning goals and how the instructor handles different learning speeds. Afterwards ask your child: what did you try, where did you get stuck, and what would you like to build next?"],
  ["Check the practical details for UAE families", "Confirm the time in UAE time (UTC+4), price and billing currency, duration, lesson count and absence policy. Our groups have a maximum of three students. Prepare a quiet space, a computer and reliable internet; wait for confirmed requirements before buying equipment."],
  ["Help without taking over", "Ask your child to explain their prediction before running a program. When something goes wrong, ask which step they could check first. Encourage explanations and improvements rather than comparing their speed with another child's."],
 ];
 return <section id="choosing-a-course" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24" aria-labelledby="parent-course-heading">
  <h2 id="parent-course-heading" className="text-2xl sm:text-3xl font-bold mb-5">{ar ? "كيف تختار دورة برمجة لطفلك في الإمارات؟" : "How to choose a coding course for your child in the UAE"}</h2>
  <p className="text-muted leading-relaxed mb-8">{ar ? "استخدم هذه الخطوات للمقارنة بين الدورات والاستعداد لأول حصة أونلاين. لا يحتاج الطفل إلى معرفة الإجابات مسبقاً؛ نبحث عن بداية تناسبه." : "Use this checklist to compare courses and prepare for a first online lesson. Your child does not need to know the answers already; the aim is to find a suitable starting point."}</p>
  <ol className="space-y-7 list-decimal ps-6">{items.map(([title, body]) => <li key={title} className="ps-2"><h3 className="font-semibold mb-2">{title}</h3><p className="text-muted leading-relaxed">{body}</p></li>)}</ol>
  <nav aria-label={ar ? "دورات وخطوات تالية" : "Courses and next steps"} className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-primary underline underline-offset-4">
   <Link href={`/${lang}/courses/robotics`}>{ar ? "روبوتات للأطفال" : "Robotics for kids"}</Link>
   <Link href={`/${lang}/courses/python`}>{ar ? "بايثون للأطفال" : "Python for kids"}</Link>
   <Link href={`/${lang}/courses`}>{ar ? "قارن الدورات المتاحة" : "Compare current courses"}</Link>
   <Link href={`/${lang}/free-trial`}>{ar ? "اطلب حصة تجريبية" : "Request a free trial"}</Link>
  </nav>
 </section>;
}
