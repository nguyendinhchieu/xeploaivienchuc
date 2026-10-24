import React, { useState, useEffect } from 'react';
import { Staff, EvaluationRecord, CriterionScore } from '../types';
import { getCriteriaForTarget, calculateXepLoai, EVALUATION_PERIODS } from '../data/criteriaData';
import { 
  FileText, 
  Save, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Printer, 
  Info, 
  Clock, 
  HelpCircle,
  Award,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SelfEvaluationViewProps {
  currentUser: Staff;
  currentPeriod: string;
  evaluationRecord?: EvaluationRecord;
  onSaveEvaluation: (record: EvaluationRecord) => void;
  onOpenDecreeForm: (staff: Staff, record: EvaluationRecord) => void;
}

export const SelfEvaluationView: React.FC<SelfEvaluationViewProps> = ({
  currentUser,
  currentPeriod,
  evaluationRecord,
  onSaveEvaluation,
  onOpenDecreeForm,
}) => {
  const criteria = getCriteriaForTarget(currentUser.targetType);
  const periodObj = EVALUATION_PERIODS.find((p) => p.id === currentPeriod) || EVALUATION_PERIODS[2];

  // Initialize or load state
  const [scores, setScores] = useState<Record<string, CriterionScore>>({});
  const [hasExemplaryProduct, setHasExemplaryProduct] = useState(false);
  const [exemplaryDetail, setExemplaryDetail] = useState('');
  const [uuDiem, setUuDiem] = useState('');
  const [khuyetDiem, setKhuyetDiem] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (evaluationRecord) {
      setScores(evaluationRecord.scores || {});
      setHasExemplaryProduct(!!evaluationRecord.hasExemplaryProduct);
      setExemplaryDetail(evaluationRecord.exemplaryDetail || '');
      setUuDiem(evaluationRecord.tựNhậnXetƯuĐiểm || '');
      setKhuyetDiem(evaluationRecord.tựNhậnXetKhuyếtĐiểm || '');
    } else {
      // Default initial scores: Khởi tạo tất cả về 0 điểm để sẵn sàng tự chấm từ đầu
      const initial: Record<string, CriterionScore> = {};
      criteria.forEach((c) => {
        initial[c.id] = {
          criterionId: c.id,
          selfScore: 0,
          evidence: '',
        };
      });
      setScores(initial);
      setHasExemplaryProduct(false);
      setExemplaryDetail('');
      setUuDiem('Chấp hành nghiêm đường lối của Đảng, chính sách pháp luật của Nhà nước; gương mẫu trong công tác chuyên môn.');
      setKhuyetDiem('Cần tích cực nâng cao hơn nữa trình độ ngoại ngữ và công nghệ số.');
    }
  }, [evaluationRecord, currentUser.id, currentPeriod]);

  // Quick helper: Đưa toàn bộ bảng điểm về 0 để chấm
  const handleResetToZero = () => {
    const next: Record<string, CriterionScore> = {};
    criteria.forEach((c) => {
      next[c.id] = {
        criterionId: c.id,
        selfScore: 0,
        evaluatorScore: scores[c.id]?.evaluatorScore,
        bghScore: scores[c.id]?.bghScore,
        evidence: scores[c.id]?.evidence || '',
      };
    });
    setScores(next);
    setNotification('Đã đưa tất cả điểm tự chấm về 0 điểm. Quý thầy/cô có thể bắt đầu chấm từng tiêu chí.');
    setTimeout(() => setNotification(null), 3500);
  };

  // Quick helper: Điền điểm tối đa 100đ
  const handleFillMaxScores = () => {
    const next: Record<string, CriterionScore> = {};
    criteria.forEach((c) => {
      next[c.id] = {
        criterionId: c.id,
        selfScore: c.maxScore,
        evaluatorScore: scores[c.id]?.evaluatorScore,
        bghScore: scores[c.id]?.bghScore,
        evidence: scores[c.id]?.evidence || '',
      };
    });
    setScores(next);
    setNotification('Đã điền điểm tối đa cho tất cả các tiêu chí (100 điểm).');
    setTimeout(() => setNotification(null), 3500);
  };

  // Handle score changes
  const handleScoreChange = (criterionId: string, valStr: string, maxScore: number) => {
    const val = valStr === '' ? 0 : Math.min(Math.max(parseFloat(valStr) || 0, 0), maxScore);
    setScores((prev) => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        criterionId,
        selfScore: val,
      },
    }));
  };

  const handleEvidenceChange = (criterionId: string, text: string) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        criterionId,
        evidence: text,
      },
    }));
  };

  // Calculations
  const part1Criteria = criteria.filter((c) => c.part === 'I');
  const part2Criteria = criteria.filter((c) => c.part === 'II');

  const part1SelfTotal = part1Criteria.reduce((sum, c) => sum + (scores[c.id]?.selfScore || 0), 0);
  const part2SelfTotal = part2Criteria.reduce((sum, c) => sum + (scores[c.id]?.selfScore || 0), 0);
  const totalSelfScore = part1SelfTotal + part2SelfTotal;

  const part1EvalTotal = part1Criteria.reduce((sum, c) => sum + (scores[c.id]?.evaluatorScore || 0), 0);
  const part2EvalTotal = part2Criteria.reduce((sum, c) => sum + (scores[c.id]?.evaluatorScore || 0), 0);
  const totalEvalScore = evaluationRecord?.evaluatorTotal !== undefined ? evaluationRecord.evaluatorTotal : (part1EvalTotal + part2EvalTotal);

  const selfXepLoai = totalSelfScore === 0 ? 'Chưa đánh giá' : calculateXepLoai(totalSelfScore, hasExemplaryProduct);

  const handleSave = (submit: boolean = false) => {
    const record: EvaluationRecord = {
      id: `${currentUser.id}_${currentPeriod}`,
      staffId: currentUser.id,
      period: currentPeriod,
      scores,
      selfTotal: totalSelfScore,
      evaluatorTotal: evaluationRecord?.evaluatorTotal,
      bghTotal: evaluationRecord?.bghTotal,
      selfXepLoai,
      evaluatorXepLoai: evaluationRecord?.evaluatorXepLoai,
      bghXepLoai: evaluationRecord?.bghXepLoai,
      hasExemplaryProduct,
      exemplaryDetail,
      status: submit ? 'SUBMITTED' : (evaluationRecord?.status || 'DRAFT'),
      submittedAt: submit ? new Date().toLocaleString('vi-VN') : evaluationRecord?.submittedAt,
      evaluatedAt: evaluationRecord?.evaluatedAt,
      evaluatedBy: evaluationRecord?.evaluatedBy || currentUser.evaluatorName,
      approvedAt: evaluationRecord?.approvedAt,
      approvedBy: evaluationRecord?.approvedBy,
      tựNhậnXetƯuĐiểm: uuDiem,
      tựNhậnXetKhuyếtĐiểm: khuyetDiem,
      ýKiếnCuộcHọpTổ: evaluationRecord?.ýKiếnCuộcHọpTổ,
      ýKiếnCấpỦy: evaluationRecord?.ýKiếnCấpỦy,
    };

    onSaveEvaluation(record);

    if (submit) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      setNotification('Đã nộp phiếu tự đánh giá thành công! Kết quả đã chuyển đến người phụ trách thẩm định.');
    } else {
      setNotification('Đã lưu nháp kết quả tự chấm điểm.');
    }

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
      {/* Top Banner & Instructions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2 py-0.5 rounded">
                Biểu mẫu tháng
              </span>
              <span className="text-amber-200 text-xs">
                Áp dụng năm học 2026 - 2027 • {periodObj.label}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              BẢNG CHẤM ĐIỂM THI ĐUA & TỰ ĐÁNH GIÁ VIÊN CHỨC HÀNG THÁNG
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Dành cho: <span className="font-semibold text-white">{currentUser.hoTen}</span> ({currentUser.viTri} - {currentUser.toCM}, {currentUser.coSo})
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            {evaluationRecord && (
              <button
                onClick={() => onOpenDecreeForm(currentUser, evaluationRecord)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Xem Phiếu NĐ 233 / In</span>
              </button>
            )}
            <button
              onClick={() => handleSave(false)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4 text-blue-400" />
              <span>Lưu nháp</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bản tự chấm</span>
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              Hạn nộp tự chấm: <strong className="text-slate-800">{periodObj.deadlineSelf}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              Người phụ trách chấm thi đua: <strong className="text-blue-700">{currentUser.evaluatorName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Trạng thái hồ sơ:</span>
            {evaluationRecord?.status === 'APPROVED' ? (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> BGH đã phê duyệt
              </span>
            ) : evaluationRecord?.status === 'EVALUATED' ? (
              <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Tổ đã thẩm định
              </span>
            ) : evaluationRecord?.status === 'SUBMITTED' ? (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Đã nộp tự chấm - Đang chờ thẩm định
              </span>
            ) : (
              <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                Bản nháp cá nhân
              </span>
            )}
          </div>
        </div>

        {/* Toast alert */}
        {notification && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Summary Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Cá nhân tự chấm */}
        <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                1. Cá nhân tự chấm
              </span>
              <p className="text-xs text-slate-500">Thang điểm 100</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              {totalSelfScore}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-600">Tự đề xuất:</span>
              <span className={`text-xs px-2 py-0.5 rounded-md border ${getBadgeColor(selfXepLoai)}`}>
                {selfXepLoai}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Tổ / Người phụ trách chấm */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                2. Tổ / Phụ trách chấm
              </span>
              <p className="text-xs text-slate-500">{currentUser.evaluatorName.split('(')[0]}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              {evaluationRecord?.evaluatorTotal !== undefined ? evaluationRecord.evaluatorTotal : '-'}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-600">Tổ xếp loại:</span>
              <span className={`text-xs px-2 py-0.5 rounded-md border ${getBadgeColor(evaluationRecord?.evaluatorXepLoai)}`}>
                {evaluationRecord?.evaluatorXepLoai || 'Chưa họp xét'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: BGH Duyệt */}
        <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-sm bg-gradient-to-br from-amber-50/50 to-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                3. BGH Phê Duyệt
              </span>
              <p className="text-xs text-slate-500">Hiệu trưởng Nguyễn Hồ Bắc</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              {evaluationRecord?.bghTotal !== undefined ? evaluationRecord.bghTotal : '-'}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200/60">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-600">Kết quả chính thức:</span>
              <span className={`text-xs px-2 py-0.5 rounded-md border ${getBadgeColor(evaluationRecord?.bghXepLoai)}`}>
                {evaluationRecord?.bghXepLoai || 'Chờ BGH duyệt'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Điều kiện Xuất Sắc (Khống chế 20%) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Điều kiện Xuất Sắc (NĐ 233)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Điểm từ 90-100đ VÀ có sản phẩm vượt mức (STEM, HSG, AI, Học bạ số...). Khống chế ≤ 20%.
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
            <input
              type="checkbox"
              id="hasExemplary"
              checked={hasExemplaryProduct}
              onChange={(e) => setHasExemplaryProduct(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="hasExemplary" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Có sản phẩm / nhiệm vụ vượt mức
            </label>
          </div>
        </div>
      </div>

      {/* Detail input if exemplary product is checked */}
      {hasExemplaryProduct && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300 animate-fade-in space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Kê khai minh chứng sản phẩm / nhiệm vụ hoàn thành vượt mức kế hoạch:</span>
          </div>
          <input
            type="text"
            value={exemplaryDetail}
            onChange={(e) => setExemplaryDetail(e.target.value)}
            placeholder="Ví dụ: Có học sinh đạt giải HSG cấp Huyện/Tỉnh; bài học STEM xuất sắc; hoàn thành ký số Học bạ số sớm nhất..."
            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

      {/* Quick Action Toolbar for Scoring */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <span className="font-bold text-slate-900">Công cụ tự chấm:</span>
          <span className="text-slate-500">Thang điểm 100 theo NĐ 233</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToZero}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Đặt tất cả các tiêu chí về 0 điểm để bắt đầu tự chấm từng mục"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Đưa bảng điểm về 0 để chấm</span>
          </button>
          <button
            type="button"
            onClick={handleFillMaxScores}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Điền tròn điểm tối đa 100 điểm cho tất cả tiêu chí"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Điền điểm tối đa (100đ)</span>
          </button>
        </div>
      </div>

      {/* Main Scoring Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">TT</th>
                <th className="py-3 px-4 min-w-[260px]">Nội dung tiêu chí & Yêu cầu đánh giá</th>
                <th className="py-3 px-3 text-center w-20">Điểm tối đa</th>
                <th className="py-3 px-3 text-center w-28 bg-blue-50 text-blue-900 border-x border-blue-200">
                  Cá nhân tự chấm
                </th>
                <th className="py-3 px-3 text-center w-24">Tổ chấm</th>
                <th className="py-3 px-3 text-center w-24">BGH duyệt</th>
                <th className="py-3 px-4 min-w-[220px]">Ghi chú / Minh chứng cụ thể</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* --- SECTION I --- */}
              <tr className="bg-slate-200/80 font-bold text-slate-900">
                <td colSpan={7} className="py-2.5 px-4 text-xs uppercase tracking-wide bg-gradient-to-r from-slate-200 to-slate-100">
                  PHẦN I: TIÊU CHÍ CHUNG (TỐI ĐA 30 ĐIỂM) - Áp dụng Phụ lục I Nghị định 233/2026/NĐ-CP
                </td>
              </tr>

              {part1Criteria.map((c) => {
                const cScore = scores[c.id]?.selfScore ?? 0;
                const evalScore = scores[c.id]?.evaluatorScore;
                const bghScore = scores[c.id]?.bghScore;
                const evidence = scores[c.id]?.evidence || '';

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-600">{c.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">{c.title}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{c.description}</div>
                      {c.rulesHint && (
                        <div className="text-amber-700 text-[10px] font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded inline-block border border-amber-200/60">
                          {c.rulesHint}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{c.maxScore}</td>
                    
                    {/* Self score input */}
                    <td className="py-2.5 px-3 bg-blue-50/50 border-x border-blue-100 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={c.maxScore}
                          value={cScore}
                          onChange={(e) => handleScoreChange(c.id, e.target.value, c.maxScore)}
                          className="w-16 text-center font-bold text-blue-900 bg-white border border-blue-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                        <span className="text-[10px] text-slate-400">/{c.maxScore}</span>
                      </div>
                    </td>

                    {/* Evaluator score */}
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {evalScore !== undefined ? evalScore : '-'}
                    </td>

                    {/* BGH score */}
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {bghScore !== undefined ? bghScore : '-'}
                    </td>

                    {/* Evidence note */}
                    <td className="py-2.5 px-4">
                      <textarea
                        rows={2}
                        value={evidence}
                        onChange={(e) => handleEvidenceChange(c.id, e.target.value)}
                        placeholder="Ghi chú minh chứng (nếu có)..."
                        className="w-full text-xs p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-slate-50 hover:bg-white transition-colors"
                      />
                    </td>
                  </tr>
                );
              })}

              {/* Subtotal Section I */}
              <tr className="bg-blue-50/80 font-bold text-blue-950 border-t-2 border-slate-300">
                <td className="py-2.5 px-3 text-center">I</td>
                <td className="py-2.5 px-4 uppercase text-xs">CỘNG ĐIỂM PHẦN I</td>
                <td className="py-2.5 px-3 text-center text-sm">30</td>
                <td className="py-2.5 px-3 text-center text-sm text-blue-700 bg-blue-100/70 border-x border-blue-200">
                  {part1SelfTotal}
                </td>
                <td className="py-2.5 px-3 text-center text-sm">
                  {evaluationRecord?.evaluatorTotal !== undefined ? part1EvalTotal : '-'}
                </td>
                <td className="py-2.5 px-3 text-center text-sm">
                  {evaluationRecord?.bghTotal !== undefined ? part1EvalTotal : '-'}
                </td>
                <td className="py-2.5 px-4 text-xs text-blue-900/80">Tối đa 30 điểm</td>
              </tr>

              {/* --- SECTION II --- */}
              <tr className="bg-slate-200/80 font-bold text-slate-900">
                <td colSpan={7} className="py-2.5 px-4 text-xs uppercase tracking-wide bg-gradient-to-r from-slate-200 to-slate-100">
                  PHẦN II: TIÊU CHÍ KẾT QUẢ THỰC HIỆN NHIỆM VỤ (TỐI ĐA 70 ĐIỂM) -{' '}
                  {currentUser.targetType === 'GV'
                    ? 'Dành cho Giáo viên (Điều 6)'
                    : currentUser.targetType === 'NV'
                    ? 'Dành cho Nhân viên & HĐLĐ (Điều 7)'
                    : 'Dành cho Quản lý & Tổ trưởng / Tổ phó (Điều 8)'}
                </td>
              </tr>

              {part2Criteria.map((c) => {
                const cScore = scores[c.id]?.selfScore ?? 0;
                const evalScore = scores[c.id]?.evaluatorScore;
                const bghScore = scores[c.id]?.bghScore;
                const evidence = scores[c.id]?.evidence || '';

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-600">{c.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">{c.title}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{c.description}</div>
                      {c.rulesHint && (
                        <div className="text-amber-700 text-[10px] font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded inline-block border border-amber-200/60">
                          {c.rulesHint}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{c.maxScore}</td>
                    
                    {/* Self score input */}
                    <td className="py-2.5 px-3 bg-blue-50/50 border-x border-blue-100 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={c.maxScore}
                          value={cScore}
                          onChange={(e) => handleScoreChange(c.id, e.target.value, c.maxScore)}
                          className="w-16 text-center font-bold text-blue-900 bg-white border border-blue-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                        <span className="text-[10px] text-slate-400">/{c.maxScore}</span>
                      </div>
                    </td>

                    {/* Evaluator score */}
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {evalScore !== undefined ? evalScore : '-'}
                    </td>

                    {/* BGH score */}
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {bghScore !== undefined ? bghScore : '-'}
                    </td>

                    {/* Evidence note */}
                    <td className="py-2.5 px-4">
                      <textarea
                        rows={2}
                        value={evidence}
                        onChange={(e) => handleEvidenceChange(c.id, e.target.value)}
                        placeholder="Ghi chú minh chứng (nếu có)..."
                        className="w-full text-xs p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-slate-50 hover:bg-white transition-colors"
                      />
                    </td>
                  </tr>
                );
              })}

              {/* Subtotal Section II */}
              <tr className="bg-blue-50/80 font-bold text-blue-950 border-t-2 border-slate-300">
                <td className="py-2.5 px-3 text-center">II</td>
                <td className="py-2.5 px-4 uppercase text-xs">CỘNG ĐIỂM PHẦN II</td>
                <td className="py-2.5 px-3 text-center text-sm">70</td>
                <td className="py-2.5 px-3 text-center text-sm text-blue-700 bg-blue-100/70 border-x border-blue-200">
                  {part2SelfTotal}
                </td>
                <td className="py-2.5 px-3 text-center text-sm">
                  {evaluationRecord?.evaluatorTotal !== undefined ? part2EvalTotal : '-'}
                </td>
                <td className="py-2.5 px-3 text-center text-sm">
                  {evaluationRecord?.bghTotal !== undefined ? part2EvalTotal : '-'}
                </td>
                <td className="py-2.5 px-4 text-xs text-blue-900/80">Tối đa 70 điểm</td>
              </tr>

              {/* GRAND TOTAL */}
              <tr className="bg-amber-100/90 font-black text-slate-950 border-t-2 border-amber-400 text-sm">
                <td colSpan={2} className="py-3 px-4 uppercase text-xs tracking-wider">
                  TỔNG CỘNG ĐIỂM THÁNG (PHẦN I + PHẦN II)
                </td>
                <td className="py-3 px-3 text-center">100</td>
                <td className="py-3 px-3 text-center text-blue-900 bg-amber-200/80 border-x border-amber-300 text-base">
                  {totalSelfScore}
                </td>
                <td className="py-3 px-3 text-center text-slate-800 text-base">
                  {evaluationRecord?.evaluatorTotal !== undefined ? evaluationRecord.evaluatorTotal : '-'}
                </td>
                <td className="py-3 px-3 text-center text-amber-950 text-base">
                  {evaluationRecord?.bghTotal !== undefined ? evaluationRecord.bghTotal : '-'}
                </td>
                <td className="py-3 px-4 text-xs">
                  Xếp loại tự chấm: <strong className="text-blue-950">{selfXepLoai}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Self-Reflection & Remarks (Ưu điểm, khuyết điểm theo mẫu Phụ lục II) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Ý Kiến Tự Nhận Xét (Theo Phụ lục II - Nghị định 233/2026/NĐ-CP)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. Tự nhận xét ưu điểm kết quả công tác trong kỳ:
            </label>
            <textarea
              rows={3}
              value={uuDiem}
              onChange={(e) => setUuDiem(e.target.value)}
              placeholder="Nêu bật kết quả chuyên môn, nề nếp soạn giảng, Học bạ số, hoạt động giáo dục..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. Tự nhận xét tồn tại, hạn chế và phương hướng khắc phục:
            </label>
            <textarea
              rows={3}
              value={khuyetDiem}
              onChange={(e) => setKhuyetDiem(e.target.value)}
              placeholder="Nêu các điểm còn hạn chế và giải pháp khắc phục trong tháng tiếp theo..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Collective feedback from meeting if evaluated */}
        {evaluationRecord?.ýKiếnCuộcHọpTổ && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
            <span className="font-bold text-slate-800">Ý kiến nhận xét tại cuộc họp Tổ chuyên môn:</span>
            <p className="text-slate-600 mt-1 italic">{evaluationRecord.ýKiếnCuộcHọpTổ}</p>
          </div>
        )}

        {/* Bottom submit toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            * Sau khi bấm <strong>"Nộp bản tự chấm"</strong>, Tổ trưởng / Người phụ trách sẽ nhận được thông báo để thẩm định và tổ chức họp tổ.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Nộp phiếu đánh giá</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
