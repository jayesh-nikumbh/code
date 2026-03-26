import { useState } from 'react';
import { Calendar, Loader2, MapPin, MapPinOff } from 'lucide-react';
import CustomToast from '../../common/CustomToast';

// Calculate distance between two lat/lng points in meters (Haversine formula)
function getDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MarkAttendanceCard({ onMark, lectureName = "Active Session", allowedLocation = null }) {
    const [locationStatus, setLocationStatus] = useState("idle"); // idle | checking | allowed | denied | error
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const handleMarkClick = () => {
        // Agar allowedLocation nahi diya API ne, to bina location check ke mark karo
        if (!allowedLocation) {
            submitAttendance();
            return;
        }

        setLocationStatus("checking");

        if (!navigator.geolocation) {
            setLocationStatus("error");
            CustomToast.error("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const distance = getDistanceMeters(
                    latitude,
                    longitude,
                    allowedLocation.latitude,
                    allowedLocation.longitude
                );

                if (distance <= allowedLocation.radiusMeters) {
                    setLocationStatus("allowed");
                    submitAttendance();
                } else {
                    setLocationStatus("denied");
                    CustomToast.error(`You are ${Math.round(distance)}m away. You must be within ${allowedLocation.radiusMeters}m of the classroom.`);
                }
            },
            (err) => {
                setLocationStatus("error");
                CustomToast.error("Location access denied. Please enable location to mark attendance.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const submitAttendance = async () => {
        setIsSubmitting(true);
        try {
            await onMark();
        } finally {
            setIsSubmitting(false);
            setLocationStatus("idle");
        }
    };

    const isChecking = locationStatus === "checking" || isSubmitting;

    return (
        <div className="bg-white dark:bg-[#152561] rounded-3xl p-7 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-300">
                        Mark Attendance
                    </p>

                    <h3 className="text-[28px] leading-tight font-bold text-[#0B1957] dark:text-white mb-1">
                        {formattedDate}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lectureName}
                    </p>

                    {/* Location status indicator */}
                    {locationStatus === "checking" && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                            <span className="text-xs text-blue-500 font-medium">Verifying location...</span>
                        </div>
                    )}
                    {locationStatus === "allowed" && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <MapPin className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs text-green-500 font-medium">Location verified</span>
                        </div>
                    )}
                    {locationStatus === "denied" && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <MapPinOff className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-xs text-red-500 font-medium">Not in classroom area</span>
                        </div>
                    )}
                    {locationStatus === "error" && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <MapPinOff className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-xs text-orange-500 font-medium">Location access required</span>
                        </div>
                    )}
                </div>

                <div className="bg-[#E3F2FF] dark:bg-[#1d3270] rounded-2xl p-4 ml-4">
                    <div className="w-7 h-7 flex items-center justify-center text-[#1A2B6D] dark:text-[#9ECCFA]">
                        <Calendar strokeWidth={2} className="w-7 h-7" />
                    </div>
                </div>
            </div>

            <button
                onClick={handleMarkClick}
                disabled={isChecking}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2
                    ${isChecking
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed shadow-none"
                        : "bg-[#0B1957] dark:bg-[#1E347F] text-white hover:bg-[#081340] dark:hover:bg-[#243C94] shadow-[#0B1957]/10"
                    }`}
            >
                {isChecking ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {locationStatus === "checking" ? "Checking location..." : "Marking..."}
                    </>
                ) : (
                    "Mark Attendance"
                )}
            </button>
        </div>
    );
}
