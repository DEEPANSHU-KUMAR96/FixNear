export function IssueStatusBadge({ status }) {
    const cls =
        status === "Resolved"
            ? "bg-emerald-100 text-emerald-700"
            : status === "In Progress"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            {status}
        </span>
    );
}

export function InquiryStatusBadge({ status }) {
    const cls =
        status === "Responded"
            ? "bg-emerald-100 text-emerald-700"
            : status === "Reviewed"
            ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            {status}
        </span>
    );
}

export function RoleBadge({ role }) {
    const cls =
        role === "admin"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            {role}
        </span>
    );
}
