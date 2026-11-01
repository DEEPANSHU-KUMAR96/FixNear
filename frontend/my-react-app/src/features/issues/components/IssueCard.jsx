export default function IssueCard({
    item,
    isOwner,
    onStatusChange,
    onEdit,
    onDelete,
}) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
                {/* Category & Status Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {item.category}
                    </span>

                    <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            item.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                        {item.status}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                </h3>

                {/* Location */}
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">{item.location}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                </p>
            </div>

            {/* Card Bottom Meta & Actions */}
            <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400">
                        Priority:{' '}
                        <span
                            className={`font-semibold ${
                                item.priority === 'High'
                                    ? 'text-rose-600'
                                    : item.priority === 'Medium'
                                    ? 'text-amber-600'
                                    : 'text-slate-600'
                            }`}
                        >
                            {item.priority}
                        </span>
                    </span>

                    {item.createdBy?.name && (
                        <span className="text-slate-400 truncate max-w-[130px]">
                            By {item.createdBy.name}
                        </span>
                    )}
                </div>

                {/* Interactive controls */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
                    {/* Status toggle selector */}
                    <select
                        value={item.status}
                        onChange={(e) => onStatusChange(item._id, e.target.value)}
                        className="text-[11px] font-medium py-1 px-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        title="Update Status"
                    >
                        <option value="Reported">Reported</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    {/* Owner actions (Edit / Delete) */}
                    {isOwner && (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => onEdit(item)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                                title="Edit Issue"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={() => onDelete(item._id)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                title="Delete Issue"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

