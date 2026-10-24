import React, { useState } from 'react';
import { Staff } from '../types';
import { STAFF_LIST } from '../data/staffData';
import { 
  Users, 
  Search, 
  Building2, 
  Phone, 
  CreditCard, 
  Award, 
  ShieldCheck, 
  ExternalLink,
  UserCheck
} from 'lucide-react';

interface StaffDirectoryViewProps {
  currentUser: Staff;
  onSelectUser: (staff: Staff) => void;
}

export const StaffDirectoryView: React.FC<StaffDirectoryViewProps> = ({
  currentUser,
  onSelectUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState<'ALL' | 'Trụ sở chính' | 'Phân hiệu 1' | 'Phân hiệu 2'>('ALL');
  const [toFilter, setToFilter] = useState<string>('ALL');

  const uniqueDepartments = Array.from(new Set(STAFF_LIST.map((s) => s.toCM)));

  const filteredStaff = STAFF_LIST.filter((s) => {
    const matchesSearch =
      s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sdt.includes(searchTerm) ||
      s.cccd.includes(searchTerm) ||
      s.monDay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.viTri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phuTrachCham.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCampus = campusFilter === 'ALL' || s.coSo === campusFilter;
    const matchesTo = toFilter === 'ALL' || s.toCM === toFilter;

    return matchesSearch && matchesCampus && matchesTo;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2 py-0.5 rounded">
                Danh sách chính thức
              </span>
              <span className="text-amber-200 text-xs">
                Năm học 2026 - 2027 • Quyết định phân công chuyên môn
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              DANH BẠ CÁN BỘ, GIÁO VIÊN, NHÂN VIÊN & PHÂN CÔNG CHẤM THI ĐUA
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Tổng số: 70 nhân sự tại 3 điểm trường (Trụ sở chính, Phân hiệu 1, Phân hiệu 2)
            </p>
          </div>
        </div>

        {/* Breakdown by campus */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Trụ sở chính:</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">24 Giáo viên & 5 Nhân viên</div>
            <span className="text-[11px] text-blue-700">KHTN, KHXH, Văn phòng</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Phân hiệu 1:</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">26 Giáo viên & 1 Nhân viên</div>
            <span className="text-[11px] text-blue-700">Tổ 1,2; Tổ 3; Tổ 4,5; Tổ BM</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Phân hiệu 2:</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">12 Giáo viên & 2 Nhân viên</div>
            <span className="text-[11px] text-blue-700">Tổ 1,2; Tổ 3; Tổ 4,5; Tổ BM</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, CCCD, phân công..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Campus Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Trụ sở chính', 'Phân hiệu 1', 'Phân hiệu 2'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCampusFilter(c)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  campusFilter === c ? 'bg-blue-700 text-white font-bold' : 'text-slate-600'
                }`}
              >
                {c === 'ALL' ? 'Tất cả (70)' : c}
              </button>
            ))}
          </div>

          {/* Department filter */}
          <select
            value={toFilter}
            onChange={(e) => setToFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl text-xs font-medium py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả Tổ chuyên môn</option>
            {uniqueDepartments.map((to) => (
              <option key={to} value={to}>
                {to}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredStaff.map((staff) => {
          const isCurrent = currentUser.id === staff.id;

          return (
            <div
              key={staff.id}
              className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-amber-400 shadow-md ring-2 ring-amber-400/40 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        staff.role === 'HIEU_TRUONG'
                          ? 'bg-red-700 text-white shadow-sm'
                          : staff.role === 'PHO_HIEU_TRUONG'
                          ? 'bg-amber-600 text-white'
                          : staff.role === 'TO_TRUONG'
                          ? 'bg-blue-700 text-white'
                          : staff.role === 'TO_PHO'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {staff.stt}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{staff.hoTen}</span>
                        {staff.isDangVien && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1 py-0.2 rounded border border-red-200">
                            ĐV
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {staff.viTri} • {staff.monDay}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    {staff.coSo}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tổ CM:</span>
                    <span className="font-semibold text-slate-800">{staff.toCM}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ngày sinh:</span>
                    <span>{staff.ngaySinh} ({staff.gioiTinh} - {staff.danToc})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trình độ:</span>
                    <span>{staff.trinhDo}</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-50/60 p-1.5 rounded-lg border border-blue-100 font-mono">
                    <span className="text-blue-900 font-bold">Tài khoản: @{staff.username}</span>
                    <span className="text-amber-950 font-bold bg-amber-100 px-1.5 py-0.2 rounded text-[11px]">
                      MK: {staff.defaultPassword}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CCCD:</span>
                    <span className="font-mono text-[11px]">{staff.cccd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Điện thoại / Zalo:</span>
                    <a
                      href={`tel:${staff.sdt}`}
                      className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {staff.sdt}
                    </a>
                  </div>
                  {staff.ghiChu && (
                    <div className="text-amber-700 bg-amber-50 px-2 py-1 rounded text-[11px] font-medium border border-amber-200">
                      Ghi chú: {staff.ghiChu}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50 -mx-4 -mb-4 p-3 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Phân công & Giới hạn quyền:
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      staff.role === 'HIEU_TRUONG' 
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : staff.role === 'PHO_HIEU_TRUONG'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : staff.phuTrachCham.includes('chấm')
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}>
                      {staff.role === 'HIEU_TRUONG' 
                        ? 'Toàn quyền BGH'
                        : staff.role === 'PHO_HIEU_TRUONG'
                        ? 'BGH phụ trách'
                        : staff.phuTrachCham.includes('chấm')
                        ? 'Tổ trưởng chấm'
                        : 'Viên chức tự chấm'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-900 font-bold mt-1">
                    {staff.phuTrachCham}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Người chấm trực tiếp: <strong>{staff.evaluatorName}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2">
                <button
                  onClick={() => onSelectUser(staff)}
                  className={`w-full py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-100 hover:bg-blue-50 text-blue-800 hover:text-blue-950 border border-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isCurrent ? 'Đang đăng nhập' : 'Chuyển sang tài khoản này'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
