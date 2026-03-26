import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import facultyService from '../../../api/services/faculty';

export default function FacultyCard() {
    const [facultyData, setFacultyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState([]);

    const getInitials = (name) => {
        if (!name) return "F";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const data = await facultyService.getFacultyList();
                setFacultyData(data);
                // Expand all by default as requested before
                // setExpandedIds(data.map(f => f.id));
            } catch (error) {
                console.error("Failed to fetch faculty list", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaculty();
    }, []);

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    if (loading) return (
        <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm animate-pulse h-[300px] flex items-center justify-center">
            <p className="text-gray-400">Loading Faculty...</p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm transition-all">
            <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white mb-6">
                Faculty
            </h2>

            <div className="space-y-4">
                {facultyData.map((faculty) => {
                    const isExpanded = expandedIds.includes(faculty.id);
                    return (
                        <div
                            key={faculty.id}
                            className="bg-[#F8F3EA] dark:bg-[#1D2B6B] border border-gray-100 dark:border-white/5 rounded-xl p-4 transition-all"
                        >
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleExpand(faculty.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#9ECCFA] text-[#0B1957] flex items-center justify-center  font-medium text-sm">
                                        {getInitials(faculty?.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[#0B1957] dark:text-white">
                                            {faculty.name}
                                        </h3>
                                        <span className="inline-block mt-1 px-3 py-0.5 bg-[#9ECCFA] text-[#0B1957] text-[10px] font-medium rounded-md tracking-wide">
                                            {faculty.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>

                            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-gray-50 dark:border-white/5' : 'grid-rows-[0fr] opacity-0 m-0 p-0 border-transparent'}`}>
                                <div className="overflow-hidden space-y-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Email</p>
                                        <p className="text-[13px] text-gray-700 dark:text-gray-200 mt-0.5">{faculty.email}</p>
                                    </div>
                                    <div className="pb-1">
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Contact</p>
                                        <p className="text-[13px] text-gray-700 dark:text-gray-200 mt-0.5">{faculty.contact}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
