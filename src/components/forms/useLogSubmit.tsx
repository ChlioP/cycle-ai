"use client";

import { FormEvent, useState } from "react";

export function useLogSubmit(label: string, persist: (form: HTMLFormElement) => Promise<void>) {
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState(`${label} saved privately`);
  const [error, setError] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await persist(event.currentTarget);
      setMessage(`${label} saved privately`);
      setError(false);
    } catch {
      setMessage(`Unable to save ${label.toLowerCase()}. Please try again.`);
      setError(true);
    } finally {
      setSaving(false);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2400);
    }
  };

  return { saving, showToast, submit, message, error };
}
