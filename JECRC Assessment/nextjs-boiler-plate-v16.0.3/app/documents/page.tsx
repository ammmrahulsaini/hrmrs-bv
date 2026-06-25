"use client";

import { useHrms } from "../../stores/hrmsStore";
import { canManageContent } from "../../lib/hrms/rbac";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Badge, Button, Card, EmptyState, PageHeader, SectionTitle } from "../../components/hrms/ui";

export default function DocumentsPage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const documents = useHrms((s) => s.documents);
  const uploadDocument = useHrms((s) => s.uploadDocument);
  const reviewDocument = useHrms((s) => s.reviewDocument);

  const review = canManageContent(role);
  const list = review ? documents : documents.filter((d) => d.userId === currentUserId);

  return (
    <div>
      <PageHeader title="Documents" subtitle={review ? "Verify employee documents" : "Your document repository"} />

      <div className="space-y-2">
        {list.length === 0 ? <EmptyState>No documents</EmptyState> : null}
        {list.map((d) => {
          const owner = getEmployee(d.userId);
          return (
            <Card key={d.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{d.name}</p>
                  <p className="text-xs text-slate-500">{labelize(d.category)}{review ? ` · ${owner?.name}` : ""}</p>
                </div>
                <Badge status={d.status}>{labelize(d.status)}</Badge>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {d.fileType} · {d.size}{d.uploadedOn ? ` · Uploaded ${d.uploadedOn}` : ""}{d.verifiedOn ? ` · Verified ${d.verifiedOn}` : ""}
              </div>
              {d.expiryDate ? <p className="text-[11px] font-medium text-orange-600">Expires {d.expiryDate}</p> : null}
              {d.rejectionReason ? <p className="text-[11px] font-medium text-red-500">Rejected: {d.rejectionReason}</p> : null}

              <div className="mt-2 flex gap-2">
                {!review && (d.status === "missing" || d.status === "rejected") ? (
                  <Button size="sm" onClick={() => uploadDocument(d.id)}>Upload</Button>
                ) : null}
                {review && d.status === "uploaded" ? (
                  <>
                    <Button size="sm" onClick={() => reviewDocument(d.id, "verified", "")}>Verify</Button>
                    <Button size="sm" variant="danger" onClick={() => reviewDocument(d.id, "rejected", "Document not clear")}>Reject</Button>
                  </>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Document Categories</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {["identity", "employment", "work-auth", "tax", "education", "other"].map((c) => (
          <Badge key={c}>{labelize(c)}</Badge>
        ))}
      </div>
    </div>
  );
}
