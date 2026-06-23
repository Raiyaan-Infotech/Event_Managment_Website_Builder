import { StatusPage } from "./status-page";

const DEFAULT_MAINTENANCE_CONTENT =
  "<p>We're currently performing some upgrades to improve your experience.</p><p>Please check back soon.</p>";

/**
 * The shared "Site Under Maintenance" design. Used as the default /maintenance
 * page AND shown in place of the public site whenever the website is
 * unpublished (status !== "published").
 */
export function MaintenanceScreen({
  title = "Maintenance",
  content = DEFAULT_MAINTENANCE_CONTENT,
}: {
  title?: string;
  content?: string;
}) {
  const renderedContent = content.trim() || DEFAULT_MAINTENANCE_CONTENT;

  return (
    <StatusPage
      variant="maintenance"
      title={title}
      showIllustration={false}
      content={
        <div
          className="mx-auto max-w-[620px] text-[13px] font-medium leading-6 text-slate-500 sm:text-[14px] [&_a]:font-bold [&_a]:text-[#5b4bff] [&_h1]:mb-3 [&_h1]:text-[22px] [&_h1]:font-black [&_h1]:text-slate-950 [&_h2]:mb-3 [&_h2]:text-[18px] [&_h2]:font-black [&_h2]:text-slate-950 [&_h3]:mb-2 [&_h3]:font-bold [&_h3]:text-slate-900 [&_img]:mx-auto [&_img]:mb-5 [&_img]:h-auto [&_img]:max-w-full [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-2"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      }
    />
  );
}
