import { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  FieldLabel,
  Input,
  Modal,
  Select,
  cn,
} from "../components/UI.jsx";
import { IconMail, IconPlus, IconSearch, IconShield, IconUsers } from "../components/Icons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import * as orgApi from "../api/organizations.js";

const STATUS_FILTER = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active only" },
  { value: "inactive", label: "Inactive only" },
];

function StatPill({ label, value, tone = "teal" }) {
  const ring =
    tone === "teal"
      ? "border-teal/20 bg-teal/5"
      : tone === "orange"
        ? "border-orange/25 bg-orange/10"
        : "border-ink/10 bg-white";
  return (
    <div className={cn("rounded-2xl border px-4 py-3", ring)}>
      <p className="text-[11px] uppercase tracking-wider text-ink/45 font-semibold">{label}</p>
      <p className="font-display text-2xl text-ink mt-0.5">{value}</p>
    </div>
  );
}

function CounselorTable({ counselors, onEdit, onToggleStatus, togglingId }) {
  if (counselors.length === 0) return null;

  return (
    <>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink/45 border-b border-ink/5">
              <th className="py-3 pr-4 font-semibold">Counselor</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Added</th>
              <th className="py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {counselors.map((c) => {
              const inactive = c.status === "inactive";
              return (
                <tr key={c.id} className={inactive ? "opacity-70" : ""}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={c.fullName} size={40} />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{c.fullName}</p>
                        <p className="text-ink/50 truncate">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge tone={inactive ? "red" : "green"} dot>
                      {inactive ? "Inactive" : "Active"}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4 text-ink/60 whitespace-nowrap">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(c)}>
                        Edit
                      </Button>
                      <Button
                        variant={inactive ? "primary" : "danger"}
                        size="sm"
                        onClick={() => onToggleStatus(c)}
                        disabled={togglingId === c.id}
                      >
                        {togglingId === c.id
                          ? "…"
                          : inactive
                            ? "Reactivate"
                            : "Deactivate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="sm:hidden divide-y divide-ink/5">
        {counselors.map((c) => {
          const inactive = c.status === "inactive";
          return (
            <li key={c.id} className={cn("py-4", inactive && "opacity-75")}>
              <div className="flex gap-3">
                <Avatar name={c.fullName} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate">{c.fullName}</p>
                      <p className="text-xs text-ink/50 truncate">{c.email}</p>
                    </div>
                    <Badge tone={inactive ? "red" : "green"}>{inactive ? "Off" : "On"}</Badge>
                  </div>
                  <p className="text-xs text-ink/40 mt-1">
                    Added {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(c)}>
                      Edit
                    </Button>
                    <Button
                      variant={inactive ? "primary" : "danger"}
                      size="sm"
                      className="flex-1"
                      onClick={() => onToggleStatus(c)}
                      disabled={togglingId === c.id}
                    >
                      {inactive ? "Reactivate" : "Deactivate"}
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function TeamPage() {
  const { user } = useAuth();
  const orgId = user?.organizationId?.id ?? user?.organizationId;
  const orgName = user?.organizationId?.name ?? "Your organization";

  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editTarget, setEditTarget] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const [confirmDeactivate, setConfirmDeactivate] = useState(null);

  const { setHeaderInfo } = useOutletContext();

  useEffect(() => {
    setHeaderInfo({
      title: "Manage counselors",
      subtitle: `${orgName} · supervisors who review members and quiz results`,
      wide: true
    });
  }, [orgName, setHeaderInfo]);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError("");
    try {
      const list = await orgApi.listCounselors(orgId);
      setCounselors(list);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to load counselors");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return counselors.filter((c) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.status !== "inactive") ||
        (statusFilter === "inactive" && c.status === "inactive");
      const matchQuery =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [counselors, query, statusFilter]);

  const activeCount = counselors.filter((c) => c.status !== "inactive").length;

  const resetAddForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await orgApi.addCounselor(orgId, { fullName, email, password });
      resetAddForm();
      setAddOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not add counselor");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (c) => {
    setEditTarget(c);
    setEditName(c.fullName);
    setEditEmail(c.email);
    setEditPassword("");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    setError("");
    try {
      const payload = { fullName: editName, email: editEmail };
      if (editPassword.length >= 8) payload.password = editPassword;
      await orgApi.updateMember(orgId, editTarget.id, payload);
      setEditTarget(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update counselor");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (c) => {
    if (c.status !== "inactive" && !confirmDeactivate) {
      setConfirmDeactivate(c);
      return;
    }
    setTogglingId(c.id);
    setError("");
    try {
      if (c.status === "inactive") {
        await orgApi.updateMember(orgId, c.id, { status: "active" });
      } else {
        await orgApi.deactivateMember(orgId, c.id);
      }
      setConfirmDeactivate(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-xl bg-orange/10 border border-orange/25 px-4 py-3 text-sm text-ink">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatPill label="Active" value={activeCount} tone="teal" />
        <StatPill label="Inactive" value={counselors.length - activeCount} tone="orange" />
        <StatPill label="Total" value={counselors.length} />
      </div>

      <Card className="mb-4 bg-beige/40 border-beige-deep/50" padded>
        <div className="flex gap-3">
          <span className="w-10 h-10 rounded-xl bg-teal/15 text-teal flex items-center justify-center shrink-0">
            <IconShield size={20} />
          </span>
          <p className="text-sm text-ink/70 leading-relaxed">
            Counselors sign in on this app with the email and temporary password you set. They can
            review members and flagged results — they cannot change organization settings.
          </p>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="Search name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          className="sm:w-44"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_FILTER.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
        <Button icon={<IconPlus size={18} />} onClick={() => setAddOpen(true)} className="shrink-0">
          Add counselor
        </Button>
      </div>

      <Card padded={false}>
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-ink/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-ink/10 rounded w-1/3" />
                  <div className="h-3 bg-ink/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<IconUsers size={48} />}
            title={counselors.length === 0 ? "No counselors yet" : "No matches"}
            description={
              counselors.length === 0
                ? "Add your first counselor so they can sign in and support your members."
                : "Try a different search or status filter."
            }
            action={
              counselors.length === 0 && (
                <Button icon={<IconPlus size={16} />} onClick={() => setAddOpen(true)}>
                  Add counselor
                </Button>
              )
            }
          />
        ) : (
          <div className="px-4 sm:px-5">
            <div className="py-3 flex items-center justify-between border-b border-ink/5">
              <p className="text-xs text-ink/50">
                Showing <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
                {counselors.length}
              </p>
            </div>
            <CounselorTable
              counselors={filtered}
              onEdit={openEdit}
              onToggleStatus={toggleStatus}
              togglingId={togglingId}
            />
          </div>
        )}
      </Card>

      <Modal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          resetAddForm();
        }}
        title="Add counselor"
        subtitle="They will use these credentials to sign in on the User app"
        footer={
          <>
            <Button
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => {
                setAddOpen(false);
                resetAddForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-counselor-form"
              className="w-full sm:w-auto"
              disabled={saving}
            >
              {saving ? "Creating…" : "Create account"}
            </Button>
          </>
        }
      >
        <form id="add-counselor-form" onSubmit={handleAdd} className="space-y-4">
          <div>
            <FieldLabel htmlFor="add-name">Full name</FieldLabel>
            <Input
              id="add-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Priya Sharma"
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="add-email">Work email</FieldLabel>
            <Input
              id="add-email"
              type="email"
              icon={<IconMail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="counselor@school.edu"
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="add-password">Temporary password</FieldLabel>
            <Input
              id="add-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
              required
            />
            <p className="text-xs text-ink/45 mt-1.5">Share securely; they can change it later.</p>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit counselor"
        subtitle={editTarget?.email}
        footer={
          <>
            <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-counselor-form" className="w-full sm:w-auto" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </>
        }
      >
        <form id="edit-counselor-form" onSubmit={saveEdit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="edit-name">Full name</FieldLabel>
            <Input
              id="edit-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-email">Email</FieldLabel>
            <Input
              id="edit-email"
              type="email"
              icon={<IconMail size={16} />}
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-password">New password (optional)</FieldLabel>
            <Input
              id="edit-password"
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              minLength={8}
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDeactivate}
        onClose={() => setConfirmDeactivate(null)}
        title="Deactivate counselor?"
        subtitle={confirmDeactivate?.fullName}
        footer={
          <>
            <Button
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => setConfirmDeactivate(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="w-full sm:w-auto"
              onClick={() => confirmDeactivate && toggleStatus(confirmDeactivate)}
              disabled={togglingId === confirmDeactivate?.id}
            >
              Deactivate account
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink/70 leading-relaxed">
          <strong className="text-ink">{confirmDeactivate?.fullName}</strong> will not be able to
          sign in until you reactivate them. Their history stays in the system.
        </p>
      </Modal>
    </>
  );
}
