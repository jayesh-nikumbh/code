import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AdminRewardCard from '../../components/admin/rewards/AdminRewardCard';
import { Plus, Loader2 } from 'lucide-react';
import RewardEditSidebar from '../../components/admin/rewards/RewardEditSidebar';
import CustomToast from '../../components/common/CustomToast';
import adminService from '../../api/services/admin';

// ── Confirmation Modal ──────────────────────────────────────────────────────
function ConfirmModal({ isOpen, rewardTitle, onConfirm, onCancel, isDeleting }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [activeTitle, setActiveTitle] = useState(rewardTitle);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      if (rewardTitle) setActiveTitle(rewardTitle);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, rewardTitle]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen ? "animate-overlay-in" : "animate-overlay-out"}`} 
        onClick={onCancel} 
      />

      <div className={`relative bg-white dark:bg-[#152561] w-full max-w-lg rounded-[24px] p-10 shadow-2xl ${isOpen ? "animate-spring-in" : "animate-spring-out"}`}>
        <h3 className="text-[22px] font-bold text-[#14245C] dark:text-white mb-2 text-center">
          Delete Reward?
        </h3>

        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8 text-center">
          Are you sure you want to delete <span className="text-red-500 font-bold">"{activeTitle}"</span>? This action cannot be undone and students will no longer see this reward.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-[#B9D4F1] hover:bg-[#a9c9e8] text-[#14245C] font-bold py-3.5 rounded-xl transition-all text-sm shadow-sm cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="w-5 h-5 animate-spin" />}
            Confirm Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editReward, setEditReward] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null); // { id, title }
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const data = await adminService.getRewards();
      setRewards(data);
    } catch (error) {
      CustomToast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reward) => {
    setEditReward(reward);
    setIsSidebarOpen(true);
  };

  const handleAddNew = () => {
    setEditReward(null);
    setIsSidebarOpen(true);
  };

  const handleDeleteRequest = (id, title) => {
    setDeleteData({ id, title });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
        await adminService.deleteReward(deleteData.id);
        setRewards(rewards.filter(r => r.id !== deleteData.id));
        CustomToast.success(`Reward "${deleteData.title}" deleted.`);
        setIsDeleteModalOpen(false);
    } catch (error) {
        CustomToast.error("Failed to delete reward");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSaveReward = async (updatedReward) => {
    setIsProcessing(true);
    try {
        await adminService.saveReward(updatedReward);
        if (updatedReward.id) {
            setRewards(rewards.map(r => r.id === updatedReward.id ? updatedReward : r));
            CustomToast.success("Reward updated successfully!");
        } else {
            // Re-fetch to get new ID or mock it
            await fetchRewards();
            CustomToast.success("New reward added successfully!");
        }
        setIsSidebarOpen(false);
    } catch (error) {
        CustomToast.error("Failed to save reward");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-400 mx-auto px-8 py-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1957] dark:text-white mb-1">
            Rewards Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            Add, edit, and manage rewards available for students.
          </p>
        </div>

        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#0B1957] hover:bg-[#1a2c6d] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add New Reward
        </button>
      </div>

      {/* Rewards Grid Section */}
      <div className="bg-white/50 dark:bg-[#152561]/50 backdrop-blur-sm rounded-[32px] p-8 border border-gray-100 dark:border-white/10 shadow-sm min-h-[400px]">
        <h2 className="text-xl font-bold text-[#0B1957] dark:text-white mb-8">
          Reward Store
        </h2>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-[#0B1957] dark:text-[#9ECCFA] animate-spin" />
                <p className="text-sm text-gray-400 font-medium animate-pulse">Loading Reward Store...</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rewards.map((reward) => (
                    <AdminRewardCard
                    key={reward.id}
                    image={reward.image}
                    title={reward.title}
                    points={reward.points}
                    onEdit={() => handleEdit(reward)}
                    onDelete={() => handleDeleteRequest(reward.id, reward.title)}
                    />
                ))}
                </div>

                {rewards.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 italic">No rewards found. Add a new one to get started!</p>
                </div>
                )}
            </>
        )}
      </div>

      {/* Edit/Add Sidebar */}
      <RewardEditSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        reward={editReward}
        onSave={handleSaveReward}
        isSaving={isProcessing}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        rewardTitle={deleteData?.title}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isProcessing}
      />
    </div>
  );
}
