import React, { useState } from 'react';
import { Staff } from '../types';
import { STAFF_LIST } from '../data/staffData';
import { getStaffPassword, authenticateUser } from '../utils/storage';
import { 
  X, 
  Search, 
  UserCheck, 
  Shield, 
  Lock, 
  Phone, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  FileSpreadsheet,
  Copy,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Staff | null;
  onSelectUser: (user: Staff) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'LOGIN_FORM' | 'ROSTER'>('LOGIN_FORM');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState<'ALL' | 'Trụ sở chính' | 'Phân hiệu 1' | 'Phân hiệu 2'>('ALL');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const user = authenticateUser(loginId, password);
    if (user) {
      onSelectUser(user);
      onClose();
    } else {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.');
    }
  };

  const handleQuickLogin = (staff: Staff) => {
    onSelectUser(staff);
    onClose();
  };

  const handleExportRoster = () => {
    const rows = STAFF_LIST.map((s) => ({
      'STT': s.stt,
      'Cơ sở': s.coSo,
      'Tổ CM': s.toCM,
      'Họ và tên': s.hoTen,
      'Vị trí việc làm': s.viTri,
      'Tên đăng nhập': s.username,
      'Mật khẩu riêng': getStaffPassword(s.id),
      'Số điện thoại': s.sdt,
      'CCCD': s.cccd,
      'Quyền hạn trong hệ thống': 
        s.role === 'HIEU_TRUONG' 
          ? 'Quản lý toàn trường - Phê duyệt kết quả thi đua'
          : s.role === 'PHO_HIEU_TRUONG'
          ? `Ban Giám hiệu - Phụ trách chấm ${s.phuTrachCham}`
          : s.phuTrachCham.includes('chấm')
          ? `Tổ trưởng - Quyền chấm: ${s.phuTrachCham}`
          : 'Cá nhân viên chức - Chỉ tự chấm điểm & xem kết quả',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh_Sach_Tai_Khoan');
    XLSX.writeFile(wb, 'Danh_Sach_Tai_Khoan_Va_Mat_Khau_70_CBGV.xlsx');
  };

  const filteredStaff = STAFF_LIST.filter((s) => {
    const matchesSearch =
      s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sdt.includes(searchTerm) ||
      s.cccd.includes(searchTerm) ||
      s.toCM.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.viTri.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCampus = campusFilter === 'ALL' || s.coSo === campusFilter;

    return matchesSearch && matchesCampus;
  });

  // Role description helper
  const getRoleDescription = (staff: Staff) => {
    if (staff.role === 'HIEU_TRUONG') {
      return {
        badge: 'Toàn quyền Ban Giám hiệu',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        perm: 'Chấm PHT, Tổ trưởng; duyệt toàn trường; ban hành kết quả.',
      };
    }
    if (staff.role === 'PHO_HIEU_TRUONG') {
      return {
        badge: 'Ban Giám hiệu phụ trách',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        perm: staff.phuTrachCham,
      };
    }
    if (staff.phuTrachCham && staff.phuTrachCham.includes('chấm')) {
      return {
        badge: 'Tổ trưởng / Phụ trách chấm',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        perm: `Chỉ được thẩm định cán bộ thuộc phân công: ${staff.phuTrachCham}`,
      };
    }
    return {
      badge: 'Cá nhân viên chức',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      perm: 'Chỉ được tự chấm điểm cá nhân và xem bảng tổng hợp công khai.',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Hệ Thống Đăng Nhập & Phân Quyền Viên Chức
              </h2>
              <p className="text-xs text-slate-300">
                Mỗi cán bộ có tài khoản và mật khẩu riêng biệt • Phân quyền bảo mật theo vị trí công tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sub-tab navigation */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-xs">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveSubTab('LOGIN_FORM')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeSubTab === 'LOGIN_FORM'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              1. Màn Hình Đăng Nhập (Tên đăng nhập & Mật khẩu)
            </button>
            <button
              onClick={() => setActiveSubTab('ROSTER')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'ROSTER'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>2. Tra Cứu Danh Sách Tài Khoản & Mật Khẩu (70 CB-GV)</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                70
              </span>
            </button>
          </div>

          {activeSubTab === 'ROSTER' && (
            <button
              onClick={handleExportRoster}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Excel Danh Sách Mật Khẩu</span>
            </button>
          )}
        </div>

        {/* View 1: Standard Login Form */}
        {activeSubTab === 'LOGIN_FORM' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center font-bold mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Xác thực quyền hạn viên chức</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đăng nhập bằng Tên đăng nhập (hoặc Số điện thoại / CCCD) và Mật khẩu riêng
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tên đăng nhập / Số điện thoại / CCCD:
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                    placeholder="Ví dụ: bac.nh, khang.tm, 0979798184..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mật khẩu cá nhân:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                >
                  Đăng Nhập Vào Hệ Thống
                </button>
              </form>

              {/* Quick sample account switcher */}
              <div className="pt-3 border-t border-slate-100">
                <span className="block text-[11px] font-semibold text-slate-500 mb-2">
                  Gợi ý tài khoản mẫu theo vai trò (Bấm để điền nhanh):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    onClick={() => {
                      setLoginId('bac.nh');
                      setPassword(getStaffPassword('NV01'));
                    }}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-left"
                  >
                    <span className="font-bold block">Hiệu trưởng (Nguyễn Hồ Bắc)</span>
                    <span className="text-[10px] text-slate-600">bac.nh / Bac@6075</span>
                  </button>

                  <button
                    onClick={() => {
                      setLoginId('nhan.ttm');
                      setPassword(getStaffPassword('NV03'));
                    }}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-left"
                  >
                    <span className="font-bold block">Tổ trưởng KHTN (Mỹ Nhân)</span>
                    <span className="text-[10px] text-slate-600">nhan.ttm / Nhan@7307</span>
                  </button>

                  <button
                    onClick={() => {
                      setLoginId('lan.tth');
                      setPassword(getStaffPassword('NV25'));
                    }}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-left"
                  >
                    <span className="font-bold block">Phó HT PH 1 (Hồng Lan)</span>
                    <span className="text-[10px] text-slate-600">lan.tth / Lan@6136</span>
                  </button>

                  <button
                    onClick={() => {
                      setLoginId('nhung.nt');
                      setPassword(getStaffPassword('NV04'));
                    }}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-left"
                  >
                    <span className="font-bold block">Giáo viên Toán (Thị Nhung)</span>
                    <span className="text-[10px] text-slate-600">nhung.nt / Nhung@6771</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Complete Roster with Passwords & Strict Role Restrictions */}
        {activeSubTab === 'ROSTER' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and filters */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo Họ tên, Tên đăng nhập, SĐT, CCCD, Vị trí..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-1.5 self-center">
                {(['ALL', 'Trụ sở chính', 'Phân hiệu 1', 'Phân hiệu 2'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCampusFilter(c)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      campusFilter === c
                        ? 'bg-blue-700 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c === 'ALL' ? 'Tất cả (70)' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Account List Table */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <th className="py-2.5 px-2 w-10 text-center">STT</th>
                    <th className="py-2.5 px-3 min-w-[180px]">Họ tên cán bộ</th>
                    <th className="py-2.5 px-3">Cơ sở / Tổ</th>
                    <th className="py-2.5 px-3 font-mono">Tên đăng nhập</th>
                    <th className="py-2.5 px-3 font-mono bg-amber-50 text-amber-950">Mật khẩu riêng</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Giới hạn quyền hạn</th>
                    <th className="py-2.5 px-3 text-center w-28">Đăng nhập</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((staff) => {
                    const pass = getStaffPassword(staff.id);
                    const roleInfo = getRoleDescription(staff);
                    const isCurrent = currentUser?.id === staff.id;

                    return (
                      <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-2 text-center font-bold text-slate-500">{staff.stt}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{staff.hoTen}</span>
                            {staff.isDangVien && (
                              <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1 py-0.2 rounded border border-red-200">
                                ĐV
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{staff.viTri} • {staff.monDay}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[11px]">
                          <div className="font-medium text-slate-800">{staff.toCM}</div>
                          <div className="text-slate-500">{staff.coSo}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700 bg-blue-50/50">
                          {staff.username}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-950 bg-amber-50">
                          {pass}
                        </td>
                        <td className="py-2.5 px-3 text-[11px]">
                          <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${roleInfo.badgeColor} mb-0.5`}>
                            {roleInfo.badge}
                          </span>
                          <div className="text-slate-600 line-clamp-1">{roleInfo.perm}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isCurrent ? (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Đang dùng
                            </span>
                          ) : (
                            <button
                              onClick={() => handleQuickLogin(staff)}
                              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-[11px] shadow-sm transition-colors"
                            >
                              Đăng nhập
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Trường TH & THCS Nguyễn Đình Chiểu • Bảo mật phân quyền Nghị định 233</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
