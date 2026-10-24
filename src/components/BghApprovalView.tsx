import React, { useState } from 'react';
import { Staff, EvaluationRecord, CriterionScore, XepLoai } from '../types';
import { STAFF_LIST } from '../data/staffData';
import { calculateXepLoai, EVALUATION_PERIODS, getCriteriaForTarget } from '../data/criteriaData';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  Award, 
  Clock, 
  Printer, 
  Sparkles,
  Layers,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BghApprovalViewProps {
  currentUser: Staff;
  currentPeriod: string;
  evaluations: Record<string, EvaluationRecord>;
  onBatchApprove: (updatedRecords: Record<string, EvaluationRecord>) => void;
  onUpdateEvaluation: (record: EvaluationRecord) => void;
  onOpenDecreeForm: (staff: Staff, record: EvaluationRecord) => void;
  onResetAllToZero?: () => void;
}

export const BghApprovalView: React.FC<BghApprovalViewProps> = ({
  currentUser,
  currentPeriod,
  evaluations,
  onBatchApprove,
  onUpdateEvaluation,
  onOpenDecreeForm,
  onResetAllToZero,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState<'ALL' | 'Trụ sở chính' | 'Phân hiệu 1' | 'Phân hiệu 2'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEED_APPROVAL' | 'APPROVED'>('ALL');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editingBghScores, setEditingBghScores] = useState<Record<string, CriterionScore>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const periodObj = EVALUATION_PERIODS.find((p) => p.id === currentPeriod) || EVALUATION_PERIODS[2];

  // Calculate global school statistics
  let totalStaff = STAFF_LIST.length;
  let approvedCount = 0;
  let evaluatedWaitingBgh = 0;
  let submittedWaitingOrg = 0;
  let draftCount = 0;

  let schoolExcellent = 0;
  let schoolGood = 0;
  let schoolCompleted = 0;
  let schoolNotCompleted = 0;

  STAFF_LIST.forEach((s) => {
    const key = `${s.id}_${currentPeriod}`;
    const rec = evaluations[key];
    if (!rec || rec.status === 'DRAFT') {
      draftCount++;
    } else if (rec.status === 'SUBMITTED') {
      submittedWaitingOrg++;
    } else if (rec.status === 'EVALUATED') {
      evaluatedWaitingBgh++;
    } else if (rec.status === 'APPROVED') {
      approvedCount++;
    }

    const xl = rec?.bghXepLoai || rec?.evaluatorXepLoai || rec?.selfXepLoai;
    if (xl === 'Hoàn thành xuất sắc nhiệm vụ') schoolExcellent++;
    else if (xl === 'Hoàn thành tốt nhiệm vụ') schoolGood++;
    else if (xl === 'Hoàn thành nhiệm vụ') schoolCompleted++;
    else if (xl === 'Không hoàn thành nhiệm vụ') schoolNotCompleted++;
  });

  const totalGoodAndExcellent = schoolExcellent + schoolGood;
  const schoolExcellentRate = totalGoodAndExcellent > 0 ? (schoolExcellent / totalGoodAndExcellent) * 100 : 0;
  const isSchoolOverQuota = schoolExcellentRate > 20;

  const filteredStaff = STAFF_LIST.filter((s) => {
    const key = `${s.id}_${currentPeriod}`;
    const rec = evaluations[key];

    const matchesSearch =
      s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.toCM.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.viTri.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCampus = campusFilter === 'ALL' || s.coSo === campusFilter;

    let matchesStatus = true;
    if (statusFilter === 'NEED_APPROVAL') {
      matchesStatus = rec?.status === 'EVALUATED';
    } else if (statusFilter === 'APPROVED') {
      matchesStatus = rec?.status === 'APPROVED';
    }

    return matchesSearch && matchesCampus && matchesStatus;
  });

  // Handle Batch Approve all EVALUATED records
  const handleApproveAllPending = () => {
    const updated = { ...evaluations };
    let count = 0;

    STAFF_LIST.forEach((s) => {
      const key = `${s.id}_${currentPeriod}`;
      const rec = updated[key];
      if (rec && rec.status === 'EVALUATED') {
        const criteria = getCriteriaForTarget(s.targetType);
        let bghTotal = rec.evaluatorTotal ?? rec.selfTotal;

        // Copy evaluator scores to BGH scores if not present
        const nextScores = { ...rec.scores };
        criteria.forEach((c) => {
          if (nextScores[c.id]) {
            nextScores[c.id].bghScore = nextScores[c.id].evaluatorScore ?? nextScores[c.id].selfScore;
          }
        });

        updated[key] = {
          ...rec,
          scores: nextScores,
          bghTotal,
          bghXepLoai: calculateXepLoai(bghTotal, rec.hasExemplaryProduct),
          status: 'APPROVED',
          approvedAt: new Date().toLocaleString('vi-VN'),
          approvedBy: currentUser.hoTen + ' (Hiệu trưởng)',
        };
        count++;
      }
    });

    onBatchApprove(updated);
    confetti({ particleCount: 100, spread: 70 });
    setNotification(`Đã phê duyệt hoàn tất ${count} hồ sơ đánh giá thi đua toàn trường!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenBghGrading = (staff: Staff) => {
    setSelectedStaff(staff);
    const key = `${staff.id}_${currentPeriod}`;
    const rec = evaluations[key];
    const criteria = getCriteriaForTarget(staff.targetType);

    const initialScores: Record<string, CriterionScore> = {};
    criteria.forEach((c) => {
      const existing = rec?.scores?.[c.id];
      initialScores[c.id] = {
        criterionId: c.id,
        selfScore: existing?.selfScore ?? 0,
        evaluatorScore: existing?.evaluatorScore !== undefined ? existing.evaluatorScore : (existing?.selfScore ?? 0),
        bghScore: existing?.bghScore !== undefined ? existing.bghScore : (existing?.evaluatorScore !== undefined ? existing.evaluatorScore : 0),
        evidence: existing?.evidence || '',
      };
    });
    setEditingBghScores(initialScores);
  };

  const handleSetAllBghToZero = () => {
    const next: Record<string, CriterionScore> = { ...editingBghScores };
    Object.keys(next).forEach((cId) => {
      next[cId] = {
        ...next[cId],
        bghScore: 0,
      };
    });
    setEditingBghScores(next);
  };

  const handleApplyEvaluatorScores = () => {
    const next: Record<string, CriterionScore> = { ...editingBghScores };
    Object.keys(next).forEach((cId) => {
      next[cId] = {
        ...next[cId],
        bghScore: next[cId].evaluatorScore ?? 0,
      };
    });
    setEditingBghScores(next);
  };

  const handleSetAllBghToMax = () => {
    if (!selectedStaff) return;
    const criteria = getCriteriaForTarget(selectedStaff.targetType);
    const next: Record<string, CriterionScore> = { ...editingBghScores };
    criteria.forEach((c) => {
      next[c.id] = {
        ...next[c.id],
        bghScore: c.maxScore,
      };
    });
    setEditingBghScores(next);
  };

  const handleSaveBghGrade = () => {
    if (!selectedStaff) return;
    const key = `${selectedStaff.id}_${currentPeriod}`;
    const rec = evaluations[key];
    const criteria = getCriteriaForTarget(selectedStaff.targetType);

    let bghTotal = 0;
    criteria.forEach((c) => {
      bghTotal += editingBghScores[c.id]?.bghScore || 0;
    });

    const hasProd = rec?.hasExemplaryProduct || false;
    const bghXepLoai = calculateXepLoai(bghTotal, hasProd);

    const updated: EvaluationRecord = {
      id: key,
      staffId: selectedStaff.id,
      period: currentPeriod,
      scores: editingBghScores,
      selfTotal: rec?.selfTotal ?? bghTotal,
      evaluatorTotal: rec?.evaluatorTotal ?? bghTotal,
      bghTotal,
      selfXepLoai: rec?.selfXepLoai || bghXepLoai,
      evaluatorXepLoai: rec?.evaluatorXepLoai || bghXepLoai,
      bghXepLoai,
      hasExemplaryProduct: hasProd,
      exemplaryDetail: rec?.exemplaryDetail,
      status: 'APPROVED',
      submittedAt: rec?.submittedAt || new Date().toLocaleString('vi-VN'),
      evaluatedAt: rec?.evaluatedAt || new Date().toLocaleString('vi-VN'),
      evaluatedBy: rec?.evaluatedBy || selectedStaff.evaluatorName,
      approvedAt: new Date().toLocaleString('vi-VN'),
      approvedBy: currentUser.hoTen + ' (Hiệu trưởng)',
      tựNhậnXetƯuĐiểm: rec?.tựNhậnXetƯuĐiểm,
      tựNhậnXetKhuyếtĐiểm: rec?.tựNhậnXetKhuyếtĐiểm,
      ýKiếnCuộcHọpTổ: rec?.ýKiếnCuộcHọpTổ,
      ýKiếnCấpỦy: 'Nhất trí với đề xuất xếp loại của Hội đồng và quyết định của Hiệu trưởng.',
    };

    onUpdateEvaluation(updated);
    setNotification(`Đã phê duyệt chính thức kết quả của ${selectedStaff.hoTen} (${bghTotal}đ - ${bghXepLoai}).`);
    setSelectedStaff(null);
    setTimeout(() => setNotification(null), 4000);
  };

  const getBadgeColor = (xl?: string) => {
    switch (xl) {
      case 'Hoàn thành xuất sắc nhiệm vụ':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Hoàn thành tốt nhiệm vụ':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'Hoàn thành nhiệm vụ':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'Không hoàn thành nhiệm vụ':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded uppercase">
                Thẩm quyền Ban Giám hiệu (Điều 13 & 14)
              </span>
              <span className="text-amber-200 text-xs font-semibold">
                Trường TH&THCS Nguyễn Đình Chiểu • {periodObj.label}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              BẢNG PHÊ DUYỆT & CÔNG NHẬN KẾT QUẢ ĐÁNH GIÁ TOÀN TRƯỜNG
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Căn cứ thẩm quyền Hiệu trưởng theo Nghị định số 233/2026/NĐ-CP và Quy chế số 23/10/2026-QĐ-NĐC
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
            {onResetAllToZero && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('CẢNH BÁO BAN GIÁM HIỆU:\nBạn có chắc chắn muốn đưa toàn bộ bảng điểm thi đua của toàn trường về 0 điểm để bắt đầu đánh giá chấm điểm lại từ đầu không?')) {
                    onResetAllToZero();
                    setNotification('Đã đưa toàn bộ bảng điểm của toàn trường về 0 điểm thành công!');
                    setTimeout(() => setNotification(null), 3500);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md border border-rose-400/40 transition-all active:scale-95"
                title="Khởi tạo lại toàn bộ bảng điểm thi đua của trường về 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đưa bảng điểm về 0 để chấm</span>
              </button>
            )}
            {evaluatedWaitingBgh > 0 && (
              <button
                onClick={handleApproveAllPending}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Duyệt nhanh tất cả hồ sơ tổ đã chấm ({evaluatedWaitingBgh})</span>
              </button>
            )}
          </div>
        </div>

        {/* Quota & School status monitor */}
        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Đã phê duyệt chính thức</span>
            <span className="text-base font-black text-emerald-700">
              {approvedCount} / {totalStaff} hồ sơ
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Chờ BGH duyệt</span>
            <span className="text-base font-black text-blue-700">
              {evaluatedWaitingBgh} hồ sơ
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Tỷ lệ Xuất Sắc toàn trường</span>
            <span className={`text-base font-black ${isSchoolOverQuota ? 'text-red-700' : 'text-emerald-700'}`}>
              {schoolExcellentRate.toFixed(1)}% ({schoolExcellent} người)
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Quy định khống chế NĐ 233</span>
            <span className="text-xs font-bold text-amber-800">
              ≤ 20% (Tối đa 25% nếu nổi trội)
            </span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Filters and controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên cán bộ, môn, tổ chuyên môn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Campus tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Trụ sở chính', 'Phân hiệu 1', 'Phân hiệu 2'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCampusFilter(c)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  campusFilter === c ? 'bg-blue-700 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c === 'ALL' ? 'Tất cả cơ sở' : c}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-600'
              }`}
            >
              Tất cả ({totalStaff})
            </button>
            <button
              onClick={() => setStatusFilter('NEED_APPROVAL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'NEED_APPROVAL' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600'
              }`}
            >
              Chờ duyệt ({evaluatedWaitingBgh})
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
              }`}
            >
              Đã duyệt ({approvedCount})
            </button>
          </div>
        </div>
      </div>

      {/* School Approval Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[200px]">Cán bộ / Giáo viên</th>
                <th className="py-3 px-3">Cơ sở & Tổ</th>
                <th className="py-3 px-3">Người chấm trực tiếp</th>
                <th className="py-3 px-3 text-center w-20">Tự chấm</th>
                <th className="py-3 px-3 text-center w-20">Tổ chấm</th>
                <th className="py-3 px-3 text-center w-24 bg-amber-50 text-amber-900 border-x border-amber-200">
                  BGH duyệt
                </th>
                <th className="py-3 px-3 text-center w-32">Xếp loại chính thức</th>
                <th className="py-3 px-3 text-center w-28">Trạng thái</th>
                <th className="py-3 px-4 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => {
                const key = `${staff.id}_${currentPeriod}`;
                const rec = evaluations[key];
                const selfScore = rec?.selfTotal;
                const evalScore = rec?.evaluatorTotal;
                const bghScore = rec?.bghTotal;
                const finalXl = rec?.bghXepLoai || rec?.evaluatorXepLoai || rec?.selfXepLoai;

                return (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{staff.stt}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{staff.hoTen}</span>
                        {staff.isDangVien && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1.5 py-0.2 rounded border border-red-200">
                            ĐV
                          </span>
                        )}
                        {rec?.hasExemplaryProduct && (
                          <span title="Có sản phẩm / giải thưởng vượt mức" className="text-amber-500 font-bold">
                            ★
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {staff.viTri} • Môn: {staff.monDay}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{staff.toCM}</div>
                      <div className="text-[11px] text-slate-500">{staff.coSo}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div className="font-medium text-[11px]">{staff.evaluatorName}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-blue-700 font-medium">
                      {selfScore !== undefined ? `${selfScore}đ` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-800 font-semibold">
                      {evalScore !== undefined ? `${evalScore}đ` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-950 bg-amber-50/50 border-x border-amber-200">
                      {bghScore !== undefined ? (
                        <span className="text-sm">{bghScore}đ</span>
                      ) : (
                        <span className="text-slate-400 font-normal italic">Chưa duyệt</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {finalXl ? (
                        <span className={`text-[11px] px-2 py-0.5 rounded border inline-block ${getBadgeColor(finalXl)}`}>
                          {finalXl === 'Hoàn thành xuất sắc nhiệm vụ' ? 'Xuất sắc' : finalXl === 'Hoàn thành tốt nhiệm vụ' ? 'Tốt' : finalXl}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {rec?.status === 'APPROVED' ? (
                        <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Đã duyệt
                        </span>
                      ) : rec?.status === 'EVALUATED' ? (
                        <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Chờ BGH duyệt
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Chưa hoàn tất</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center space-x-1">
                      <button
                        onClick={() => handleOpenBghGrading(staff)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        {bghScore !== undefined ? 'Sửa phê duyệt' : 'Phê duyệt'}
                      </button>
                      {rec && (
                        <button
                          onClick={() => onOpenDecreeForm(staff, rec)}
                          title="Xem Phiếu theo mẫu NĐ 233"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg inline-block align-middle"
                        >
                          <Printer className="w-4 h-4" />
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

      {/* BGH Grading Dialog */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-950 to-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  Hiệu Trưởng Phê Duyệt Kết Quả Đánh Giá • {periodObj.label}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedStaff.hoTen} ({selectedStaff.viTri} - {selectedStaff.toCM})
                </h3>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick action bar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-600">
                Thẩm quyền: <strong>Hiệu trưởng phê duyệt điểm</strong>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSetAllBghToZero}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                  title="Đưa toàn bộ điểm duyệt về 0 để chấm lại"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Đưa về 0 điểm</span>
                </button>
                <button
                  type="button"
                  onClick={handleApplyEvaluatorScores}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Duyệt bằng điểm Tổ chấm
                </button>
                <button
                  type="button"
                  onClick={handleSetAllBghToMax}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Duyệt tối đa (100đ)</span>
                </button>
              </div>
            </div>

            {/* Criteria Form */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <th className="py-2.5 px-2 w-10 text-center">TT</th>
                    <th className="py-2.5 px-3">Tiêu chí</th>
                    <th className="py-2.5 px-2 text-center w-16">Tối đa</th>
                    <th className="py-2.5 px-2 text-center w-20">Tự chấm</th>
                    <th className="py-2.5 px-2 text-center w-20">Tổ chấm</th>
                    <th className="py-2.5 px-2 text-center w-28 bg-amber-50 text-amber-950">BGH duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getCriteriaForTarget(selectedStaff.targetType).map((c) => {
                    const selfVal = editingBghScores[c.id]?.selfScore ?? 0;
                    const evalVal = editingBghScores[c.id]?.evaluatorScore !== undefined ? editingBghScores[c.id].evaluatorScore : 0;
                    const bghVal = editingBghScores[c.id]?.bghScore !== undefined ? editingBghScores[c.id].bghScore : (editingBghScores[c.id]?.evaluatorScore ?? 0);

                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 text-center font-bold text-slate-500">{c.code}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-800">{c.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{c.description}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-700">{c.maxScore}</td>
                        <td className="py-2.5 px-2 text-center font-semibold text-blue-700">{selfVal}</td>
                        <td className="py-2.5 px-2 text-center font-semibold text-slate-800">{evalVal}</td>
                        <td className="py-2.5 px-2 text-center bg-amber-50/60">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={c.maxScore}
                            value={bghVal}
                            onChange={(e) => {
                              const val = Math.min(Math.max(parseFloat(e.target.value) || 0, 0), c.maxScore);
                              setEditingBghScores((prev) => ({
                                ...prev,
                                [c.id]: {
                                  ...prev[c.id],
                                  criterionId: c.id,
                                  bghScore: val,
                                },
                              }));
                            }}
                            className="w-16 text-center font-bold text-amber-950 bg-white border border-amber-400 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
              <div className="text-xs text-slate-600">
                Hiệu trưởng: <strong>Nguyễn Hồ Bắc</strong> phê duyệt chính thức
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveBghGrade}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-bold shadow-md"
                >
                  Xác nhận & Phê duyệt chính thức
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
