import React from 'react';

export const PlannerMetrics = ({ results }) => {
    if (!results || !results.history) return null;

    const { isDepleted, ageOfDepletion, finalEstate } = results;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-6 rounded-2xl border ${isDepleted ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isDepleted ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {isDepleted ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Retirement Status</h4>
                        <div className={`text-2xl font-bold ${isDepleted ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {isDepleted ? `Depleted at Age ${ageOfDepletion}` : 'Fully Funded'}
                        </div>
                        <p className={`text-sm mt-1 ${isDepleted ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {isDepleted 
                                ? "Your assets will run out before your end planning age." 
                                : "Your assets will last your entire retirement plan."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Final Estate Value</h4>
                        <div className="text-2xl font-bold text-slate-900">
                            ${Math.round(finalEstate).toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            Estimated remaining value at your end planning age.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
