import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1").replace(/\/+$/, "");
}

export function getBackendBaseUrl() {
  return getApiBaseUrl().replace(/\/api\/v\d+$/i, "");
}

export function resolveMediaUrl(value?: string | null) {
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;
  return `${getBackendBaseUrl()}${value.startsWith("/") ? "" : "/"}${value}`;
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export async function dataUrlToFile(dataUrl: string, fileName: string, fallbackType = "image/jpeg") {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || fallbackType });
}

export function getVendorPortalUrl() {
  return (process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || "http://localhost:3001").replace(/\/+$/, "");
}

export function getVendorPortalLoginUrl(returnUrl?: string) {
  const loginUrl = new URL("/login", getVendorPortalUrl());
  if (returnUrl) loginUrl.searchParams.set("returnUrl", returnUrl);
  return loginUrl.toString();
}

export function getClientPortalUrl() {
  return (process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || "http://localhost:3004").replace(/\/+$/, "");
}

export function getClientPortalHandoffUrl(token: string) {
  const handoffUrl = new URL("/api/clients/auth/handoff", getClientPortalUrl());
  handoffUrl.searchParams.set("token", token);
  return handoffUrl.toString();
}
