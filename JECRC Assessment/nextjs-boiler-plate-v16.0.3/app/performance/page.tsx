"use client";

import { Star } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { canApprove } from "../../lib/hrms/rbac";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Badge, Card, EmptyState, PageHeader, Progress, Row, SectionTitle } from "../../components/hrms/ui";

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-500">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {value.toFixed(1)}
    </span>
  );
}

export default function PerformancePage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const goals = useHrms((s) => s.goals);
  const reviews = useHrms((s) => s.reviews);

  const myGoals = goals.filter((g) => g.userId === currentUserId);
  const teamGoals = goals.filter((g) => g.userId !== currentUserId);
  const myReview = reviews.find((r) => r.userId === currentUserId);
  const shownGoals = myGoals.length ? myGoals : teamGoals;

  return (
    <div>
      <PageHeader title="Performance & Goals" subtitle="OKRs, progress & reviews" />

      <SectionTitle>{myGoals.length ? "My Goals" : "Team Goals"}</SectionTitle>
      <div className="space-y-2">
        {shownGoals.length === 0 ? <EmptyState>No goals</EmptyState> : null}
        {shownGoals.map((g) => {
          const owner = getEmployee(g.userId);
          return (
            <Card key={g.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{g.title}</p>
                <Badge status={g.status}>{labelize(g.status)}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{labelize(g.category)} · {labelize(g.type)} · weight {g.weight}%{myGoals.length ? "" : ` · ${owner?.name}`}</p>
              <p className="mt-1 text-xs text-slate-600">{g.description}</p>
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-xs text-slate-500"><span>Progress</span><span>{g.progress}%</span></div>
                <Progress value={g.progress} tone={g.status === "at-risk" ? "bg-red-500" : "bg-teal-600"} />
              </div>
              <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
                {g.keyResults.map((kr) => (
                  <Row key={kr.title} left={kr.title} right={`${kr.current}/${kr.target}`} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {myReview ? (
        <>
          <SectionTitle>Performance Review</SectionTitle>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{myReview.period}</p>
                <p className="text-xs text-slate-500">{labelize(myReview.type)}</p>
              </div>
              <Rating value={myReview.overallRating} />
            </div>
            <div className="mt-3 space-y-1">
              {myReview.categoryRatings.map((c) => (
                <Row key={c.category} left={c.category} right={<Rating value={c.rating} />} />
              ))}
            </div>
            <div className="mt-3 border-t border-slate-100 pt-2">
              <Row left="Goals Achieved" right={`${myReview.goalsAchieved}/${myReview.goalsTotal}`} />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">Strengths</p>
            <ul className="mt-1 list-inside list-disc text-xs text-slate-600">{myReview.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="mt-2 text-xs font-semibold text-slate-500">Areas of Improvement</p>
            <ul className="mt-1 list-inside list-disc text-xs text-slate-600">{myReview.improvements.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="mt-2 text-xs font-semibold text-slate-500">Recommendation</p>
            <p className="text-xs text-slate-600">{myReview.recommendations}</p>
          </Card>
        </>
      ) : null}

      {canApprove(role) && teamGoals.length && myGoals.length ? (
        <>
          <SectionTitle>Team Goals</SectionTitle>
          <div className="space-y-2">
            {teamGoals.map((g) => (
              <Card key={g.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{g.title}</p>
                  <p className="text-xs text-slate-500">{getEmployee(g.userId)?.name} · {g.progress}%</p>
                </div>
                <Badge status={g.status}>{labelize(g.status)}</Badge>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
