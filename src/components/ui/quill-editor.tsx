"use client";

import "quill/dist/quill.snow.css";
import React, { useEffect, useRef } from "react";
import type { Delta } from "quill";

interface QuillEditorProps {
  value: string;
  onChange: (data: { html: string; delta: Delta }) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  height?: string | number;
}

const QuillEditor = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  readOnly = false,
  className = "",
  height = "300px",
}: QuillEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<import("quill").default | null>(null);
  const isUpdatingRef = useRef(false);
  const latestValueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;

    const initQuill = async () => {
      const { default: QuillInstance } = await import("quill");

      if (!isMounted || !containerRef.current) return;
      if (containerRef.current.classList.contains("ql-container")) return;

      const quill = new QuillInstance(containerRef.current, {
        theme: "snow",
        placeholder,
        readOnly,
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link", "image", "video"],
              ["blockquote", "code-block"],
              ["clean"],
            ],
          },
        },
      });

      quillRef.current = quill;

      if (latestValueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(latestValueRef.current);
      }
      quill.root.classList.toggle("ql-blank", !quill.getText().trim());

      const handleTextChange = () => {
        if (isUpdatingRef.current) return;

        const html = quill.root.innerHTML;
        const delta = quill.getContents();

        if (html !== latestValueRef.current) {
          onChangeRef.current({ html, delta });
        }
      };

      quill.on("text-change", handleTextChange);
    };

    initQuill();

    const container = containerRef.current;
    return () => {
      isMounted = false;

      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }

      if (container) {
        const wrapper = container.closest(".quill-editor-wrapper");
        if (wrapper) {
          wrapper.querySelectorAll(".ql-toolbar").forEach((toolbar) => toolbar.remove());
        }

        container.innerHTML = "";
        container.classList.remove("ql-container", "ql-snow");
      }
    };
  }, [placeholder, readOnly]);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      isUpdatingRef.current = true;
      const selection = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
      quillRef.current.root.classList.toggle("ql-blank", !quillRef.current.getText().trim());
      if (selection) {
        quillRef.current.setSelection(selection);
      }
      isUpdatingRef.current = false;
    }
  }, [value]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div className={`quill-editor-wrapper ${className}`}>
      <div ref={containerRef} style={{ height }} className="quill-editor-inner" />
    </div>
  );
};

export default QuillEditor;
