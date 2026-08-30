"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function AccountConnection({ googleEnabled }: { googleEnabled: boolean }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function startGoogle() {
    if (!googleEnabled || pending) return;
    setPending(true);
    setMessage(null);
    const result = await authClient.signIn.social({ provider: "google", callbackURL: "/en/you" });
    if (result.error) {
      setPending(false);
      setMessage("Google sign-in could not start. Check the preview URL and Google callback settings.");
    }
  }

  return (
    <div className="account-connection">
      <p className="micro-copy">Account sync</p>
      <h2>Keep your reading trail with you.</h2>
      <p>Google starts an account. Once signed in, you can add a passkey—a device-based sign-in that avoids a reusable password.</p>
      <button className="primary-action" type="button" disabled={!googleEnabled || pending} onClick={startGoogle}>
        {googleEnabled ? (pending ? "Opening Google…" : "Continue with Google") : "Google setup is awaiting the owner"}
      </button>
      {!googleEnabled && <p className="muted-note">The screen is ready; the private Google credentials and stable preview address are the remaining setup steps.</p>}
      {message && <p className="form-message" role="status">{message}</p>}
    </div>
  );
}
