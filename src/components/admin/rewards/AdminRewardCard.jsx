import { Trophy, Edit2, Trash2 } from 'lucide-react';

const AdminRewardCard = ({ image, title, points, onEdit, onDelete }) => {
  return (
    <div className="bg-[#F8F3EA] dark:bg-[#152561] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm flex flex-col h-full group hover:shadow-md transition-shadow duration-300 relative">
      {/* Reward Image */}
      <div className="aspect-16/10 w-full overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Reward Content */}
      <div className="p-4 flex flex-col grow">
        <h3 className="text-[#0B1957] dark:text-white font-bold text-lg mb-1">{title}</h3>

        <div className="flex items-center gap-1.5 text-[#3b82f6] dark:text-blue-400 mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold text-blue-500 text-sm ">
            {points} <span className="text-gray-500 dark:text-gray-400 font-medium">points</span>
          </span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-2 py-2 rounded-xl bg-[#D1E8FF]/60 dark:bg-white/5 text-[#0B1957] dark:text-white text-xs font-bold hover:bg-[#D1E8FF]/80 transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 py-2 rounded-xl bg-[#FEE2E2]/60 dark:bg-red-500/10 text-red-600 font-bold text-xs hover:bg-[#FEE2E2]/80 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRewardCard;
