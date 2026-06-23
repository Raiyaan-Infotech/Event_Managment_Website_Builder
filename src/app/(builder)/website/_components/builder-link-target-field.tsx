"use client";

import * as React from "react";
import {
  BuilderCountedInput,
  BuilderSegmentedControl,
  BuilderSelectField,
} from "./builder-field";
import type { LinkTargetValue } from "../_lib/link-target";

interface BuilderLinkTargetFieldProps {
  value: LinkTargetValue;
  onChange: (value: LinkTargetValue) => void;
  pageOptions: Array<{ label: string; value: string }>;
  pageLabel?: string;
  customLabel?: string;
  className?: string;
  maxCustomLength?: number;
}

export function BuilderLinkTargetField({
  value,
  onChange,
  pageOptions,
  pageLabel = "Page",
  customLabel = "Custom URL",
  className,
  maxCustomLength = 200,
}: BuilderLinkTargetFieldProps) {
  const typeOptions = React.useMemo(
    () => [
      { label: "Page", value: "page" as const },
      { label: "Custom", value: "custom" as const },
    ],
    [],
  );

  return (
    <div className={className}>
      <BuilderSegmentedControl
        value={value.linkType}
        options={typeOptions}
        onChange={(linkType) =>
          onChange({
            ...value,
            linkType,
            pageId: linkType === "page" ? value.pageId : "",
          })
        }
        layout="grid"
        className="space-y-1"
      />

      <div className="mt-2">
        {value.linkType === "page" ? (
          <BuilderSelectField
            label={pageLabel}
            value={value.pageId}
            onChange={(pageId) => onChange({ ...value, pageId })}
            options={pageOptions}
            placeholder="Select page"
            className="space-y-0.5"
          />
        ) : (
          <BuilderCountedInput
            label={customLabel}
            value={value.customUrl}
            onChange={(customUrl) => onChange({ ...value, customUrl })}
            maxLength={maxCustomLength}
            placeholder="/contact-us or https://example.com"
            className="space-y-0.5"
          />
        )}
      </div>
    </div>
  );
}
