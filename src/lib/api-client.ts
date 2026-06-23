"use client";

import { getApiBaseUrl, getVendorPortalLoginUrl } from "@/lib/utils";

let redirectingToLogin = false;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuthRedirect?: boolean;
};

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuthRedirect, ...requestOptions } = options;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...requestOptions,
    credentials: "include",
    headers: {
      ...(requestOptions.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(requestOptions.headers || {}),
    },
    body:
      requestOptions.body instanceof FormData
        ? requestOptions.body
        : requestOptions.body === undefined
          ? undefined
          : JSON.stringify(requestOptions.body),
  });

  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  // Session missing/expired → send the vendor to the portal login instead of
  // surfacing a raw "authentication required" error in the builder UI.
  if (response.status === 401 && !skipAuthRedirect && typeof window !== "undefined") {
    if (!redirectingToLogin) {
      redirectingToLogin = true;
      window.location.replace(getVendorPortalLoginUrl(`${window.location.origin}/`));
    }
    throw new Error(payload.message || "Session expired");
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return (payload.data ?? payload) as T;
}
