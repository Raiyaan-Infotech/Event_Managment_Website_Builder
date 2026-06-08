"use client";

import * as React from "react";
import { Eye, EyeOff, Globe, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/loader";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }
    setLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    showToast("Logged in successfully", "success");
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--vendor-page-bg)] px-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
            <Globe className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-[28px] font-bold tracking-tight text-[var(--color-text)]">EventCraft</h1>
          <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">Sign in to your vendor dashboard</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-[var(--color-border)]" />
                  <span className="font-medium text-[var(--color-text-secondary)]">Remember me</span>
                </label>
                <button type="button" className="font-semibold text-[var(--color-primary)] hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" disabled={loading} className="h-11 w-full text-[14px]">
                {loading ? <Spinner size="sm" /> : <LogIn className="h-4 w-4" />}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-[13px] text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <button type="button" className="font-semibold text-[var(--color-primary)] hover:underline">
            Contact support
          </button>
        </p>
      </div>
    </div>
  );
}
