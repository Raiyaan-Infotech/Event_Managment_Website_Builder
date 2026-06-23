"use client";

import * as React from "react";
import { ImageIcon, ListChecks, PanelLeft, Plus, Trash2 } from "lucide-react";
import { OutlineButton } from "@/components/ui/button";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
} from "../_components/builder-field";
import { ToggleField } from "../_components/toggle-field";
import { ImageUpload } from "../_components/image-upload";
import { ImageCropper } from "../_components/image-cropper-lazy";
import {
  useSaveWebsiteSettings,
  useUploadVendorMedia,
  useVendorAbout,
  useWebsiteBuilderData,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import { dataUrlToFile, fileToDataUrl, resolveMediaUrl } from "@/lib/utils";
import { AuthBrandPanel } from "@/components/website-preview/sections/auth-preview-modal";
import {
  type AnyRecord,
  type AuthPanelContent,
  DEFAULT_AUTH_PANEL,
  buildAuthPanel,
  parseRecord,
  parseThemeColors,
  stringValue,
} from "@/components/website-preview/sections/preview-shared";

const MAX_BULLETS = 5;
const EYEBROW_MAX = 40;
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 100;
const BULLET_MAX = 40;

type BulletRow = { id: string; text: string };

let bulletIdCounter = 0;
const makeBullet = (text: string): BulletRow => ({
  id: `bullet-${Date.now()}-${bulletIdCounter++}`,
  text,
});

export default function WebsiteLoginPagePage() {
  const { data: builderData } = useWebsiteBuilderData();
  const { data: vendorAbout } = useVendorAbout();
  const saveWebsiteSettings = useSaveWebsiteSettings();
  const uploadMedia = useUploadVendorMedia();
  const { showToast } = useToast();

  const loadedRef = React.useRef(false);
  const [enabled, setEnabled] = React.useState(DEFAULT_AUTH_PANEL.enabled);
  const [eyebrow, setEyebrow] = React.useState(DEFAULT_AUTH_PANEL.eyebrow);
  const [title, setTitle] = React.useState(DEFAULT_AUTH_PANEL.title);
  const [description, setDescription] = React.useState(
    DEFAULT_AUTH_PANEL.description,
  );
  const [bullets, setBullets] = React.useState<BulletRow[]>([]);
  const [showBackgroundImage, setShowBackgroundImage] = React.useState(
    DEFAULT_AUTH_PANEL.showBackgroundImage,
  );
  const [backgroundImage, setBackgroundImage] = React.useState(
    DEFAULT_AUTH_PANEL.backgroundImage,
  );
  const [imageToCrop, setImageToCrop] = React.useState("");
  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(
    null,
  );
  const [isSaving, setIsSaving] = React.useState(false);

  // Load saved values once, mirroring the same fallbacks the preview uses so the
  // form starts from exactly what visitors currently see.
  React.useEffect(() => {
    if (loadedRef.current || !builderData) return;
    const panel = buildAuthPanel(builderData);
    setEnabled(panel.enabled);
    setEyebrow(panel.eyebrow);
    setTitle(panel.title);
    setDescription(panel.description);
    setBullets(panel.bullets.map((text) => makeBullet(text)));
    setShowBackgroundImage(panel.showBackgroundImage);
    setBackgroundImage(panel.backgroundImage);
    loadedRef.current = true;
  }, [builderData]);

  const handleBackgroundSelect = async (file: File) => {
    try {
      setPendingImageFile(file);
      setImageToCrop(await fileToDataUrl(file));
    } catch {
      showToast("Unable to read image", "error");
    }
  };

  const handleBackgroundCropComplete = async (croppedBase64: string) => {
    const sourceFile = pendingImageFile;
    setImageToCrop("");
    setPendingImageFile(null);
    if (!sourceFile) return;
    try {
      const extension = sourceFile.type === "image/png" ? ".png" : ".jpg";
      const croppedFile = await dataUrlToFile(
        croppedBase64,
        `${sourceFile.name.replace(/\.[^.]+$/, "")}-login${extension}`,
        sourceFile.type || "image/jpeg",
      );
      const uploaded = await uploadMedia.mutateAsync({
        file: croppedFile,
        folder: "website/login",
      });
      setBackgroundImage(uploaded.url);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to upload image",
        "error",
      );
    }
  };

  const canAddBullet = bullets.length < MAX_BULLETS;

  const addBullet = () => {
    if (!canAddBullet) return;
    setBullets((prev) => [...prev, makeBullet("")]);
  };

  const updateBullet = (id: string, text: string) => {
    setBullets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const removeBullet = (id: string) => {
    setBullets((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    const website = builderData?.website as AnyRecord | null | undefined;
    const existingSettings = parseRecord(website?.settings_json);
    setIsSaving(true);
    try {
      await saveWebsiteSettings.mutateAsync({
        // settings_json is a full-replace JSON blob — spread the existing keys
        // (colors, palette_id, status, …) so we only add/replace authPanel.
        settings_json: {
          ...existingSettings,
          authPanel: {
            enabled,
            eyebrow: eyebrow.trim(),
            title: title.trim(),
            description: description.trim(),
            bullets: bullets.map((item) => item.text.trim()).filter(Boolean),
            showBackgroundImage,
            backgroundImage: backgroundImage.trim(),
          },
        },
        is_active: true,
      });
      showToast("Login page saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save login page",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnabled(DEFAULT_AUTH_PANEL.enabled);
    setEyebrow(DEFAULT_AUTH_PANEL.eyebrow);
    setTitle(DEFAULT_AUTH_PANEL.title);
    setDescription(DEFAULT_AUTH_PANEL.description);
    setBullets(DEFAULT_AUTH_PANEL.bullets.map((text) => makeBullet(text)));
    setShowBackgroundImage(DEFAULT_AUTH_PANEL.showBackgroundImage);
    setBackgroundImage(DEFAULT_AUTH_PANEL.backgroundImage);
  };

  // ── Live preview data ──────────────────────────────────────────────────────
  const theme = parseThemeColors(builderData);
  const basicInformation = (builderData?.basicInformation || {}) as AnyRecord;
  const companyName = stringValue(
    vendorAbout?.company_name,
    basicInformation.company_name,
    "Your Company",
  );
  const city = stringValue(
    vendorAbout?.locality?.name,
    vendorAbout?.district?.name,
    vendorAbout?.city,
    basicInformation.city,
  );
  const companyLogo = resolveMediaUrl(stringValue(vendorAbout?.company_logo));

  const previewPanel: AuthPanelContent = {
    enabled,
    eyebrow: eyebrow.trim() || DEFAULT_AUTH_PANEL.eyebrow,
    title: title.trim() || DEFAULT_AUTH_PANEL.title,
    description: description.trim() || DEFAULT_AUTH_PANEL.description,
    bullets: bullets.map((item) => item.text.trim()).filter(Boolean),
    showBackgroundImage,
    backgroundImage: resolveMediaUrl(backgroundImage),
  };

  const form = (
    <div className="space-y-4">
      <ToggleField
        label="Show side panel"
        description="When off, the login / get started popup shows only the form (no branded side panel)."
        checked={enabled}
        onCheckedChange={setEnabled}
      />

      <FormSection
        title="Side Panel Content"
        subtitle="The marketing copy shown beside the login form."
        icon={<PanelLeft className="h-4 w-4" />}
      >
        <BuilderCountedInput
          label="Eyebrow label"
          value={eyebrow}
          onChange={setEyebrow}
          maxLength={EYEBROW_MAX}
          placeholder="Event workspace"
        />
        <BuilderCountedInput
          label="Title"
          value={title}
          onChange={setTitle}
          maxLength={TITLE_MAX}
          placeholder="Everything for your event, in one place."
        />
        <BuilderCountedTextarea
          label="Description"
          value={description}
          onChange={setDescription}
          maxLength={DESCRIPTION_MAX}
          placeholder="Manage enquiries, bookings and event details from one secure account."
        />
      </FormSection>

      <FormSection
        title="Background Image"
        subtitle="Optional image shown behind the panel, tinted by your brand color. Leave empty to use the solid color only."
        icon={<ImageIcon className="h-4 w-4" />}
      >
        <ToggleField
          label="Use background image"
          description="When on, the uploaded image is shown as the panel background. When off, the solid brand color is used."
          checked={showBackgroundImage}
          onCheckedChange={setShowBackgroundImage}
        />
        {showBackgroundImage ? (
          <ImageUpload
            label="Panel background"
            value={resolveMediaUrl(backgroundImage)}
            recommendedSize="900x1200px"
            maxSizeMb={2}
            onFileSelect={handleBackgroundSelect}
            onRemove={() => setBackgroundImage("")}
            alt="Login panel background"
          />
        ) : null}
      </FormSection>

      <FormSection
        title="Highlights"
        subtitle={`Up to ${MAX_BULLETS} short bullet points with a check icon.`}
        icon={<ListChecks className="h-4 w-4" />}
      >
        <div className="space-y-2">
          {bullets.length === 0 ? (
            <p className="rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] px-3 py-2 text-[11px] text-[var(--vendor-text-muted)]">
              No highlights — the bullet list is hidden on the panel.
            </p>
          ) : (
            bullets.map((bullet, index) => (
              <div key={bullet.id} className="flex items-center gap-2">
                <BuilderCountedInput
                  value={bullet.text}
                  onChange={(value) => updateBullet(bullet.id, value)}
                  maxLength={BULLET_MAX}
                  placeholder={`Highlight ${index + 1}`}
                  showCount={false}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeBullet(bullet.id)}
                  aria-label="Remove highlight"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[var(--vendor-border)] text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}

          {canAddBullet ? (
            <OutlineButton
              type="button"
              size="sm"
              onClick={addBullet}
              className="h-8 w-full gap-1.5 text-[11px]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add highlight
            </OutlineButton>
          ) : null}
        </div>
      </FormSection>
    </div>
  );

  const preview = (
    <div className="flex justify-center p-3">
      {enabled ? (
        <div className="w-full max-w-[360px] overflow-hidden rounded-[16px] shadow-lg">
          <AuthBrandPanel
            panel={previewPanel}
            theme={theme}
            companyName={companyName}
            companyLogo={companyLogo}
            city={city}
            className="flex"
          />
        </div>
      ) : (
        <div className="flex min-h-[300px] w-full max-w-[360px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-6 text-center">
          <PanelLeft className="h-6 w-6 text-[var(--vendor-text-muted)]" />
          <p className="mt-2 text-[12px] font-bold text-[var(--vendor-text)]">
            Side panel hidden
          </p>
          <p className="mt-1 text-[11px] text-[var(--vendor-text-muted)]">
            The login popup will show only the form.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Login Page"
        subtitle="Configure the side panel of the login / get started popup."
        breadcrumbs={[{ label: "Website" }, { label: "Login Page" }]}
        form={form}
        preview={preview}
        previewTitle="Login Modal Preview"
        previewSubtitle="The branded side panel shown on the login / get started popup."
        previewTip="Logo, company name and city come from your Header & profile — only the copy here is editable."
        onReset={handleReset}
        primaryButton={{
          label: "Save",
          onClick: handleSave,
          isLoading: isSaving,
        }}
      />
      <ImageCropper
        open={Boolean(imageToCrop)}
        imageSrc={imageToCrop}
        onClose={() => {
          setImageToCrop("");
          setPendingImageFile(null);
        }}
        onCropComplete={handleBackgroundCropComplete}
        aspectRatio={3 / 4}
        outputWidth={900}
        outputHeight={1200}
        title="Crop Background Image"
      />
    </>
  );
}
