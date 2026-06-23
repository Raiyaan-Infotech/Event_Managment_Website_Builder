import {
  ArrowLeft,
  Clock,
  Construction,
  FileText,
  FolderOpen,
  Globe,
  HelpCircle,
  Home,
  Mail,
  Plus,
  RefreshCcw,
  Settings,
  ShieldQuestion,
  Wifi,
  X,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusPageVariant = "not-found" | "offline" | "empty" | "maintenance";

type StatusAction = {
  label: string;
  href: string;
  icon?: "home" | "globe" | "refresh" | "plus" | "back";
  variant?: "primary" | "outline";
};

type StatusInfo = {
  icon?: "help" | "refresh" | "idea" | "clock";
  title: string;
  description: string;
  href?: string;
};

type SocialAction = {
  icon: "facebook" | "twitter" | "linkedin" | "mail";
  href: string;
  label: string;
};

const actionIcons = {
  home: Home,
  globe: Globe,
  refresh: RefreshCcw,
  plus: Plus,
  back: ArrowLeft,
};

const infoIcons = {
  help: HelpCircle,
  refresh: RefreshCcw,
  idea: ShieldQuestion,
  clock: Clock,
};

const socialLabels = {
  facebook: "f",
  twitter: "t",
  linkedin: "in",
  mail: "@",
};

function ActionButton({
  action,
}: {
  action: StatusAction;
}) {
  const Icon = action.icon ? actionIcons[action.icon] : null;
  const isPrimary = action.variant !== "outline";

  return (
    <Link
      href={action.href}
      className={cn(
        "inline-flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-[6px] px-4 text-[13px] font-bold transition focus:outline-none focus:ring-4 focus:ring-[#5b4bff]/15",
        isPrimary
          ? "bg-[#5b4bff] text-white shadow-lg shadow-[#5b4bff]/20 hover:bg-[#4938ee]"
          : "border border-slate-200 bg-white text-slate-950 shadow-sm hover:bg-slate-50",
      )}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {action.label}
    </Link>
  );
}

function InfoPanel({ info }: { info: StatusInfo }) {
  const Icon = info.icon ? infoIcons[info.icon] : HelpCircle;
  const content = (
    <div className="mx-auto flex w-full max-w-[540px] items-center gap-4 rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 text-left shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#5b4bff] shadow-sm">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-black text-slate-950">
          {info.title}
        </span>
        <span className="mt-1 block text-[12px] font-medium leading-5 text-slate-500">
          {info.description}
        </span>
      </span>
    </div>
  );

  if (!info.href) return content;

  return (
    <Link href={info.href} className="block">
      {content}
    </Link>
  );
}

function StatusIllustration({ variant }: { variant: StatusPageVariant }) {
  if (variant === "offline") {
    return (
      <div className="relative mx-auto h-[170px] w-full max-w-[400px] sm:h-[190px]">
        <div className="absolute left-1/2 top-9 h-24 w-72 -translate-x-1/2 rounded-[48px] bg-[#f2f3ff]" />
        <div className="absolute left-1/2 top-3 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#ebe9ff] text-[#6657ff]">
          <Wifi className="h-12 w-12" />
        </div>
        <div className="absolute left-1/2 top-[94px] h-12 w-48 -translate-x-1/2 rounded-[14px] bg-gradient-to-b from-[#8273ff] to-[#5440e7] shadow-lg shadow-[#5b4bff]/25">
          <div className="absolute left-6 top-5 h-1.5 w-20 rounded-full bg-white/70" />
          <div className="absolute right-14 top-4 h-4 w-4 rounded-full bg-slate-700/70" />
          <div className="absolute right-8 top-4 h-4 w-4 rounded-full bg-slate-700/70" />
          <div className="absolute bottom-[-10px] left-8 h-3 w-3 rounded-full bg-[#c9c4ff]" />
          <div className="absolute bottom-[-10px] right-8 h-3 w-3 rounded-full bg-[#c9c4ff]" />
        </div>
        <div className="absolute left-[calc(50%+84px)] top-[93px] flex h-11 w-11 items-center justify-center rounded-full bg-[#ff6477] text-white shadow-lg shadow-[#ff6477]/25">
          <X className="h-6 w-6" />
        </div>
        <div className="absolute left-[22%] top-11 h-2 w-2 rotate-45 rounded-[2px] border border-[#9b8dff]" />
        <div className="absolute right-[18%] top-16 h-2 w-2 rotate-45 rounded-[2px] border border-[#9b8dff]" />
      </div>
    );
  }

  if (variant === "empty") {
    return (
      <div className="relative mx-auto h-[170px] w-full max-w-[400px] sm:h-[190px]">
        <div className="absolute left-1/2 top-9 h-24 w-72 -translate-x-1/2 rounded-[48px] bg-[#f2f3ff]" />
        <FolderOpen className="absolute left-1/2 top-[74px] h-28 w-28 -translate-x-1/2 text-[#7b6dff]" />
        <FileText className="absolute left-[calc(50%+8px)] top-9 h-24 w-24 -rotate-[-12deg] text-[#c9c4ff]" />
        <div className="absolute left-[28%] top-14 h-1.5 w-1.5 rounded-full bg-[#9b8dff]" />
        <div className="absolute right-[27%] top-16 h-1.5 w-1.5 rounded-full bg-[#9b8dff]" />
        <div className="absolute left-[22%] top-20 h-7 w-1 rotate-[-35deg] rounded-full bg-[#9b8dff]/60" />
        <div className="absolute right-[23%] top-20 h-7 w-1 rotate-[35deg] rounded-full bg-[#9b8dff]/60" />
      </div>
    );
  }

  if (variant === "maintenance") {
    return (
      <div className="relative mx-auto h-[170px] w-full max-w-[420px] sm:h-[190px]">
        <div className="absolute left-1/2 top-10 h-24 w-72 -translate-x-1/2 rounded-[48px] bg-[#f2f3ff]" />
        <div className="absolute left-1/2 top-5 h-28 w-40 -translate-x-1/2 rounded-[10px] border border-[#d8d4ff] bg-white shadow-sm">
          <div className="flex h-6 items-center gap-1.5 rounded-t-[10px] bg-[#d8d4ff] px-3">
            <span className="h-2 w-2 rounded-full bg-[#ff6b7d]" />
            <span className="h-2 w-2 rounded-full bg-[#ffb020]" />
            <span className="h-2 w-2 rounded-full bg-[#2ec27e]" />
          </div>
          <Settings className="mx-auto mt-5 h-14 w-14 text-[#9b8dff]" />
        </div>
        <Construction className="absolute left-[21%] top-[106px] h-20 w-20 text-[#2f3c66]" />
        <div className="absolute right-[22%] top-[98px] h-20 w-8">
          <div className="mx-auto h-20 w-2 rounded-full bg-[#ff9f2f]" />
          <div className="absolute bottom-0 left-0 h-3 w-8 rounded-sm bg-[#ff8a1f]" />
          <div className="absolute bottom-5 left-1 h-3 w-6 rounded-sm bg-[#ffb461]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[170px] w-full max-w-[420px] sm:h-[190px]">
      <div className="absolute left-1/2 top-11 h-24 w-72 -translate-x-1/2 rounded-[48px] bg-[#f2f3ff]" />
      <div className="absolute inset-x-0 top-7 text-center text-[94px] font-black leading-none tracking-normal text-[#5b4bff] sm:text-[118px]">
        404
      </div>
      <div className="absolute left-1/2 top-[82px] flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-[28px] border-[8px] border-[#d8d4ff] bg-white shadow-lg shadow-[#5b4bff]/15">
        <div className="flex h-9 w-12 items-center justify-center gap-2 rounded-[12px] bg-[#4a56a8]">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>
      <div className="absolute left-[14%] top-[110px] h-12 w-2 rounded-full bg-[#c9c4ff]" />
      <div className="absolute left-[12%] top-[126px] h-8 w-1 rotate-[42deg] rounded-full bg-[#c9c4ff]" />
      <div className="absolute right-[14%] top-[110px] h-12 w-2 rounded-full bg-[#c9c4ff]" />
      <div className="absolute right-[12%] top-[126px] h-8 w-1 rotate-[-42deg] rounded-full bg-[#c9c4ff]" />
    </div>
  );
}

export function StatusPage({
  variant,
  title,
  description,
  content,
  showIllustration = true,
  supportText,
  topAction,
  actions = [],
  info,
  socials,
  embedded = false,
}: {
  variant: StatusPageVariant;
  title: string;
  description?: string;
  content?: ReactNode;
  showIllustration?: boolean;
  supportText?: string;
  topAction?: StatusAction;
  actions?: StatusAction[];
  info?: StatusInfo;
  socials?: SocialAction[];
  embedded?: boolean;
}) {
  return (
    <main
      className={cn(
        "bg-white text-slate-950",
        embedded
          ? "flex h-full min-h-[calc(100vh-92px)] w-full rounded-[8px]"
          : "min-h-screen",
      )}
    >
      <section
        className={cn(
          "flex w-full flex-col",
          embedded ? "min-h-full" : "min-h-screen",
        )}
      >
        {topAction ? (
          <header className="flex items-center justify-end px-4 py-4 sm:px-7">
            <ActionButton action={{ ...topAction, variant: "outline" }} />
          </header>
        ) : null}

        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-2 text-center sm:px-8 sm:pb-10">
          {showIllustration ? <StatusIllustration variant={variant} /> : null}

          <div className={cn("mx-auto max-w-[560px]", showIllustration ? "mt-2" : "mt-0")}>
            <h1 className="text-[26px] font-black leading-tight text-slate-950 sm:text-[32px]">
              {title}
            </h1>
            {description ? (
              <p className="mx-auto mt-3 max-w-[500px] text-[13px] font-medium leading-6 text-slate-500 sm:text-[14px]">
                {description}
              </p>
            ) : null}
            {content ? <div className="mt-3">{content}</div> : null}
            {supportText ? (
              <p className="mx-auto mt-1 max-w-[500px] text-[13px] font-medium leading-6 text-slate-500">
                {supportText}
              </p>
            ) : null}
          </div>

          {actions.length > 0 ? (
            <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              {actions.map((action) => (
                <ActionButton key={action.label} action={action} />
              ))}
            </div>
          ) : null}

          {info ? (
            <div className="mt-8 w-full">
              <InfoPanel info={info} />
            </div>
          ) : null}

          {socials ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[13px] font-black text-slate-500 transition hover:bg-[#5b4bff] hover:text-white"
                >
                  {socialLabels[social.icon]}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
