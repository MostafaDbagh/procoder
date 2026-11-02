# Round 2–29: image loading and initial content visibility

Read-only source audit. Read `AGENTS.md`. Excluded the already-fixed BlogListClient and AnimatedSection. No application edits, runtime performance measurements, or ranking claims.

## 1. Course catalog still hides its primary content on the initial render

**Evidence:** `src/app/[locale]/courses/CoursesClient.tsx:167` wraps the heading, introductory text, and count in `initial={{ opacity: 0, y: 20 }}`. The course grid wrapper at line 301 also starts at opacity zero. Independently, `src/components/CourseCard.tsx:138` starts each card at opacity zero and waits for `whileInView` with a negative viewport margin. Server-fetched catalog data already reaches this component through `CoursesContent.tsx:16`; these animations conceal that available content until client animation work executes.

**Easy win:** Use `initial={false}` on the initial catalog heading/grid and card wrappers. Keep hover interactions and, if desired, transitions after user-triggered filtering. Updating the grid alone will leave its cards hidden.

**Benefit/validation:** Makes the SSR catalog visibly usable before hydration and when JavaScript fails. Verify `/en/courses` and `/ar/courses` with JavaScript disabled and under slow CPU conditions, then verify filter transitions. This is a rendering/accessibility improvement; no assertion that current HTML is uncrawlable or that rankings will change.

## 2. Article cover images do not reserve image height

**Evidence:** `src/app/[locale]/blogs/[slug]/BlogDetailClient.tsx:122–127` renders a raw `<img>` with eager loading and `w-full`, but no width/height attributes, aspect ratio, or fixed-height wrapper. The article body immediately follows the image. The image therefore has no declared intrinsic ratio with which to reserve layout space before its metadata is available.

**Easy win:** Persist/use the actual cover dimensions and provide `width`/`height` with responsive width and automatic height. Alternatively use an intentionally designed aspect-ratio wrapper with appropriate fit behavior. Next Image can additionally supply responsive image variants, but conversion alone does not establish the correct source aspect ratio.

**Benefit/validation:** Avoids article-body movement when the cover arrives. Test a representative image-bearing post with cache disabled and throttled loading. Actual CLS magnitude depends on image timing and viewport and was not measured.

## 3. Desktop-only hero imagery is unconditionally prioritized on mobile

**Evidence:** `src/components/Hero.tsx:62–69` nests a priority Next Image in `hidden sm:block`; `src/app/[locale]/parents/ParentsContent.tsx:96–102` puts the same mobile-hidden styling directly on another priority image. Both images use `sizes="100vw"` with no media-specific resource condition. Their visibility is desktop-only while their priority request configuration is unconditional. The home source image is only about 30 KB, so this is a smaller optimization than the visibility fix above.

**Easy win:** Use media-qualified image selection/preloading for the desktop illustration, ensuring the mobile layout selects no real desktop asset. Retain fast loading for the visible desktop hero. Do not merely remove priority across all viewports without checking desktop rendering.

**Benefit/validation:** Removes unnecessary prioritized mobile-image work. Verify the mobile network waterfall has no request for the hidden hero asset and that the desktop asset still starts promptly. The exact transferred-byte and timing impact needs browser measurement.

## Checked and not raised

- Home hero text starts at opacity one (`Hero.tsx:75`).
- Course-detail cover already has a reserved wrapper, explicit sizes, and priority (`CourseDetailContent.tsx:287–300`).
- ThemeProvider returns its children before mount; it does not blank the SSR page (`ThemeProvider.tsx:46–48`).
- Did not treat intentionally collapsed accordions, modal entry animations, or private dashboard animations as public primary-content defects.
