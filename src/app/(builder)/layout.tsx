import { WebsiteBuilderShell } from "@/components/builder/website-builder-shell";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WebsiteBuilderShell>{children}</WebsiteBuilderShell>;
}