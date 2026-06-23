"use client";

import * as React from "react";
import type { LegalPage, ThemeColors } from "./preview-shared";

// ===== LEGAL / CUSTOM PAGES SECTION =====
function LegalPagesSectionBase({
  pages,
  theme,
}: {
  pages: LegalPage[];
  theme: ThemeColors;
}) {
  if (!pages.length) return null;
  return (
    <section className="w-full border-t border-slate-100 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[860px] space-y-12 px-4 sm:px-6 lg:px-8">
        {pages.map((page) => (
          <article key={page.id} id={page.slug} className="scroll-mt-6">
            {/* UI block heading → Primary Text */}
            <h2
              className="mb-5 text-[24px] font-black tracking-tight sm:text-[30px]"
              style={{ color: theme.primaryText }}
            >
              {page.title}
            </h2>
            {/* Terms & Conditions / Privacy body → Paragraph color */}
            <div
              className="space-y-3 text-[14px] leading-7 [&_h1]:mt-6 [&_h1]:text-[20px] [&_h1]:font-black [&_h2]:mt-6 [&_h2]:text-[17px] [&_h2]:font-black [&_h3]:mt-4 [&_h3]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3"
              style={{ color: theme.paragraph }}
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export const LegalPagesSection = React.memo(LegalPagesSectionBase);
