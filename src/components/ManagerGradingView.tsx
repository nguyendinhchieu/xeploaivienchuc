import React, { useState } from 'react';
import { Staff, EvaluationRecord, CriterionScore } from '../types';
import { STAFF_LIST } from '../data/staffData';
import { getCriteriaForTarget, calculateXepLoai, EVALUATION_PERIODS } from '../data/criteriaData';
import { 
  UserCheck, 
  Search, 
  Check, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Award,
  Sparkles,
  Info,
  X,
  Send,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManagerGradingViewProps {
  currentUser: Staff;
  currentPeriod: string;
  evaluations: Record<string, EvaluationRecord>;
  onUpdateEvaluation: (record: EvaluationRecord) => void;
  onOpenDecreeForm: (staff: Staff, record: EvaluationRecord) => void;
  onResetEvaluatorScores?: () => void;
}

export const ManagerGradingView: React.FC<ManagerGradingViewProps> = ({
  currentUser,
  currentPeriod,
  evaluations,
  onUpdateEvaluation,
  onOpenDecreeForm,
  onResetEvaluatorScores,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editingScores, setEditingScores] = useState<Record<string, CriterionScore>>({});
  const [meetingNote, setMeetingNote] = useState('');
  const [filterScope, setFilterScope] = useState<'MY_ASSIGNMENT' | 'ALL'>('MY_ASSIGNMENT');
  const [notification, setNotification] = useState<string | null>(null);

  const periodObj = EVALUATION_PERIODS.find((p) => p.id === currentPeriod) || EVALUATION_PERIODS[2];

  // Strictly restrict staff based on evaluator assignment
  const assignedStaff = STAFF_LIST.filter((s) => {
    if (filterScope === 'ALL' && currentUser.role === 'HIEU_TRUONG') return true;
    if (currentUser.role === 'HIEU_TRUONG') {
      // Hiệu trưởng reviews PHT and TT directly, or all if toggled
      return s.evaluatorId === currentUser.id || s.evaluatorId === 'UBND_XA';
    }
    // STRICT RESTRICTION: Other evaluators can ONLY see and grade staff assigned to them!
    return s.evaluatorId === currentUser.id;
  });

  const displayStaff = assignedStaff.filter((s) =>
    s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.viTri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.toCM.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats on assigned staff
  const totalAssigned = assignedStaff.length;
  let excellentCount = 0;
  let goodCount = 0;
  let completedCount = 0;
  let pendingCount = 0;

  assignedStaff.forEach((s) => {
    const key = `${s.id}_${currentPeriod}`;
    const rec = evaluations[key];
    if (!rec || rec.status === 'DRAFT') {
      pendingCount++;
    } else {
      const xl = rec.evaluatorXepLoai || rec.selfXepLoai;
      if (xl === 'Hoàn thành xuất sắc nhiệm vụ') excellentCount++;
      else if (xl === 'Hoàn thành tốt nhiệm vụ') goodCount++;
      else if (xl === 'Hoàn thành nhiệm vụ') completedCount++;
    }
  });

  // Quota calculation (≤ 20% of Good & Excellent)
  const totalGoodAndExcellent = excellentCount + goodCount;
  const excellentPercentage = totalGoodAndExcellent > 0 ? (excellentCount / totalGoodAndExcellent) * 100 : 0;
  const isOverQuota = excellentPercentage > 20 && excellentCount > 1;

  // Open grading modal for a staff member
  const handleOpenGrading = (staff: Staff) => {
    setSelectedStaff(staff);
    const key = `${staff.id}_${currentPeriod}`;
    const rec = evaluations[key];
    const criteria = getCriteriaForTarget(staff.targetType);

    if (rec) {
      const initialScores: Record<string, CriterionScore> = {};
      criteria.forEach((c) => {
        const existing = rec.scores?.[c.id];
        initialScores[c.id] = {
          criterionId: c.id,
          selfScore: existing?.selfScore ?? 0,
          evaluatorScore: existing?.evaluatorScore !== undefined ? existing.evaluatorScore : (existing?.selfScore ?? 0),
          evidence: existing?.evidence || '',
          note: existing?.note || '',
        };
      });
      setEditingScores(initialScores);
      setMeetingNote(rec.ýKiếnCuộcHọpTổ || 'Tổ chuyên môn nhất trí với kết quả công tác và thống nhất điểm đánh giá.');
    } else {
      const initialScores: Record<string, CriterionScore> = {};
      criteria.forEach((c) => {
        initialScores[c.id] = {
          criterionId: c.id,
          selfScore: 0,
          evaluatorScore: 0,
          evidence: '',
          note: '',
        };
      });
      setEditingScores(initialScores);
      setMeetingNote('Tổ chuyên môn nhất trí với kết quả công tác và thống nhất điểm đánh giá.');
    }
  };

  const handleScoreChange = (criterionId: string, valStr: string, maxScore: number) => {
    const val = valStr === '' ? 0 : Math.min(Math.max(parseFloat(valStr) || 0, 0), maxScore);
    setEditingScores((prev) => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        criterionId,
        evaluatorScore: val,
      },
    }));
  };

  const handleApplyAllSelfScores = () => {
    if (!selectedStaff) return;
    const next: Record<string, CriterionScore> = { ...editingScores };
    Object.keys(next).forEach((cId) => {
      next[cId] = {
        ...next[cId],
        evaluatorScore: next[cId].selfScore,
      };
    });
    setEditingScores(next);
  };

  const handleSetAllToZero = () => {
    const next: Record<string, CriterionScore> = { ...editingScores };
    Object.keys(next).forEach((cId) => {
      next[cId] = {
        ...next[cId],
        evaluatorScore: 0,
      };
    });
    setEditingScores(next);
  };

  const handleSetAllToMax = () => {
    if (!selectedStaff) return;
    const criteria = getCriteriaForTarget(selectedStaff.targetType);
    const next: Record<string, CriterionScore> = { ...editingScores };
    criteria.forEach((c) => {
      next[c.id] = {
        ...next[c.id],
        evaluatorScore: c.maxScore,
      };
    });
    setEditingScores(next);
  };

  const handleSaveGrading = (submitToBgh: boolean = false) => {
    if (!selectedStaff) return;
    const key = `${selectedStaff.id}_${currentPeriod}`;
    const rec = evaluations[key];
    const criteria = getCriteriaForTarget(selectedStaff.targetType);

    let totalEval = 0;
    criteria.forEach((c) => {
      totalEval += editingScores[c.id]?.evaluatorScore || 0;
    });

    const hasProd = rec?.hasExemplaryProduct || false;
    const evaluatorXepLoai = calculateXepLoai(totalEval, hasProd);

    const updated: EvaluationRecord = {
      id: key,
      staffId: selectedStaff.id,
      period: currentPeriod,
      scores: editingScores,
      selfTotal: rec?.selfTotal ?? totalEval,
      evaluatorTotal: totalEval,
      bghTotal: rec?.bghTotal,
      selfXepLoai: rec?.selfXepLoai || evaluatorXepLoai,
      evaluatorXepLoai,
      bghXepLoai: rec?.bghXepLoai,
      hasExemplaryProduct: hasProd,
      exemplaryDetail: rec?.exemplaryDetail,
      status: submitToBgh ? 'EVALUATED' : (rec?.status || 'SUBMITTED'),
      submittedAt: rec?.submittedAt || new Date().toLocaleString('vi-VN'),
      evaluatedAt: new Date().toLocaleString('vi-VN'),
      evaluatedBy: currentUser.hoTen + ' (' + currentUser.viTri + ')',
      approvedAt: rec?.approvedAt,
      approvedBy: rec?.approvedBy,
      tựNhậnXetƯuĐiểm: rec?.tựNhậnXetƯuĐiểm,
      tựNhậnXetKhuyếtĐiểm: rec?.tựNhậnXetKhuyếtĐiểm,
      ýKiếnCuộcHọpTổ: meetingNote,
      ýKiếnCấpỦy: rec?.ýKiếnCấpỦy,
    };

    onUpdateEvaluation(updated);

    if (submitToBgh) {
      confetti({ particleCount: 50, spread: 50 });
      setNotification(`Đã hoàn thành chấm thi đua và gửi kết quả của ${selectedStaff.hoTen} lên Ban Giám hiệu.`);
    } else {
      setNotification(`Đã lưu điểm thẩm định của ${selectedStaff.hoTen}.`);
    }

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
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2 py-0.5 rounded">
                Thẩm quyền thẩm định & chấm thi đua
              </span>
              <span className="text-amber-200 text-xs">
                {periodObj.label} • Quy chế NĐ 233
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              BẢNG THẨM ĐỊNH & CHẤM THI ĐUA TỔ CHUYÊN MÔN / BỘ PHẬN
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Người phụ trách: <span className="font-bold text-white">{currentUser.hoTen}</span> ({currentUser.viTri}) •{' '}
              <span className="text-amber-300">{currentUser.phuTrachCham}</span>
            </p>
          </div>

          {/* Quick toggle if Principal */}
          {currentUser.role === 'HIEU_TRUONG' && (
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setFilterScope('MY_ASSIGNMENT')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterScope === 'MY_ASSIGNMENT' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                PHT & Tổ trưởng trực tiếp ({assignedStaff.length})
              </button>
              <button
                onClick={() => setFilterScope('ALL')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterScope === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Toàn trường (70)
              </button>
            </div>
          )}
        </div>

        {/* Quota & Rules banner */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Khống chế tỷ lệ Xuất Sắc (Điều 2, 9):</span>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                {excellentCount} Xuất sắc
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700">{totalGoodAndExcellent} Tốt & Xuất sắc</span>
              <span className="text-slate-400">•</span>
              <span className={`px-2 py-0.5 rounded font-bold ${isOverQuota ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-slate-200 text-slate-800'}`}>
                {excellentPercentage.toFixed(1)}% (Chỉ tiêu: ≤ 20%)
              </span>
            </div>
          </div>

          {isOverQuota && (
            <div className="flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-medium text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Cảnh báo: Tỷ lệ Xuất sắc đang vượt quá 20% theo quy định Nghị định 233!</span>
            </div>
          )}
        </div>

        {/* Toast notification */}
        {notification && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Search and summary metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm cán bộ theo tên, môn dạy, vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {onResetEvaluatorScores && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn đưa điểm thẩm định của toàn bộ ${assignedStaff.length} cán bộ thuộc thẩm quyền về 0 để tổ chuyên môn bắt đầu chấm mới?`)) {
                  onResetEvaluatorScores();
                  setNotification('Đã đưa toàn bộ điểm tổ chấm về 0 để tổ chuyên môn bắt đầu chấm điểm.');
                  setTimeout(() => setNotification(null), 3500);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Đặt lại điểm tổ thẩm định về 0 cho tất cả cán bộ được phân công"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Đưa điểm tổ về 0 để chấm</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Phụ trách chấm:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              {assignedStaff.length} người
            </span>
            <span className="text-slate-500 ml-2">Hạn gửi BGH:</span>
            <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              {periodObj.deadlineEvaluator}
            </span>
          </div>
        </div>
      </div>

      {/* Staff List Table for Grading */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[200px]">Họ và tên cán bộ</th>
                <th className="py-3 px-3">Cơ sở / Tổ CM</th>
                <th className="py-3 px-3">Vị trí & Môn</th>
                <th className="py-3 px-3 text-center w-24">Cá nhân tự chấm</th>
                <th className="py-3 px-3 text-center w-24 bg-amber-50 text-amber-900 border-x border-amber-200">
                  Tổ đã chấm
                </th>
                <th className="py-3 px-3 text-center w-28">Xếp loại đề xuất</th>
                <th className="py-3 px-3 text-center w-28">Trạng thái</th>
                <th className="py-3 px-4 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayStaff.map((staff) => {
                const key = `${staff.id}_${currentPeriod}`;
                const rec = evaluations[key];
                const hasExemplary = rec?.hasExemplaryProduct;
                const selfScore = rec ? rec.selfTotal : null;
                const evalScore = rec?.evaluatorTotal;
                const xl = rec?.evaluatorXepLoai || rec?.selfXepLoai;

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
                        {hasExemplary && (
                          <span title="Có sản phẩm vượt mức (STEM/HSG/AI)" className="text-amber-500">
                            ★
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{staff.sdt}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{staff.toCM}</div>
                      <div className="text-[11px] text-slate-500">{staff.coSo}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{staff.viTri}</div>
                      <div className="text-[11px] text-slate-500">{staff.monDay}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-blue-700">
                      {selfScore !== null ? (
                        <span>{selfScore} đ</span>
                      ) : (
                        <span className="text-slate-400 font-normal">Chưa nộp</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-950 bg-amber-50/50 border-x border-amber-200">
                      {evalScore !== undefined ? (
                        <span className="text-sm">{evalScore} đ</span>
                      ) : (
                        <span className="text-amber-600 font-normal">Chưa chấm</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {xl ? (
                        <span className={`text-[11px] px-2 py-0.5 rounded border inline-block ${getBadgeColor(xl)}`}>
                          {xl === 'Hoàn thành xuất sắc nhiệm vụ' ? 'Xuất sắc' : xl === 'Hoàn thành tốt nhiệm vụ' ? 'Tốt' : xl}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {rec?.status === 'APPROVED' ? (
                        <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          BGH đã duyệt
                        </span>
                      ) : rec?.status === 'EVALUATED' ? (
                        <span className="text-blue-700 font-semibold text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Đã thẩm định
                        </span>
                      ) : rec?.status === 'SUBMITTED' ? (
                        <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Chờ tổ chấm
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Chưa nộp</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center space-x-1">
                      <button
                        onClick={() => handleOpenGrading(staff)}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        {evalScore !== undefined ? 'Sửa điểm' : 'Chấm điểm'}
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

      {/* Grading Drawer / Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  Thẩm định & Chấm thi đua tháng • {periodObj.label}
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

            {/* Quick Actions & Notes */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Người chấm: <strong>{currentUser.hoTen}</strong> ({currentUser.viTri})</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSetAllToZero}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                  title="Đưa toàn bộ điểm tổ chấm về 0 để chấm từng tiêu chí từ đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Đưa về 0 điểm để chấm</span>
                </button>
                <button
                  type="button"
                  onClick={handleApplyAllSelfScores}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Nhất trí điểm tự chấm
                </button>
                <button
                  type="button"
                  onClick={handleSetAllToMax}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chấm tối đa (100đ)</span>
                </button>
              </div>
            </div>

            {/* Criteria Grading Form */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <th className="py-2.5 px-2 w-10 text-center">TT</th>
                    <th className="py-2.5 px-3">Tiêu chí đánh giá</th>
                    <th className="py-2.5 px-2 text-center w-16">Tối đa</th>
                    <th className="py-2.5 px-2 text-center w-24">Tự chấm</th>
                    <th className="py-2.5 px-2 text-center w-28 bg-amber-50 text-amber-950">Tổ chấm</th>
                    <th className="py-2.5 px-3">Minh chứng của GV / Ghi chú tổ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getCriteriaForTarget(selectedStaff.targetType).map((c) => {
                    const selfVal = editingScores[c.id]?.selfScore ?? 0;
                    const evalVal = editingScores[c.id]?.evaluatorScore !== undefined ? editingScores[c.id].evaluatorScore : (editingScores[c.id]?.selfScore ?? 0);
                    const evidence = editingScores[c.id]?.evidence || '';

                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 text-center font-bold text-slate-500">{c.code}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-800">{c.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{c.description}</div>
                          {c.rulesHint && (
                            <div className="text-[10px] text-amber-700 mt-0.5">{c.rulesHint}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-700">{c.maxScore}</td>
                        <td className="py-2.5 px-2 text-center font-bold text-blue-700 bg-blue-50/40">
                          {selfVal}
                        </td>
                        <td className="py-2.5 px-2 text-center bg-amber-50/60">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={c.maxScore}
                            value={evalVal}
                            onChange={(e) => handleScoreChange(c.id, e.target.value, c.maxScore)}
                            className="w-16 text-center font-bold text-amber-950 bg-white border border-amber-400 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {evidence ? (
                            <div className="bg-slate-50 p-1.5 rounded border border-slate-200">{evidence}</div>
                          ) : (
                            <span className="text-slate-400 italic">Không có ghi chú</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Meeting remarks */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Ý kiến góp ý, nhận xét tại cuộc họp Tổ chuyên môn / Tổ văn phòng:
                </label>
                <textarea
                  rows={2}
                  value={meetingNote}
                  onChange={(e) => setMeetingNote(e.target.value)}
                  placeholder="Ghi nhận ý kiến đóng góp của tập thể tổ tại cuộc họp xét thi đua tháng..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <div className="text-xs text-slate-600">
                * Bấm <strong>"Hoàn thành & Gửi BGH"</strong> để chuyển điểm sang bước phê duyệt chính thức của Nhà trường.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleSaveGrading(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                >
                  Lưu tạm
                </button>
                <button
                  onClick={() => handleSaveGrading(true)}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Hoàn thành & Gửi BGH</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
