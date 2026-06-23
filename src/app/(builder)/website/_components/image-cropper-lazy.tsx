"use client";

import dynamic from "next/dynamic";

/**
 * Lazy, client-only `ImageCropper`.
 *
 * The cropper pulls in canvas/zoom logic that is only needed once the user
 * actually opens it to crop an upload. Loading it through `next/dynamic` keeps
 * the heavy module out of each builder page's initial route chunk (and out of
 * the dev cold-compile graph), so every page that has an upload control no
 * longer pays for the cropper until it's first rendered.
 *
 * `ssr: false` is safe here — the cropper is a modal that only ever runs in the
 * browser (it manipulates a canvas), and pages render it gated behind `open`.
 */
export const ImageCropper = dynamic(
  () => import("./image-cropper").then((m) => m.ImageCropper),
  { ssr: false },
);
