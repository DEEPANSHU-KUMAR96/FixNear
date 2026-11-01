import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../../component/Navbar";
import useAuth from "../../auth/hooks/useAuth";
import {
    deleteAdminInquiry,
    getAdminInquiries,
    updateAdminInquiryStatus,
} from "../services/admin.service";

const INQUIRY_STATUSES = ["Pending", "Reviewed", "Responded"];

const Admin = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [updatingId, setUpdatingId] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
            return;
        }

        if (user?.role !== "admin") {
            return;
        }

        let isCurrent = true;
        getAdminInquiries()
            .then((results) => {
                if (isCurrent) setInquiries(results);
            })
            .catch((error) => {
                if (isCurrent) setErrorMessage(error.message);
            })
            .finally(() => {
                if (isCurrent) setIsLoading(false);
            });

        return () => {
            isCurrent = false;
        };
    }, [isAuthenticated, navigate, user?.role]);

    const handleStatusChange = async (id, status) => {
        setErrorMessage("");
        setUpdatingId(id);
        try {
            const updatedInquiry = await updateAdminInquiryStatus(id, status);
            setInquiries((current) =>
                current.map((inquiry) =>
                    inquiry._id === id ? updatedInquiry : inquiry
                )
            );
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setUpdatingId("");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;

        setErrorMessage("");
        setUpdatingId(id);
        try {
            await deleteAdminInquiry(id);
            setInquiries((current) => current.filter((inquiry) => inquiry._id !== id));
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setUpdatingId("");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                            FixNear administration
                        </p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">
                            Contact inquiries
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Review and update messages submitted through the contact form.
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Back to FixNear
                    </Link>
                </div>

                {user?.role !== "admin" && isAuthenticated && (
                    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
                        Admin access is required to view inquiries.
                    </div>
                )}

                {errorMessage && (
                    <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                        {errorMessage}
                    </div>
                )}

                {user?.role === "admin" && (
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {isLoading ? (
                            <p className="p-8 text-center text-sm text-slate-500">Loading inquiries...</p>
                        ) : inquiries.length === 0 ? (
                            <p className="p-8 text-center text-sm text-slate-500">
                                No inquiries yet.
                            </p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {inquiries.map((inquiry) => (
                                    <li key={inquiry._id} className="p-5 sm:p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <h2 className="font-semibold text-slate-900">
                                                        {inquiry.name}
                                                    </h2>
                                                    <a
                                                        className="break-all text-sm text-emerald-700 hover:underline"
                                                        href={`mailto:${inquiry.email}`}
                                                    >
                                                        {inquiry.email}
                                                    </a>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {new Date(inquiry.createdAt).toLocaleString()}
                                                </p>
                                                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                                    {inquiry.message}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <label className="sr-only" htmlFor={`status-${inquiry._id}`}>
                                                    Inquiry status
                                                </label>
                                                <select
                                                    id={`status-${inquiry._id}`}
                                                    value={inquiry.status}
                                                    disabled={updatingId === inquiry._id}
                                                    onChange={(event) =>
                                                        handleStatusChange(inquiry._id, event.target.value)
                                                    }
                                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
                                                >
                                                    {INQUIRY_STATUSES.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    disabled={updatingId === inquiry._id}
                                                    onClick={() => handleDelete(inquiry._id)}
                                                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default Admin;
