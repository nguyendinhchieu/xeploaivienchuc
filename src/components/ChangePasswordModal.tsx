import React, { useState } from 'react';
import { Staff } from '../types';
import { getStaffPassword, setStaffPassword } from '../utils/storage';
import { KeyRound, Check, X, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Staff;
  onSuccess: (newPass: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const currentPass = getStaffPassword(currentUser.id);
    if (oldPassword.trim() !== currentPass) {
      setError('Mật khẩu hiện tại không chính xác!');
      return;
    }

    if (newPassword.length < 4) {
      setError('Mật khẩu mới phải có ít nhất 4 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setStaffPassword(currentUser.id, newPassword);
    onSuccess(newPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Đổi Mật Khẩu Cá Nhân</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500">Tài khoản:</span>
            <div className="font-bold text-slate-900 text-sm">{currentUser.hoTen}</div>
            <div className="text-slate-500 text-[11px]">Tên đăng nhập: <strong>{currentUser.username}</strong></div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-2.5 rounded-xl border border-red-200 flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mật khẩu hiện tại:</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu cũ..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mật khẩu mới:</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu mới..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới:</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Nhập lại mật khẩu mới..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Hiển thị mật khẩu</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md"
            >
              Lưu Mật Khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
