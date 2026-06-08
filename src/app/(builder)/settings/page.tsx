"use client";

import * as React from "react";
import { Camera, Globe, Key, LogOut, Mail, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/loader";
import { PageHeader, SectionCard } from "@/components/builder/design-system";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = React.useState("Rajesh Kumar");
  const [email, setEmail] = React.useState("rajesh@royalmoments.com");
  const [company, setCompany] = React.useState("Royal Moments Events");
  const [phone, setPhone] = React.useState("+91 98765 43210");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);

  async function handleSaveProfile() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    showToast("Profile updated successfully", "success");
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      showToast("Please fill in all password fields", "error");
      return;
    }
    setChangingPassword(true);
    await new Promise((r) => setTimeout(r, 1000));
    setChangingPassword(false);
    showToast("Password changed successfully", "success");
    setCurrentPassword("");
    setNewPassword("");
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and profile settings"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <SectionCard title="Profile Information" contentClassName="p-5">
            <div className="flex items-center gap-5 pb-5 border-b border-[var(--color-border)]">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <span className="text-xl font-bold">{name.slice(0, 2).toUpperCase()}</span>
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[var(--color-text)]">{name}</p>
                <p className="text-[13px] text-[var(--color-text-secondary)]">{email}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">Company</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} className="h-11 pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving} className="h-10 min-w-36">
                {saving ? <Spinner size="sm" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Change Password" contentClassName="p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">Current Password</label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-text)]">New Password</label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-11" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleChangePassword} disabled={changingPassword} variant="outline" className="h-10 min-w-36">
                {changingPassword ? <Spinner size="sm" /> : <Key className="h-4 w-4" />}
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Account</h2>
              <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">Sign out of your account</p>
              <Button onClick={handleLogout} variant="outline" className="mt-4 h-10 w-full text-[var(--color-danger)] border-red-200 hover:bg-red-50 hover:text-[var(--color-danger)]">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
