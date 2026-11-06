/** Shared factual overview for both discovery files. Keep aligned with public pages. */
export const LLMS_OVERVIEW = `## What StemTechLab offers
StemTechLab provides live online coding and STEM education for children and teenagers, serving families in the UAE and across the GCC. Human instructors guide learners through practical projects that develop logical thinking, problem solving, creativity and the ability to explain their work. Families can explore individual courses, follow a structured learning journey, or use the AI Course Finder to choose a starting point.

The website is available in English and Arabic. Teaching language, timetable and equipment depend on the chosen course and group. Individual course pages are the source for enrollment age ranges and prerequisites; the broader learning journey includes planning guidance for ages 5–18.

## Starting Level Finder — provisional guidance
The free finder helps parents explore a starting point among Explorer, Builder, Creator, Innovator and Pro. No login is required.
1. Describe one child in English or Arabic. Details already shared are reused.
2. Answer one missing question at a time about age, previous experience, observed readiness and support needs.
3. Application rules suggest a provisional level. Missing or conflicting answers lead to clarification; uncertain answers may need teacher review.
4. Compatible published courses may be shown when available. A teacher helps confirm the starting point through a practical trial.

AI may help interpret parent text and classify concerns; it cannot override placement rules. Depending on configuration, messages and relevant context may be processed through OpenAI, Anthropic or DeepSeek APIs. Avoid sensitive personal information and consult the Privacy Policy before using the finder. Parents may browse courses without using it. Course-specific age ranges and prerequisites still apply. Lessons are taught by human instructors; dashboard records are separate from the finder.
- [Use the Course Finder in English]({{BASE}}/en/recommend)
- [منتقي الدورات بالعربية]({{BASE}}/ar/recommend)

## Structured learning paths — five stages
The learning journey develops capabilities through Explore → Build → Create → Innovate → Specialize. Children do not need to take every course in a stage. Placement considers readiness, previous experience, interests and demonstrated skills as well as age. The age bands below are guidance, not strict course eligibility.
- [Explorer — ages 5–8]({{BASE}}/en/learning-path/explorer): story and guided play develop sequencing, observation, trying, repairing and improving.
- [Builder — ages 8–10]({{BASE}}/en/learning-path/builder): turn ideas into instructions through first programs, prototypes and robots that respond.
- [Creator — ages 9–12]({{BASE}}/en/learning-path/creator): combine skills to plan, program, debug and improve complete projects.
- [Innovator — ages 11–14]({{BASE}}/en/learning-path/innovator): choose and combine technologies to solve problems without a prescribed answer.
- [Pro — ages 13–18]({{BASE}}/en/learning-path/pro): develop independent work in a chosen specialization, from an initial idea to a substantial documented project.

Subject pathways include Games, AI, Robotics, Web & Apps, and Python. AI develops from awareness of what machines can and cannot do, through simple recognition projects and understanding data, to applied AI and independent evaluation. Pathway examples describe curriculum progression; they are not a promise that every named module is currently open for enrollment. Check the live course catalog and stage pages for available learning experiences.

Stage pages explain the learning goals and offer a preliminary fit check, a request for a short call, or a registration request. The team confirms the starting point and arrangements; submitting a request does not start lessons or charge a payment.
- [Learning journey and subject pathways]({{BASE}}/en/learning-path)
- [مسار التعلّم بالعربية]({{BASE}}/ar/learning-path)

## For parents — progress, updates and the parent dashboard
Parents stay involved after enrollment through a private dashboard linked to their children's enrollments. It brings together lesson progress, upcoming classes, attendance history, instructor notes, homework and feedback, earned badges, and available session recordings. Parents can see what their child has completed, review teacher observations, revisit recorded lessons and follow the next learning steps.

StemTechLab keeps parents informed through learning updates and notifications, including absence notices and new teacher notes. The parent guide describes progress reports, class reminders and teacher communication. Learning summaries can cover what the child worked on, skills practiced, improvements and the next suggested step. Confirm the communication channel and reporting arrangements with the team.

The dashboard tracks learning activity and teacher-recorded progress; it is not continuous monitoring of a child's device or behavior. Account access is for enrolled families. Individual student records, recordings and messages are private and are not part of this public discovery index.
- [Parent guide and dashboard features]({{BASE}}/en/parents)
- [دليل الوالدين]({{BASE}}/ar/parents)

## Live classes, trial and rescheduling
- Classes are live, online and interactive, with a maximum of 3 students in a group; private one-to-one options are also described on the site.
- Request a free trial without a card. The team confirms availability, duration, teaching language and private or small-group format. Ask whether a recording is available and who may access it.
- Rescheduling is available at no extra cost with at least 4 hours' notice before class. Confirm the next available slot with the team.
- A laptop or desktop, stable internet and audio are needed. Confirm course-specific software and whether robotics uses simulation or physical equipment before buying materials.
- Check the selected course's price and billing currency, prerequisites, teaching language and schedule before paying. A free trial or free finder does not make the full course free.
- [Free trial]({{BASE}}/en/free-trial)
- [حصة تجريبية مجانية]({{BASE}}/ar/free-trial)
- [Frequently asked questions]({{BASE}}/en/faq)
- [UAE parent guide]({{BASE}}/en/uae)
`;

