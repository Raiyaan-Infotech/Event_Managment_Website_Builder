"use client";

import * as React from "react";
import { StatusLoader } from "@/components/status-pages/status-loader";
import { getVendorPortalLoginUrl } from "@/lib/utils";

export default function LoginRedirectPage() {
  React.useEffect(() => {
    window.location.replace(getVendorPortalLoginUrl(`${window.location.origin}/`));
  }, []);

  return <StatusLoader message="Redirecting to vendor portal..." />;
}
