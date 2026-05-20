import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/AppShell.jsx";
import { RiskBadge } from "../components/RiskBadge.jsx";
import { StaffResultDetail } from "../components/StaffResultDetail.jsx";
import { Button, Modal } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { memberLabels } from "../utils/copy.js";
import * as orgApi from "../api/organizations.js";
import * as resultsApi from "../api/results.js";

export function CounselorMembersPage() {
  const { user } = useAuth();
  const orgId = user?.organizationId?.id ?? user?.organizationId;
  const orgType = typeof user?.organizationId === "object" ? user.organizationId?.type : null;
  const labels = memberLabels(orgType);

  const [members, setMembers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const [memberList, resultRows] = await Promise.all([
        orgApi.listMembers(orgId),
        resultsApi.listOrgResults({ limit: 100 }),
      ]);
      setMembers(memberList.filter((m) => m.role === "user"));
      setResults(resultRows);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  const latestByUser = useMemo(() => {
    const map = new Map();
    for (const r of results) {
      const uid = r.userId?.toString?.() ?? r.userId;
      if (!uid || map.has(uid)) continue;
      map.set(uid, r);
    }
    return map;
  }, [results]);

  useEffect(() => {
    if (!selectedResultId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      try {
        const row = await resultsApi.getResult(selectedResultId);
        if (!cancelled) setDetail(row);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedResultId]);

  const selectedMember = useMemo(() => {
    if (!selectedResultId) return null;
    const row = results.find((r) => r.id === selectedResultId);
    return members.find((m) => m.id === (row?.userId ?? row?.user?.id));
  }, [selectedResultId, results, members]);

  return (
    <AppShell title="Members" subtitle={labels.members}>
      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-ink/50">No members registered yet.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((m) => {
            const latest = latestByUser.get(m.id);
            return (
              <li
                key={m.id}
                className="rounded-xl bg-white/70 border border-ink/8 px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{m.fullName}</p>
                    <p className="text-xs text-ink/50">
                      {m.memberType} · {m.email}
                    </p>
                  </div>
                  {latest ? (
                    <div className="flex items-center gap-2">
                      <RiskBadge level={latest.riskLevel} />
                      <button
                        type="button"
                        onClick={() => setSelectedResultId(latest.id)}
                        className="text-xs text-teal font-medium hover:underline"
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-ink/40">No quiz yet</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={!!selectedResultId}
        onClose={() => setSelectedResultId(null)}
        title={selectedMember?.fullName ?? "Member result"}
        subtitle="Latest assessment"
        width="max-w-lg"
      >
        <StaffResultDetail result={detail} loading={detailLoading} />
        <div className="mt-4">
          <Button variant="ghost" onClick={() => setSelectedResultId(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
