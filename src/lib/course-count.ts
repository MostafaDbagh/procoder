/** Localized counts for the public course cards and detail facts. */
export function courseCount(count: number, unit: "lessons" | "weeks", locale: string): string {
 if (locale !== "ar") return `${count} ${unit === "lessons" ? (count === 1 ? "lesson" : "lessons") : (count === 1 ? "week" : "weeks")}`;
 const forms = unit === "lessons"
  ? { one: "درس واحد", two: "درسان", few: "دروس", many: "درساً", other: "درس", zero: "دروس" }
  : { one: "أسبوع واحد", two: "أسبوعان", few: "أسابيع", many: "أسبوعاً", other: "أسبوع", zero: "أسابيع" };
 const rule = new Intl.PluralRules("ar").select(count) as keyof typeof forms;
 if (rule === "one" || rule === "two") return forms[rule];
 return `${new Intl.NumberFormat("ar").format(count)} ${forms[rule]}`;
}
