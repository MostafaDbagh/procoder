export type Category =
 | "programming"
 | "robotics"
 | "algorithms"
 | "arabic"
 | "web-development";

export type Level = "beginner" | "intermediate" | "advanced";

export interface Course {
 id: string;
 category: Category;
 ageMin: number;
 ageMax: number;
 level: Level;
 lessons: number;
 durationWeeks: number;
 color: string;
 iconName: string;
 titleKey: string;
 descKey: string;
 skillKeys: string[];
 /** Set when listing from API (MongoDB catalog price). */
 price?: number;
 currency?: string;
 /** Set from API when a cover image was uploaded. */
 imageUrl?: string;
 /** Live social proof from API. */
 enrollmentCount?: number;
 /** ISO date string — next cohort start. */
 nextSessionDate?: string | null;
}

export const courses: Course[] = [
 {
 id: "scratch",
 category: "programming",
 ageMin: 6,
 ageMax: 9,
 level: "beginner",
 lessons: 20,
 durationWeeks: 8,
 color: "from-amber-400 to-orange-400",
 iconName: "Blocks",
 titleKey: "scratch_title",
 descKey: "scratch_desc",
 skillKeys: [
 "scratch_skill1",
 "scratch_skill2",
 "scratch_skill3",
 "scratch_skill4",
 ],
 price: 299,
 currency: "USD",
 },
 {
 id: "python",
 category: "programming",
 ageMin: 10,
 ageMax: 13,
 level: "beginner",
 lessons: 24,
 durationWeeks: 10,
 color: "from-blue-400 to-cyan-400",
 iconName: "Code2",
 titleKey: "python_title",
 descKey: "python_desc",
 skillKeys: [
 "python_skill1",
 "python_skill2",
 "python_skill3",
 "python_skill4",
 ],
 price: 399,
 currency: "USD",
 },
 {
 id: "webdev",
 category: "programming",
 ageMin: 14,
 ageMax: 18,
 level: "intermediate",
 lessons: 30,
 durationWeeks: 12,
 color: "from-violet-400 to-purple-400",
 iconName: "Globe",
 titleKey: "webdev_title",
 descKey: "webdev_desc",
 skillKeys: [
 "webdev_skill1",
 "webdev_skill2",
 "webdev_skill3",
 "webdev_skill4",
 ],
 price: 599,
 currency: "USD",
 },
 {
 id: "robot-basics",
 category: "robotics",
 ageMin: 8,
 ageMax: 12,
 level: "beginner",
 lessons: 18,
 durationWeeks: 8,
 color: "from-emerald-400 to-teal-400",
 iconName: "Bot",
 titleKey: "robot_basics_title",
 descKey: "robot_basics_desc",
 skillKeys: [
 "robot_basics_skill1",
 "robot_basics_skill2",
 "robot_basics_skill3",
 "robot_basics_skill4",
 ],
 price: 349,
 currency: "USD",
 },
 {
 id: "robot-advanced",
 category: "robotics",
 ageMin: 13,
 ageMax: 18,
 level: "intermediate",
 lessons: 28,
 durationWeeks: 14,
 color: "from-teal-400 to-green-400",
 iconName: "Cpu",
 titleKey: "robot_adv_title",
 descKey: "robot_adv_desc",
 skillKeys: [
 "robot_adv_skill1",
 "robot_adv_skill2",
 "robot_adv_skill3",
 "robot_adv_skill4",
 ],
 price: 649,
 currency: "USD",
 },
 {
 id: "algo-intro",
 category: "algorithms",
 ageMin: 10,
 ageMax: 13,
 level: "beginner",
 lessons: 22,
 durationWeeks: 10,
 color: "from-sky-400 to-blue-400",
 iconName: "Brain",
 titleKey: "algo_intro_title",
 descKey: "algo_intro_desc",
 skillKeys: [
 "algo_intro_skill1",
 "algo_intro_skill2",
 "algo_intro_skill3",
 "algo_intro_skill4",
 ],
 price: 389,
 currency: "USD",
 },
 {
 id: "algo-competitive",
 category: "algorithms",
 ageMin: 14,
 ageMax: 18,
 level: "advanced",
 lessons: 36,
 durationWeeks: 16,
 color: "from-indigo-400 to-violet-400",
 iconName: "Trophy",
 titleKey: "algo_comp_title",
 descKey: "algo_comp_desc",
 skillKeys: [
 "algo_comp_skill1",
 "algo_comp_skill2",
 "algo_comp_skill3",
 "algo_comp_skill4",
 ],
 price: 799,
 currency: "USD",
 },
 {
 id: "arabic-reading",
 category: "arabic",
 ageMin: 6,
 ageMax: 9,
 level: "beginner",
 lessons: 24,
 durationWeeks: 12,
 color: "from-rose-400 to-pink-400",
 iconName: "BookOpen",
 titleKey: "arabic_reading_title",
 descKey: "arabic_reading_desc",
 skillKeys: [
 "arabic_reading_skill1",
 "arabic_reading_skill2",
 "arabic_reading_skill3",
 "arabic_reading_skill4",
 ],
 price: 279,
 currency: "USD",
 },
 {
 id: "arabic-grammar",
 category: "arabic",
 ageMin: 10,
 ageMax: 14,
 level: "intermediate",
 lessons: 28,
 durationWeeks: 14,
 color: "from-pink-400 to-fuchsia-400",
 iconName: "PenTool",
 titleKey: "arabic_grammar_title",
 descKey: "arabic_grammar_desc",
 skillKeys: [
 "arabic_grammar_skill1",
 "arabic_grammar_skill2",
 "arabic_grammar_skill3",
 "arabic_grammar_skill4",
 ],
 price: 439,
 currency: "USD",
 },
 {
 id: "arabic-recitation",
 category: "arabic",
 ageMin: 6,
 ageMax: 12,
 level: "beginner",
 lessons: 30,
 durationWeeks: 16,
 color: "from-emerald-400 to-lime-400",
 iconName: "BookMarked",
 titleKey: "arabic_recitation_title",
 descKey: "arabic_recitation_desc",
 skillKeys: [
 "arabic_recitation_skill1",
 "arabic_recitation_skill2",
 "arabic_recitation_skill3",
 "arabic_recitation_skill4",
 ],
 price: 329,
 currency: "USD",
 },
 {
 id: "arabic-memorization",
 category: "arabic",
 ageMin: 10,
 ageMax: 18,
 level: "intermediate",
 lessons: 40,
 durationWeeks: 20,
 color: "from-lime-400 to-emerald-400",
 iconName: "Star",
 titleKey: "arabic_memorization_title",
 descKey: "arabic_memorization_desc",
 skillKeys: [
 "arabic_memorization_skill1",
 "arabic_memorization_skill2",
 "arabic_memorization_skill3",
 "arabic_memorization_skill4",
 ],
 price: 649,
 currency: "USD",
 },
 {
 id: "gamedev",
 category: "programming",
 ageMin: 12,
 ageMax: 16,
 level: "intermediate",
 lessons: 26,
 durationWeeks: 12,
 color: "from-fuchsia-400 to-purple-400",
 iconName: "Gamepad2",
 titleKey: "gamedev_title",
 descKey: "gamedev_desc",
 skillKeys: [
 "gamedev_skill1",
 "gamedev_skill2",
 "gamedev_skill3",
 "gamedev_skill4",
 ],
 price: 499,
 currency: "USD",
 },
];

export function getAgeGroup(
 ageMin: number,
 ageMax: number
): "6-9" | "10-13" | "14-18" {
 if (ageMax <= 9) return "6-9";
 if (ageMax <= 13) return "10-13";
 return "14-18";
}
