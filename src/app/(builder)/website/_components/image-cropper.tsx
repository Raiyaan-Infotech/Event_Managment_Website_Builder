"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImageBase64: string) => void;
  aspectRatio?: number;
  outputWidth?: number;
  outputHeight?: number;
  outputType?: "image/png" | "image/jpeg" | "image/webp";
  outputQuality?: number;
  title?: string;
}

export function ImageCropper({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  outputWidth = 400,
  outputHeight = 400,
  outputType = "image/jpeg",
  outputQuality = 0.92,
  title = "Crop Image",
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 480, h: 480 });
  const [cropBox, setCropBox] = useState({ width: 320, height: 320 });

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setImgLoaded(false);
  }, [imageSrc, open]);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const width = Math.min(containerRef.current.clientWidth - 32, 480);
    const height = Math.round(width * 0.78);
    const safeHeight = Math.max(height, 320);
    const boxWidth = Math.round(width * 0.76);
    const boxHeight = Math.round(boxWidth / aspectRatio);

    let finalWidth = boxWidth;
    let finalHeight = boxHeight;
    if (finalHeight > safeHeight * 0.76) {
      finalHeight = Math.round(safeHeight * 0.76);
      finalWidth = Math.round(finalHeight * aspectRatio);
    }

    setCanvasSize({ w: width, h: safeHeight });
    setCropBox({ width: finalWidth, height: finalHeight });
  }, [aspectRatio, open]);

  useEffect(() => {
    if (!imageSrc || !open) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc, open]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = canvasSize;
    canvas.width = w;
    canvas.height = h;

    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const imgW = img.naturalWidth * scale;
    const imgH = img.naturalHeight * scale;
    const imgX = w / 2 - imgW / 2 + offset.x;
    const imgY = h / 2 - imgH / 2 + offset.y;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, imgX, imgY, imgW, imgH);

    const cropX = (w - cropBox.width) / 2;
    const cropY = (h - cropBox.height) / 2;

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, w, cropY);
    ctx.fillRect(0, cropY + cropBox.height, w, h);
    ctx.fillRect(0, cropY, cropX, cropBox.height);
    ctx.fillRect(cropX + cropBox.width, cropY, w, cropBox.height);

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropBox.width, cropBox.height);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    const thirdW = cropBox.width / 3;
    const thirdH = cropBox.height / 3;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cropX + thirdW * i, cropY);
      ctx.lineTo(cropX + thirdW * i, cropY + cropBox.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cropX, cropY + thirdH * i);
      ctx.lineTo(cropX + cropBox.width, cropY + thirdH * i);
      ctx.stroke();
    }

    const handleSize = 14;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ([
      [cropX, cropY, 1, 1],
      [cropX + cropBox.width, cropY, -1, 1],
      [cropX, cropY + cropBox.height, 1, -1],
      [cropX + cropBox.width, cropY + cropBox.height, -1, -1],
    ] as [number, number, number, number][]).forEach(([cx, cy, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy + dy * handleSize);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dx * handleSize, cy);
      ctx.stroke();
    });

    const label = `${outputWidth} x ${outputHeight} px`;
    ctx.font = "bold 11px system-ui, sans-serif";
    const labelW = ctx.measureText(label).width + 16;
    const labelH = 22;
    const labelX = cropX + cropBox.width / 2 - labelW / 2;
    const labelY = cropY + cropBox.height - labelH - 8;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(labelX, labelY, labelW, labelH, 4);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, cropX + cropBox.width / 2, labelY + labelH / 2);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }, [canvasSize, cropBox.height, cropBox.width, imgLoaded, offset.x, offset.y, outputHeight, outputWidth, zoom]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = event.touches[0];
    setOffset({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const { w, h } = canvasSize;
    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const imgX = w / 2 - (img.naturalWidth * scale) / 2 + offset.x;
    const imgY = h / 2 - (img.naturalHeight * scale) / 2 + offset.y;
    const cropX = (w - cropBox.width) / 2;
    const cropY = (h - cropBox.height) / 2;
    const srcX = (cropX - imgX) / scale;
    const srcY = (cropY - imgY) / scale;
    const srcW = cropBox.width / scale;
    const srcH = cropBox.height / scale;

    const out = document.createElement("canvas");
    out.width = outputWidth;
    out.height = outputHeight;
    const ctx = out.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outputWidth, outputHeight);
    onCropComplete(out.toDataURL(outputType, outputQuality));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-[var(--vendor-radius-panel)] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--vendor-border)] px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-[var(--vendor-text)]">{title}</h3>
            <p className="mt-0.5 text-xs text-[var(--vendor-text-muted)]">
              Drag to reposition. Use scroll or slider to zoom. Output:
              <span className="ml-1 font-semibold text-[var(--vendor-primary-btn)]">
                {outputWidth} x {outputHeight} px
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--vendor-text-muted)] transition-colors hover:bg-gray-100 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative flex select-none items-center justify-center bg-black"
          style={{ minHeight: canvasSize.h }}
        >
          {!imgLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--vendor-primary-btn)] border-t-transparent" />
            </div>
          ) : null}

          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            className={`touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ display: imgLoaded ? "block" : "none" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onWheel={(event) => {
              event.preventDefault();
              setZoom((current) => Math.min(4, Math.max(0.5, current - event.deltaY * 0.002)));
            }}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--vendor-border)] bg-gray-50 px-5 py-3">
          <button
            onClick={() => setZoom((current) => Math.max(0.5, current - 0.1))}
            className="rounded-[var(--vendor-radius-control)] p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-[var(--vendor-primary-btn)]"
          >
            <ZoomOut size={16} />
          </button>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="flex-1 accent-blue-600"
          />
          <button
            onClick={() => setZoom((current) => Math.min(4, current + 0.1))}
            className="rounded-[var(--vendor-radius-control)] p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-[var(--vendor-primary-btn)]"
          >
            <ZoomIn size={16} />
          </button>
          <span className="w-10 text-right font-mono text-xs text-[var(--vendor-text-muted)]">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--vendor-border)] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--vendor-primary-btn-hover)]"
          >
            <Check size={15} strokeWidth={3} />
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}
