"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ChildProfile } from "@/types/api";

interface Props {
  activeChildId: number;
  onSwitchChild: (childId: number) => Promise<void>;
}

export default function ParentChildSwitcher({ activeChildId, onSwitchChild }: Props) {
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [saving, setSaving] = useState(false);

  const loadChildren = async () => {
    const res = await api.get("/parent/children/");
    setChildrenList(res.data.data || []);
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const handleSelectChild = async (id: number) => {
    localStorage.setItem("ka_active_child_id", String(id));
    await onSwitchChild(id);
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    setSaving(true);
    try {
      const res = await api.post("/parent/children/", {
        name: newChildName.trim(),
        invite_code: inviteCode.trim().toUpperCase(),
      });
      const updated: ChildProfile[] = res.data.data || [];
      setChildrenList(updated);
      setNewChildName("");
      setInviteCode("");
      setShowAddForm(false);
      const newest = updated[updated.length - 1];
      if (newest) {
        await handleSelectChild(newest.id);
      }
    } finally {
      setSaving(false);
    }
  };

  const activeChild = childrenList.find((c) => c.id === activeChildId);

  return (
    <div className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-sm font-bold text-[var(--color-forest)]">Profil anak:</span>
        {childrenList.map((child) => {
          const isCurrent = child.id === activeChildId;
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => handleSelectChild(child.id)}
              className={`min-h-[44px] px-4 rounded-full border-2 border-[var(--color-forest)] text-base font-bold cursor-pointer ${
                isCurrent
                  ? "bg-[var(--color-leaf)] text-[var(--color-ink)]"
                  : "bg-[var(--color-bg)] text-[var(--color-forest)]"
              }`}
            >
              {child.name}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="min-h-[44px] px-3.5 rounded-full border-2 border-dashed border-[var(--color-forest)] text-sm font-bold text-[var(--color-forest)] cursor-pointer"
        >
          {showAddForm ? "Batal" : "+ Tambah anak"}
        </button>
      </div>

      {activeChild?.classroom_name && (
        <span className="text-sm font-bold text-[var(--color-forest)] bg-[var(--color-bg)] px-3.5 py-1.5 rounded-xl border-2 border-[var(--color-forest)]">
          Terhubung ke: {activeChild.classroom_name}
        </span>
      )}

      {showAddForm && (
        <form
          onSubmit={handleAddChild}
          className="w-full pt-3 mt-1 border-t-2 border-[var(--color-forest)]/15 flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            required
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            placeholder="Nama anak (mis. Nara)"
            className="min-h-[44px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base flex-1"
          />
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Kode kelas guru (opsional, mis. MELATI)"
            className="min-h-[44px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base sm:w-64"
          />
          <button
            type="submit"
            disabled={saving}
            style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
            className="min-h-[44px] px-5 rounded-full font-bold text-base text-[var(--color-ink)] cursor-pointer"
          >
            {saving ? "Menyimpan..." : "Simpan profil"}
          </button>
        </form>
      )}
    </div>
  );
}