export const LLMS_FULL_TEMPLATE = `# StemTechLab — Learning, courses and parent support
> Live online coding and STEM classes, an AI Course Finder, a five-stage learning journey and a private parent dashboard.

${LLMS_OVERVIEW}

## Subject pathway examples
The learning-path page illustrates longer-term directions:
- Games: visual programming foundations, then Python game projects and more independent game creation.
- AI: discovery and recognition activities, then data, applied AI and advanced projects.
- Robotics: introductory robot behavior, then more complex systems and projects.
- Web & Apps: a first website, mobile apps, interactive websites and a digital product project.
- Python: introductory Python, game design, advanced programming and certification preparation or a capstone.
These are curriculum directions, not fixed packages or guaranteed certification outcomes. Actual live courses, their age ranges and learning goals are listed below.

{{COURSE_CATALOG}}

## Public page guide
- [Homepage]({{BASE}}/en): introduction to live teaching, learning options, the course finder and support for families. [العربية]({{BASE}}/ar).
- [UAE classes]({{BASE}}/en/uae): attending from Dubai, Abu Dhabi, Sharjah or elsewhere in the UAE; preparation, language, equipment and comparing courses. [العربية]({{BASE}}/ar/uae).
- [Course catalog]({{BASE}}/en/courses): current courses; individual pages provide age range, level, lessons, duration, goals and enrollment information. [العربية]({{BASE}}/ar/courses).
- [Course Finder]({{BASE}}/en/recommend): free guided conversation to explore a provisional starting level. [العربية]({{BASE}}/ar/recommend).
- [Learning path]({{BASE}}/en/learning-path): the five stages, subject pathways, placement guidance and links to each stage. [العربية]({{BASE}}/ar/learning-path).
- [For parents]({{BASE}}/en/parents): choosing a starting point, learning updates, dashboard features and staying involved. [العربية]({{BASE}}/ar/parents).
- [Free trial]({{BASE}}/en/free-trial): trial inclusions and a request form; a request is separate from paid enrollment. [العربية]({{BASE}}/ar/free-trial).
- [FAQ]({{BASE}}/en/faq): answers about course fit, delivery, progress, scheduling and enrollment. [العربية]({{BASE}}/ar/faq).
- [About StemTechLab]({{BASE}}/en/about): mission, teaching approach and published team information. [العربية]({{BASE}}/ar/about).
- [Blog]({{BASE}}/en/blogs): articles and guides for parents about coding, STEM and learning; consult each article's date and sources. [العربية]({{BASE}}/ar/blogs).
- [Monthly challenge]({{BASE}}/en/challenge): a free creative activity families can try without an account, with optional email signup. [العربية]({{BASE}}/ar/challenge).
- [Contact]({{BASE}}/en/contact): questions about course suitability, enrollment and family needs. [العربية]({{BASE}}/ar/contact).
- [Careers]({{BASE}}/en/careers): currently published roles, requirements and application details. [العربية]({{BASE}}/ar/careers).
- [Privacy]({{BASE}}/en/privacy): information handling and privacy terms. [العربية]({{BASE}}/ar/privacy).
- [Terms]({{BASE}}/en/terms): service and enrollment terms. [العربية]({{BASE}}/ar/terms).
- [Short discovery index]({{BASE}}/llms.txt).

## Scope and source accuracy
This file describes StemTechLab's public offering and currently supplied catalog. Course pages and policies remain the source for current details. Subject pathways are broader than the live catalog. Private parent, instructor and admin areas require authorized access and are not public reference sources. The AI Course Finder uses independent third-party AI tools; this does not imply sponsorship or endorsement by their providers.
`;
