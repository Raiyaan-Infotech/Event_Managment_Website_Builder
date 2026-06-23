"use client";

import * as React from "react";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  useLoginPublicClient,
  useRegisterPublicClient,
} from "@/hooks/use-website-builder";
import { cn, getClientPortalHandoffUrl } from "@/lib/utils";
import type { AuthPanelContent, ThemeColors } from "./preview-shared";

export type AuthView = "login" | "signup" | "forgot";

/**
 * Left brand panel of the auth modal — logo/name/city plus the vendor-editable
 * marketing copy (eyebrow, title, description, highlight bullets). Exported so
 * the Login Page builder screen can render an identical live preview.
 *
 * Display (`flex` vs `hidden md:flex`) is intentionally left to `className` so
 * the modal can hide it on mobile while the builder preview always shows it.
 */
export function AuthBrandPanel({
  panel,
  theme,
  companyName,
  companyLogo,
  city,
  className,
}: {
  panel: AuthPanelContent;
  theme: ThemeColors;
  companyName: string;
  companyLogo?: string;
  city?: string;
  className?: string;
}) {
  const safeCompanyName = companyName.trim() || "Your account";
  const companyInitial = safeCompanyName.charAt(0).toUpperCase();
  const safeCity = (city || "").trim();

  const backgroundImage =
    panel.showBackgroundImage ? (panel.backgroundImage || "").trim() : "";

  return (
    <aside
      className={cn(
        "relative min-h-[560px] flex-col justify-between overflow-hidden p-8 text-white",
        className,
      )}
      style={{ backgroundColor: theme.primaryButton }}
    >
      {backgroundImage ? (
        // When an image is uploaded it becomes the panel background. A subtle
        // dark gradient keeps the white text readable. With no image the solid
        // brand color (set on the <aside>) shows instead.
        <>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"
          />
        </>
      ) : null}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={safeCompanyName}
              className="h-10 w-10 rounded-[8px] border border-white/25 bg-white/15 object-contain p-1"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/25 bg-white/15 text-[15px] font-black">
              {companyInitial}
            </span>
          )}
          <span className="min-w-0 max-w-[220px]">
            <span className="block truncate text-[14px] font-bold leading-5">
              {safeCompanyName}
            </span>
            {safeCity ? (
              <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {safeCity}
              </span>
            ) : null}
          </span>
        </div>

        <div className="mt-20 max-w-[270px]">
          {panel.eyebrow ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
              {panel.eyebrow}
            </p>
          ) : null}
          {panel.title ? (
            <h2 className="mt-3 text-[28px] font-black leading-[1.15] tracking-[-0.025em]">
              {panel.title}
            </h2>
          ) : null}
          {panel.description ? (
            <p className="mt-4 text-[13px] leading-6 text-white/75 line-clamp-4">
              {panel.description}
            </p>
          ) : null}
        </div>
      </div>

      {panel.bullets.length > 0 ? (
        <ul className="relative z-10 space-y-3 border-t border-white/20 pt-6 text-[12px] font-semibold text-white/85">
          {panel.bullets.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                <Check className="h-3 w-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}

function AuthField({
  id,
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
  disabled,
  autoComplete,
  name,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password" | "tel";
  icon: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  autoComplete?: string;
  name?: string;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="block text-[12px] font-semibold text-[var(--auth-heading)]">
        {label}
      </span>
      <span className="flex h-11 items-center rounded-[8px] border border-slate-200 bg-white transition focus-within:border-[var(--auth-accent)] focus-within:ring-2 focus-within:ring-[var(--auth-accent)]/10">
        <span className="flex h-full w-10 shrink-0 items-center justify-center text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          name={name || id}
          type={inputType}
          value={value ?? ""}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete || "off"}
          data-lpignore="true"
          data-1p-ignore="true"
          className="h-full min-w-0 flex-1 bg-transparent pr-3 text-[13px] text-[var(--auth-heading)] outline-none placeholder:text-slate-400"
        />
        {type === "password" ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="flex h-full w-10 shrink-0 items-center justify-center rounded-r-[8px] text-slate-400 outline-none transition hover:text-slate-700 focus-visible:bg-slate-50 focus-visible:text-slate-700 focus-visible:ring-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        ) : null}
      </span>
    </label>
  );
}

// Preview-only layout. Inputs and buttons intentionally do not submit data.
export function AuthPreviewModal({
  view,
  onChangeView,
  onClose,
  theme,
  panel,
  companyName,
  companyLogo,
  city,
  vendorSlug,
  onNavigate,
}: {
  view: AuthView;
  onChangeView: (view: AuthView) => void;
  onClose: () => void;
  theme: ThemeColors;
  panel: AuthPanelContent;
  companyName: string;
  companyLogo?: string;
  city?: string;
  vendorSlug: string;
  onNavigate?: (href: string) => void;
}) {
  const isLogin = view === "login";
  const isSignup = view === "signup";
  const isForgot = view === "forgot";

  // Forgot-password is OTP based: step 1 = enter email & send OTP,
  // step 2 = enter OTP + new password.
  const [forgotStep, setForgotStep] = React.useState<"email" | "otp">("email");
  const [loginForm, setLoginForm] = React.useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = React.useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const loginClient = useLoginPublicClient();
  const registerClient = useRegisterPublicClient();
  const { showToast } = useToast();
  const noAutofillPrefix = React.useId().replace(/:/g, "");

  React.useEffect(() => {
    if (view !== "forgot") setForgotStep("email");
  }, [view]);
  const forgotOtpStep = isForgot && forgotStep === "otp";

  // Legal links close the auth modal and open the page in the preview.
  const openLegal = (slug: string) => {
    onClose();
    onNavigate?.(`/${slug}`);
  };

  const titleId = React.useId();
  const fieldPrefix = React.useId().replace(/:/g, "");
  const safeCompanyName = companyName.trim() || "Your account";
  const companyInitial = safeCompanyName.charAt(0).toUpperCase();
  const safeCity = (city || "").trim();

  const handleLoginSubmit = async () => {
    const email = loginForm.email.trim().toLowerCase();
    const password = loginForm.password;

    if (!email || !password) {
      showToast("Please enter email and password.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    if (!vendorSlug) {
      showToast("Vendor website is not ready for client login yet.", "error");
      return;
    }

    try {
      const result = await loginClient.mutateAsync({
        vendorSlug,
        email,
        password,
      });
      if (!result.handoff_token) {
        throw new Error("Login handoff token missing.");
      }
      showToast("Login successful. Opening client portal.");
      const handoffUrl = getClientPortalHandoffUrl(result.handoff_token);
      setTimeout(() => {
        window.location.href = handoffUrl;
      }, 1200);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to login. Please try again.",
        "error",
      );
    }
  };

  const getSignupPasswordError = (password: string) => {
    if (!password) return "Password is required.";
    if (/\s/.test(password)) return "Password must not contain spaces.";
    if (password.length !== 8) return "Password must contain exactly 8 characters.";
    if (!/[A-Z]/.test(password)) return "Password must include at least 1 uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must include at least 1 lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must include at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must include at least 1 special character.";
    return "";
  };

  const handleSignupSubmit = async () => {
    const name = signupForm.name.trim();
    const email = signupForm.email.trim().toLowerCase();
    const mobile = signupForm.mobile.trim();
    const password = signupForm.password;

    if (!name || !email || !mobile || !password) {
      showToast("Please fill name, email, mobile number and password.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    if (!/^[0-9+\-\s()]{7,20}$/.test(mobile)) {
      showToast("Please enter a valid mobile number.", "error");
      return;
    }
    const passwordError = getSignupPasswordError(password);
    if (passwordError) {
      showToast(passwordError, "error");
      return;
    }
    if (password !== signupForm.confirmPassword) {
      showToast("Password and confirm password do not match.", "error");
      return;
    }
    if (!signupForm.acceptedTerms) {
      showToast("Please accept Terms & Conditions and Privacy Policy.", "error");
      return;
    }
    if (!vendorSlug) {
      showToast("Vendor website is not ready for registration yet.", "error");
      return;
    }

    try {
      await registerClient.mutateAsync({
        vendorSlug,
        name,
        email,
        mobile,
        password,
        subscribe_newsletter: true,
      });
      setSignupForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        acceptedTerms: false,
      });
      showToast("Account created successfully. Please sign in.");
      onChangeView("login");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to create account. Please try again.",
        "error",
      );
    }
  };

  const handlePrimaryAction = () => {
    if (isLogin) {
      void handleLoginSubmit();
      return;
    }
    if (isSignup) {
      void handleSignupSubmit();
      return;
    }
    if (isForgot && forgotStep === "email") {
      setForgotStep("otp");
    } else if (forgotOtpStep) {
      onChangeView("login");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[2px] sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative grid w-full overflow-hidden rounded-[var(--preview-card-radius)] border border-white/60 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]",
          panel.enabled
            ? "max-w-[820px] md:grid-cols-[0.88fr_1.12fr]"
            : "max-w-[440px] md:min-h-[540px] md:grid-cols-1",
        )}
        style={
          {
            "--auth-accent": theme.primaryButton,
            "--auth-heading": theme.primaryText,
            "--auth-secondary": theme.secondaryText,
            "--auth-paragraph": theme.paragraph,
          } as React.CSSProperties
        }
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication preview"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        {panel.enabled ? (
          <AuthBrandPanel
            panel={panel}
            theme={theme}
            companyName={companyName}
            companyLogo={companyLogo}
            city={city}
            className="hidden md:flex"
          />
        ) : null}

        <div className="max-h-[calc(100dvh-24px)] overflow-y-auto px-5 py-7 sm:px-9 sm:py-9 md:max-h-[min(720px,calc(100dvh-48px))] md:px-10">
          <div className="pr-9">
            <div className="mb-5 flex items-center gap-2.5 md:hidden">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={safeCompanyName}
                  className="h-9 w-9 rounded-[8px] border border-slate-200 object-contain p-1"
                />
              ) : (
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[13px] font-black text-white"
                  style={{ backgroundColor: theme.primaryButton }}
                >
                  {companyInitial}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold text-[var(--auth-heading)]">
                  {safeCompanyName}
                </span>
                {safeCity ? (
                  <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--auth-secondary)]">
                    {safeCity}
                  </span>
                ) : null}
              </span>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--auth-secondary)]">
              {isForgot
                ? "Password help"
                : isLogin
                  ? "Account access"
                  : "New account"}
            </p>
            <h3
              id={titleId}
              className="mt-2 text-[24px] font-black tracking-[-0.025em] text-[var(--auth-heading)]"
            >
              {isForgot
                ? "Reset your password"
                : isLogin
                  ? "Welcome back"
                  : "Create your account"}
            </h3>
            <p className="mt-1.5 text-[12px] leading-5 text-[var(--auth-paragraph)]">
              {isForgot
                ? forgotOtpStep
                  ? "Enter the OTP sent to your email and set a new password."
                  : "Enter your email and we'll send you a one-time password (OTP)."
                : isLogin
                  ? "Enter your details to continue to your account."
                  : "Set up your details to get started."}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {isSignup ? (
              <AuthField
                id={`${fieldPrefix}-name`}
                label="Full name"
                placeholder="Enter your full name"
                icon={<UserRound className="h-4 w-4" />}
                value={signupForm.name}
                onChange={(value) =>
                  setSignupForm((current) => ({ ...current, name: value }))
                }
                disabled={registerClient.isPending}
                name={`${noAutofillPrefix}-signup-name`}
              />
            ) : null}
            {!forgotOtpStep ? (
              <AuthField
                id={`${fieldPrefix}-email`}
                label="Email address"
                placeholder="name@example.com"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                value={isLogin ? loginForm.email : undefined}
                onChange={
                  isLogin
                    ? (value) => setLoginForm((current) => ({ ...current, email: value }))
                    : isSignup
                      ? (value) =>
                          setSignupForm((current) => ({ ...current, email: value }))
                    : undefined
                }
                disabled={
                  (isLogin && loginClient.isPending) ||
                  (isSignup && registerClient.isPending)
                }
                autoComplete="off"
                name={`${noAutofillPrefix}-auth-email`}
              />
            ) : null}
            {isSignup ? (
              <AuthField
                id={`${fieldPrefix}-mobile`}
                label="Mobile number"
                placeholder="Enter your mobile number"
                type="tel"
                icon={<Phone className="h-4 w-4" />}
                value={signupForm.mobile}
                onChange={(value) =>
                  setSignupForm((current) => ({ ...current, mobile: value }))
                }
                disabled={registerClient.isPending}
                name={`${noAutofillPrefix}-signup-mobile`}
              />
            ) : null}
            {forgotOtpStep ? (
              <AuthField
                id={`${fieldPrefix}-otp`}
                label="OTP"
                placeholder="Enter the 6-digit code"
                icon={<ShieldCheck className="h-4 w-4" />}
              />
            ) : null}
            {isLogin || isSignup ? (
              <AuthField
                id={`${fieldPrefix}-password`}
                label="Password"
                placeholder="Enter your password"
                type="password"
                icon={<LockKeyhole className="h-4 w-4" />}
                value={isLogin ? loginForm.password : undefined}
                onChange={
                  isLogin
                    ? (value) => setLoginForm((current) => ({ ...current, password: value }))
                    : isSignup
                      ? (value) =>
                          setSignupForm((current) => ({ ...current, password: value }))
                    : undefined
                }
                disabled={
                  (isLogin && loginClient.isPending) ||
                  (isSignup && registerClient.isPending)
                }
                autoComplete="new-password"
                name={`${noAutofillPrefix}-auth-password`}
              />
            ) : null}
            {isSignup ? (
              <AuthField
                id={`${fieldPrefix}-confirm-password`}
                label="Confirm password"
                placeholder="Enter your password again"
                type="password"
                icon={<LockKeyhole className="h-4 w-4" />}
                value={signupForm.confirmPassword}
                onChange={(value) =>
                  setSignupForm((current) => ({
                    ...current,
                    confirmPassword: value,
                  }))
                }
                disabled={registerClient.isPending}
                autoComplete="new-password"
                name={`${noAutofillPrefix}-signup-confirm-password`}
              />
            ) : null}
            {forgotOtpStep ? (
              <AuthField
                id={`${fieldPrefix}-new-password`}
                label="New password"
                placeholder="Enter your new password"
                type="password"
                icon={<LockKeyhole className="h-4 w-4" />}
              />
            ) : null}

            {isLogin ? (
              <div className="flex items-start justify-between gap-4 text-[11px]">
                <label className="flex cursor-pointer items-start gap-2 leading-4 text-[var(--auth-paragraph)]">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 accent-[var(--auth-accent)]"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => onChangeView("forgot")}
                  className="shrink-0 font-bold text-[var(--auth-accent)]"
                >
                  Forgot password?
                </button>
              </div>
            ) : null}

            {isSignup ? (
              <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-4 text-[var(--auth-paragraph)]">
                <input
                  type="checkbox"
                  checked={signupForm.acceptedTerms}
                  onChange={(event) =>
                    setSignupForm((current) => ({
                      ...current,
                      acceptedTerms: event.target.checked,
                    }))
                  }
                  disabled={registerClient.isPending}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 accent-[var(--auth-accent)]"
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => openLegal("terms-conditions")}
                    className="font-bold text-[var(--auth-accent)] underline underline-offset-2"
                  >
                    Terms &amp; Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => openLegal("privacy-policy")}
                    className="font-bold text-[var(--auth-accent)] underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            ) : null}

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={
                (isLogin && loginClient.isPending) ||
                (isSignup && registerClient.isPending)
              }
              className="h-11 w-full rounded-[8px] text-[13px] font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: theme.primaryButton }}
            >
              {isForgot
                ? forgotOtpStep
                  ? "Reset Password"
                  : "Send OTP"
                : isLogin
                  ? loginClient.isPending
                    ? "Signing in..."
                    : "Sign in"
                  : registerClient.isPending
                    ? "Creating account..."
                    : "Create account"}
            </button>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-[12px] text-[var(--auth-paragraph)]">
              {isForgot ? (
                <>
                  Remembered your password?{" "}
                  <button
                    type="button"
                    onClick={() => onChangeView("login")}
                    className="font-bold text-[var(--auth-accent)]"
                  >
                    Back to sign in
                  </button>
                </>
              ) : (
                <>
                  {isLogin
                    ? "New to this website? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => onChangeView(isLogin ? "signup" : "login")}
                    className="font-bold text-[var(--auth-accent)]"
                  >
                    {isLogin ? "Create an account" : "Sign in"}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
