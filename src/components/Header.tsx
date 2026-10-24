import React from 'react';
import { Staff } from '../types';
import { EVALUATION_PERIODS } from '../data/criteriaData';
import { canAccessGradingTab, canAccessBghTab } from '../utils/storage';
import { 
  Building2, 
  Calendar, 
  UserCheck, 
  LogOut, 
  FileText, 
  CheckCircle2, 
  BarChart3, 
  Users, 
  BookOpen, 
  Award,
  KeyRound,
  ShieldCheck,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  currentUser: Staff;
  currentPeriod: string;
  onPeriodChange: (periodId: string) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenLogin: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  pendingForEvaluatorCount: number;
  pendingForBghCount: number;
  onResetAllToZero?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentPeriod,
  onPeriodChange,
  activeTab,
  onTabChange,
  onOpenLogin,
  onOpenChangePassword,
  onLogout,
  pendingForEvaluatorCount,
  pendingForBghCount,
  onResetAllToZero,
}) => {
  const currentPeriodObj = EVALUATION_PERIODS.find((p) => p.id === currentPeriod) || EVALUATION_PERIODS[2];

  // Strict role permissions
  const isBgh = canAccessBghTab(currentUser);
  const isEvaluator = canAccessGradingTab(currentUser);

  // Role tag display
  const getRoleBadge = () => {
    if (currentUser.role === 'HIEU_TRUONG') {
      return { text: 'BGH: Hiệu trưởng (Toàn quyền)', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
    }
    if (currentUser.role === 'PHO_HIEU_TRUONG') {
      return { text: 'BGH: Phó Hiệu trưởng', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    if (isEvaluator) {
      return { text: `Tổ trưởng: Quyền chấm ${currentUser.toCM}`, color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
    return { text: 'Viên chức: Chỉ tự chấm', color: 'bg-slate-700 text-slate-300 border-slate-600' };
  };

  const roleBadge = getRoleBadge();

  return (
    <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800 sticky top-0 z-40">
      {/* Top micro bar: National header & Administrative affiliation */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-amber-100 text-xs py-1 px-4 flex flex-wrap justify-between items-center border-b border-red-900/40">
        <div className="flex items-center space-x-2">
          <span className="font-semibold tracking-wide uppercase">Cộng hòa Xã hội Chủ nghĩa Việt Nam</span>
          <span className="text-amber-300/80">|</span>
          <span className="text-amber-200">Độc lập - Tự do - Hạnh phúc</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-red-950/60 text-amber-200 px-2 py-0.5 rounded border border-amber-400/30 font-medium">
            Áp dụng Nghị định số 233/2026/NĐ-CP & Quyết định số 23/10/2026-QĐ-NĐC
          </span>
          <span className="text-amber-200 hidden md:inline">UBND Xã Ea Kar, Tỉnh Đắk Lắk</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* School branding */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 border border-amber-300">
            <Building2 className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg md:text-xl text-white tracking-tight">
                TRƯỜNG TH & THCS NGUYỄN ĐÌNH CHIỂU
              </h1>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-semibold px-2 py-0.5 rounded">
                Năm học 2026 - 2027
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-300">Hệ thống Đánh giá Xếp loại Viên chức</span>
              <span className="text-slate-500">•</span>
              <span className={`text-[10px] px-2 py-0.2 rounded border font-semibold ${roleBadge.color}`}>
                {roleBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Period selector & Current User card */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700 shadow-inner">
            <Calendar className="w-4 h-4 text-amber-400 ml-2 mr-1.5 shrink-0" />
            <select
              value={currentPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="bg-transparent text-white text-xs font-medium py-1 px-2 focus:outline-none cursor-pointer pr-4"
            >
              {EVALUATION_PERIODS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.label} {p.isCurrent ? '(Đang diễn ra)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Quick action: Đưa bảng điểm về 0 để chấm */}
          {onResetAllToZero && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn đưa toàn bộ bảng điểm của kỳ hiện tại về 0 để bắt đầu chấm điểm lại từ đầu không?')) {
                  onResetAllToZero();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/50 rounded-lg text-xs font-semibold shadow-sm transition-all"
              title="Đưa toàn bộ bảng điểm thi đua về 0 để chấm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Về 0 để chấm</span>
            </button>
          )}

          {/* User Account / Role Badge */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1 gap-1">
            <div 
              onClick={onOpenLogin}
              title="Tên đăng nhập & phân quyền"
              className="flex items-center space-x-2 py-1 px-2.5 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                {currentUser.hoTen.split(' ').slice(-1)[0][0]}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white line-clamp-1">{currentUser.hoTen}</span>
                  {currentUser.isDangVien && (
                    <span className="text-[9px] bg-red-950 text-red-300 px-1 py-0.2 rounded border border-red-800">
                      ĐV
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">@{currentUser.username}</div>
              </div>
            </div>

            {/* Quick action buttons: Change password & Logout */}
            <div className="flex items-center border-l border-slate-700 pl-1 pr-1 gap-0.5">
              <button
                onClick={onOpenChangePassword}
                title="Đổi mật khẩu tài khoản"
                className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenLogin}
                title="Chuyển đổi tài khoản khác"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                title="Đăng xuất khỏi hệ thống"
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs with strict permission filtering */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto py-1 scrollbar-none">
          {/* Tab 1: Always available for all users */}
          <button
            onClick={() => onTabChange('self')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'self'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Phiếu Tự Chấm ({currentUser.hoTen.split(' ').slice(-1)[0]})</span>
          </button>

          {/* Tab 2: RESTRICTED to Evaluators (Tổ trưởng / PHT / HT) */}
          {isEvaluator ? (
            <button
              onClick={() => onTabChange('grading')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'grading'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>2. Thẩm Định & Chấm Thi Đua</span>
              {pendingForEvaluatorCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingForEvaluatorCount}
                </span>
              )}
            </button>
          ) : (
            <div className="hidden"></div>
          )}

          {/* Tab 3: RESTRICTED strictly to BGH (Hiệu trưởng & Phó Hiệu trưởng) */}
          {isBgh && (
            <button
              onClick={() => onTabChange('bgh')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'bgh'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. BGH Phê Duyệt Toàn Trường</span>
              {pendingForBghCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingForBghCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onTabChange('reports')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>4. Bảng Tổng Hợp & Xếp Loại</span>
          </button>

          <button
            onClick={() => onTabChange('directory')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>5. Danh Bạ & Phân Công (70 CB-GV)</span>
          </button>

          <button
            onClick={() => onTabChange('regulations')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'regulations'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>6. Quy Chế & Biểu Mẫu NĐ 233</span>
          </button>
        </div>
      </div>
    </header>
  );
};
