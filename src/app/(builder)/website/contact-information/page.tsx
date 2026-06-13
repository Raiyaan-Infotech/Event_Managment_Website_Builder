"use client";

import * as React from "react";
import { Mail, MapPin, Phone, Plus } from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSegmentedControl,
} from "../_components/builder-field";
import { ToggleField } from "../_components/toggle-field";
import { Button } from "@/components/ui/button";

type ContactKey = "default" | "alternative";

interface ContactData {
  mobile: string;
  email: string;
  address: string;
  active: boolean;
}

const EMPTY_CONTACT: ContactData = { mobile: "", email: "", address: "", active: false };

const INITIAL_CONTACTS: Record<ContactKey, ContactData> = {
  default: {
    mobile: "+1 234 567 8900",
    email: "hello@eventify.com",
    address: "123 Celebration Street, Event City, New York, NY 10001, USA",
    active: true,
  },
  alternative: { ...EMPTY_CONTACT },
};

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-3 sm:p-4 max-w-md";

function hasContactData(contact: ContactData) {
  return Boolean(contact.mobile || contact.email || contact.address);
}

export default function ContactInformationPage() {
  const [contactType, setContactType] = React.useState<ContactKey>("default");
  const [contacts, setContacts] =
    React.useState<Record<ContactKey, ContactData>>(INITIAL_CONTACTS);
  const [isEditing, setIsEditing] = React.useState<Record<ContactKey, boolean>>({
    default: false,
    alternative: false,
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const contact = contacts[contactType];
  const editing = isEditing[contactType];

  const updateContact = (patch: Partial<ContactData>) => {
    setContacts((prev) => ({
      ...prev,
      [contactType]: {
        ...prev[contactType],
        ...patch,
      },
    }));
  };

  const startEdit = () =>
    setIsEditing((prev) => ({ ...prev, [contactType]: true }));

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing((prev) => ({ ...prev, [contactType]: false }));
    }, 800);
  };

  const handleCancel = () => {
    setContacts(INITIAL_CONTACTS);
    setIsEditing({ default: false, alternative: false });
    setContactType("default");
  };

  const viewContent = hasContactData(contact) ? (
    <>
      {contact.active ? (
        <div className="flex w-full justify-end">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
            Active
          </span>
        </div>
      ) : null}

      <div className="w-full space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
            <Phone className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-black text-[var(--vendor-text)]">Mobile</p>
            <p className="text-[12px] text-[var(--vendor-text-muted)]">{contact.mobile}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
            <Mail className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-black text-[var(--vendor-text)]">Email</p>
            <p className="text-[12px] text-[var(--vendor-text-muted)]">{contact.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-black text-[var(--vendor-text)]">Address</p>
            <p className="text-[12px] text-[var(--vendor-text-muted)]">{contact.address}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end border-t border-[var(--vendor-border)] pt-3">
        <Button type="button" onClick={startEdit}>
          Edit
        </Button>
      </div>
    </>
  ) : (
    <div className="flex w-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--vendor-primary-btn)]/15">
          <Phone className="h-4 w-4 text-[var(--vendor-primary-btn)]" />
          <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)] text-white">
            <Plus className="h-3 w-3" />
          </span>
        </div>
      </div>
      <p className="text-[14px] font-black text-[var(--vendor-text)]">
        No contact information added yet
      </p>
      <p className="mt-1 max-w-[280px] text-[12px] text-[var(--vendor-text-muted)]">
        Add your phone number, email and address so your visitors can reach you easily.
      </p>
      <Button type="button" onClick={startEdit} className="mt-4 gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Add {contactType === "default" ? "Default" : "Alternative"} Contact
      </Button>
    </div>
  );

  const editContent = (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BuilderCountedInput
          label="Mobile"
          required
          value={contact.mobile}
          onChange={(mobile) => updateContact({ mobile })}
          maxLength={30}
          placeholder="+1 234 567 8900"
          className="space-y-0.5"
        />
        <BuilderCountedInput
          label="Email"
          required
          value={contact.email}
          onChange={(email) => updateContact({ email })}
          maxLength={100}
          placeholder="hello@example.com"
          className="space-y-0.5"
        />
      </div>

      <BuilderCountedTextarea
        label="Address"
        required
        value={contact.address}
        onChange={(address) => updateContact({ address })}
        maxLength={200}
        placeholder="123 Street, City, State, ZIP, Country"
        textareaClassName="min-h-[64px] resize-y"
        className="space-y-0.5"
      />

      <ToggleField
        label="Show Contact"
        description="Enable this contact profile on your website."
        checked={contact.active}
        onCheckedChange={(active) => updateContact({ active })}
      />
    </>
  );

  const form = (
    <FormSection
      title="Contact Information"
      subtitle="Manage the phone, email, and address shown on your website."
      icon={<Phone className="h-4 w-4" />}
      className={card}
    >
      <BuilderSegmentedControl<ContactKey>
        label="Contact Type"
        value={contactType}
        onChange={setContactType}
        options={[
          { label: "Default", value: "default" },
          { label: "Alternative", value: "alternative" },
        ]}
        layout="grid"
      />

      {editing ? editContent : viewContent}
    </FormSection>
  );

  return (
    <WebsiteBuilderLayout
      title="Contact Information"
      form={form}
      onCancel={handleCancel}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={
        editing
          ? {
              label: "Save Changes",
              onClick: handleSave,
              isLoading: isSaving,
            }
          : undefined
      }
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to manage contact information.")
      }
    />
  );
}