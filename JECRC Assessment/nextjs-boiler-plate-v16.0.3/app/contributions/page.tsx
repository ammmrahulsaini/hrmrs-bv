"use client";

import { Trophy } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { canApprove } from "../../lib/hrms/rbac";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Avatar, Badge, Button, Card, EmptyState, PageHeader, SectionTitle } from "../../components/hrms/ui";

export default function ContributionsPage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const contributions = useHrms((s) => s.contributions);
  const items = useHrms((s) => s.contributionItems);
  const leaderboard = useHrms((s) => s.leaderboard);
  const claimItem = useHrms((s) => s.claimItem);
  const approveContribution = useHrms((s) => s.approveContribution);

  const pending = contributions.filter((c) => c.status === "under-review" || c.status === "proposal-pending");

  return (
    <div>
      <PageHeader title="Contributions" subtitle="Value contributions & recognition points" />

      <SectionTitle>Contribution Feed</SectionTitle>
      <div className="space-y-2">
        {contributions.map((c) => {
          const owner = getEmployee(c.userId);
          return (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                <Badge status={c.status}>{labelize(c.status)}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{owner?.name} · {labelize(c.type)} · {labelize(c.category)}</p>
              <p className="mt-1 text-xs text-slate-600">{c.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">{c.tags.map((t) => <Badge key={t}>#{t}</Badge>)}</div>
                <span className="text-sm font-bold text-orange-600">{c.points || c.suggestedPoints} pts</span>
              </div>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Available to Claim</SectionTitle>
      <div className="space-y-2">
        {items.map((i) => (
          <Card key={i.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{i.title}</p>
              <p className="text-xs text-slate-500">{labelize(i.category)} · {i.suggestedPoints} pts</p>
            </div>
            {i.claimedBy ? <Badge status="in-progress">{i.claimedBy === currentUserId ? "Claimed by you" : "Claimed"}</Badge> : <Button size="sm" onClick={() => claimItem(i.id)}>Claim</Button>}
          </Card>
        ))}
      </div>

      <SectionTitle>Leaderboard</SectionTitle>
      <div className="space-y-2">
        {leaderboard.map((l, idx) => {
          const emp = getEmployee(l.userId);
          return (
            <Card key={l.userId} className="flex items-center gap-3 py-3">
              <span className="w-5 text-center text-sm font-bold text-slate-400">{idx + 1}</span>
              <Avatar name={emp?.name ?? "?"} color={emp?.avatarColor} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{emp?.name}</p>
                <p className="text-xs text-slate-500">{l.badges.join(" · ") || "No badges yet"} · ⭐ {l.avgRating}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600"><Trophy className="h-4 w-4" /> {l.points}</span>
            </Card>
          );
        })}
      </div>

      {canApprove(role) ? (
        <>
          <SectionTitle>Approve Contributions</SectionTitle>
          <div className="space-y-2">
            {pending.length === 0 ? <EmptyState>Nothing to approve</EmptyState> : null}
            {pending.map((c) => (
              <Card key={c.id}>
                <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                <p className="text-xs text-slate-500">{getEmployee(c.userId)?.name} · suggested {c.suggestedPoints} pts</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => approveContribution(c.id, c.suggestedPoints, "Approved")}>Approve {c.suggestedPoints} pts</Button>
                  <Button size="sm" variant="outline" onClick={() => approveContribution(c.id, c.suggestedPoints + 20, "Bonus points")}>Award +20</Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
