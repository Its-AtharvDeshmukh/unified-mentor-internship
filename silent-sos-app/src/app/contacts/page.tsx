"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string | null;
  email: string | null;
  notifySms: boolean;
  notifyEmail: boolean;
  isVerified: boolean;
}

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [maxLimit, setMaxLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadContacts() {
    try {
      const res = await fetch("/api/contacts");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setContacts(data.contacts || []);
      setMaxLimit(data.maxLimit || 5);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setRelationship("");
    setPhone("");
    setEmail("");
    setNotifySms(true);
    setNotifyEmail(true);
    setError(null);
  }

  function startEdit(c: Contact) {
    setEditingId(c.id);
    setName(c.name);
    setRelationship(c.relationship);
    setPhone(c.phone || "");
    setEmail(c.email || "");
    setNotifySms(c.notifySms);
    setNotifyEmail(c.notifyEmail);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const url = editingId ? `/api/contacts/${editingId}` : "/api/contacts";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          relationship,
          phone,
          email,
          notifySms,
          notifyEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save contact.");
      } else {
        resetForm();
        loadContacts();
      }
    } catch {
      setError("Network error while saving contact.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (editingId === id) resetForm();
      loadContacts();
    }
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to SOS Console
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            {contacts.length} of {maxLimit} Contacts Configured
          </span>
        </div>

        <header>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="h-6 w-6 text-rose-400" />
            Trusted Emergency Contacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            When you trigger a Silent SOS, enabled contacts immediately receive
            your timestamp, GPS coordinates (when permitted), and a secure
            responder acknowledgment link.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-5 bg-charcoal border border-slate-800 rounded-2xl p-5 space-y-4 h-fit"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-rose-400" />
              {editingId ? "Edit Trusted Contact" : "Add Trusted Contact"}
            </h2>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-200 text-xs flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Relationship / Role *
              </label>
              <input
                type="text"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Sibling, Partner, Roommate, Campus Escort"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                SMS Phone Number (E.164 format)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+15550199001"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white"
              />
            </div>

            <div className="space-y-2 pt-1">
              <span className="block text-xs font-medium text-slate-300">
                Notification Channels
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded border-slate-600"
                />
                Dispatch SMS Alert (requires phone)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded border-slate-600"
                />
                Dispatch Email Alert (requires email)
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Save Contact"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Contact List */}
          <div className="lg:col-span-7 space-y-3">
            {loading ? (
              <div className="p-8 bg-charcoal border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
                Loading contacts...
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 bg-charcoal border border-slate-800 rounded-2xl text-center space-y-2">
                <p className="text-sm font-semibold text-white">
                  No emergency contacts added yet
                </p>
                <p className="text-xs text-slate-400">
                  Use the form to add at least one trusted contact who should
                  receive your Silent SOS alerts.
                </p>
              </div>
            ) : (
              contacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-charcoal border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{c.name}</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {c.relationship}
                      </span>
                      {c.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-1">
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          {c.phone}{" "}
                          {c.notifySms ? "(SMS On)" : "(SMS Muted)"}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          {c.email}{" "}
                          {c.notifyEmail ? "(Email On)" : "(Email Muted)"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-700"
                      aria-label={`Remove ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

