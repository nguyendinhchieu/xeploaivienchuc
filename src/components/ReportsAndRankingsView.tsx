import React, { useState } from 'react';
import { Staff, EvaluationRecord } from '../types';
import { STAFF_LIST } from '../data/staffData';
import { exportEvaluationsToExcel } from '../utils/storage';
import { EVALUATION_PERIODS } from '../data/criteriaData';
import { 
  BarChart3, 
  Download, 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Printer, 
  TrendingUp,
  Building,
  Users,
  RotateCcw
} from 'lucide-react';

interface ReportsAndRankingsViewProps {
  currentPeriod: string;
  evaluations: Record<string, EvaluationRecord>;
  onOpenDecreeForm: (staff: Staff, record: EvaluationRecord) => void;
  onResetAllToZero?: () => void;
}

export const ReportsAndRankingsView: React.FC<ReportsAndRankingsViewProps> = ({
  currentPeriod,
  evaluations,
  onOpenDecreeForm,
  onResetAllToZero,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState<'ALL' | 'Trụ sở chính' | 'Phân hiệu 1' | 'Phân hiệu 2'>('ALL');
  const [rankingFilter, setRankingFilter] = useState<string>('ALL');

  const periodObj = EVALUATION_PERIODS.find((p) => p.id === currentPeriod) || EVALUATION_PERIODS[2];

  // Global counts
  let countExcellent = 0;
  let countGood = 0;
  let countCompleted = 0;
  let countNotCompleted = 0;
  let totalScoreSum = 0;
  let gradedCount = 0;

  STAFF_LIST.forEach((s) => {
    const key = `${s.id}_${currentPeriod}`;
    const rec = evaluations[key];
    const xl = rec?.bghXepLoai || rec?.evaluatorXepLoai || rec?.selfXepLoai;

    if (xl === 'Hoàn thành xuất sắc nhiệm vụ') countExcellent++;
    else if (xl === 'Hoàn thành tốt nhiệm vụ') countGood++;
    else if (xl === 'Hoàn thành nhiệm vụ') countCompleted++;
    else if (xl === 'Không hoàn thành nhiệm vụ') countNotCompleted++;

    const score = rec?.bghTotal ?? rec?.evaluatorTotal ?? rec?.selfTotal;
    if (score !== undefined) {
      totalScoreSum += score;
      gradedCount++;
    }
  });

  const avgScore = gradedCount > 0 ? (totalScoreSum / gradedCount).toFixed(1) : '0';
  const totalGoodAndExc = countExcellent + countGood;
  const excRate = totalGoodAndExc > 0 ? ((countExcellent / totalGoodAndExc) * 100).toFixed(1) : '0';

  // Filtered list
  const filteredList = STAFF_LIST.filter((s) => {
    const key = `${s.id}_${currentPeriod}`;
    const rec = evaluations[key];
    const xl = rec?.bghXepLoai || rec?.evaluatorXepLoai || rec?.selfXepLoai;

    const matchesSearch =
      s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.toCM.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.monDay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.viTri.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCampus = campusFilter === 'ALL' || s.coSo === campusFilter;

    let matchesRank = true;
    if (rankingFilter !== 'ALL') {
      matchesRank = xl === rankingFilter;
    }

    return matchesSearch && matchesCampus && matchesRank;
  }).sort((a, b) => {
    const recA = evaluations[`${a.id}_${currentPeriod}`];
    const recB = evaluations[`${b.id}_${currentPeriod}`];
    const scoreA = recA?.bghTotal ?? recA?.evaluatorTotal ?? recA?.selfTotal ?? 0;
    const scoreB = recB?.bghTotal ?? recB?.evaluatorTotal ?? recB?.selfTotal ?? 0;
    return scoreB - scoreA; // descending order
  });

  const handleExportExcel = () => {
    exportEvaluationsToExcel(evaluations, periodObj.label, STAFF_LIST);
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
      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2 py-0.5 rounded">
                Báo cáo tổng hợp
              </span>
              <span className="text-amber-200 text-xs">
                Toàn trường TH&THCS Nguyễn Đình Chiểu • {periodObj.label}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ & XẾP LOẠI THI ĐUA
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Theo khung tiêu chí chuẩn Nghị định số 233/2026/NĐ-CP và Quyết định thi đua nhà trường
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
            {onResetAllToZero && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn đưa toàn bộ bảng điểm của toàn trường về 0 điểm để bắt đầu chấm điểm lại từ đầu không?')) {
                    onResetAllToZero();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md border border-rose-400/30 transition-all active:scale-95"
                title="Đưa toàn bộ bảng điểm thi đua về 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đưa bảng điểm về 0 để chấm</span>
              </button>
            )}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Báo Cáo Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Hoàn thành Xuất sắc</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">{countExcellent} CB-GV</div>
              <span className="text-[11px] text-emerald-600 font-medium">Tỷ lệ: {excRate}% (≤ 20%)</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Hoàn thành Tốt</span>
              <div className="text-xl font-black text-blue-700 mt-0.5">{countGood} CB-GV</div>
              <span className="text-[11px] text-blue-600 font-medium">Điểm từ 70 - 89đ</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Hoàn thành nhiệm vụ</span>
              <div className="text-xl font-black text-amber-700 mt-0.5">{countCompleted} CB-GV</div>
              <span className="text-[11px] text-amber-600 font-medium">Điểm từ 50 - 69đ</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Điểm trung bình toàn trường</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{avgScore} / 100</div>
              <span className="text-[11px] text-slate-500 font-medium">Tổng 70 cán bộ</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên cán bộ, môn học, cơ sở..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Campus */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Trụ sở chính', 'Phân hiệu 1', 'Phân hiệu 2'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCampusFilter(c)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  campusFilter === c ? 'bg-blue-700 text-white font-bold' : 'text-slate-600'
                }`}
              >
                {c === 'ALL' ? 'Toàn trường' : c}
              </button>
            ))}
          </div>

          {/* Ranking filter */}
          <select
            value={rankingFilter}
            onChange={(e) => setRankingFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl text-xs font-medium py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả mức xếp loại</option>
            <option value="Hoàn thành xuất sắc nhiệm vụ">Hoàn thành xuất sắc</option>
            <option value="Hoàn thành tốt nhiệm vụ">Hoàn thành tốt</option>
            <option value="Hoàn thành nhiệm vụ">Hoàn thành nhiệm vụ</option>
            <option value="Không hoàn thành nhiệm vụ">Không hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">Hạng</th>
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[190px]">Cán bộ / Giáo viên</th>
                <th className="py-3 px-3">Cơ sở / Phân hiệu</th>
                <th className="py-3 px-3">Tổ CM & Môn</th>
                <th className="py-3 px-3 text-center w-20">Tự chấm</th>
                <th className="py-3 px-3 text-center w-20">Tổ chấm</th>
                <th className="py-3 px-3 text-center w-24 bg-amber-50 text-amber-900 border-x border-amber-200">
                  BGH duyệt
                </th>
                <th className="py-3 px-3 text-center w-36">Xếp loại chất lượng</th>
                <th className="py-3 px-4 min-w-[200px]">Minh chứng sản phẩm vượt mức</th>
                <th className="py-3 px-3 text-center w-20">Biểu mẫu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((staff, rankIndex) => {
                const key = `${staff.id}_${currentPeriod}`;
                const rec = evaluations[key];
                const selfScore = rec?.selfTotal;
                const evalScore = rec?.evaluatorTotal;
                const bghScore = rec?.bghTotal;
                const finalXl = rec?.bghXepLoai || rec?.evaluatorXepLoai || rec?.selfXepLoai;

                return (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          rankIndex === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : rankIndex === 1
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : rankIndex === 2
                            ? 'bg-amber-700/70 text-white font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {rankIndex + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 font-semibold">{staff.stt}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{staff.hoTen}</span>
                        {staff.isDangVien && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1.5 py-0.2 rounded border border-red-200">
                            ĐV
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{staff.viTri}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{staff.coSo}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{staff.toCM}</div>
                      <div className="text-[11px] text-slate-500">{staff.monDay}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-blue-700 font-semibold">
                      {selfScore !== undefined ? `${selfScore}đ` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-800 font-semibold">
                      {evalScore !== undefined ? `${evalScore}đ` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-950 bg-amber-50/50 border-x border-amber-200">
                      {bghScore !== undefined ? `${bghScore}đ` : (evalScore !== undefined ? `${evalScore}đ*` : '-')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {finalXl ? (
                        <span className={`text-[11px] px-2.5 py-0.5 rounded border inline-block ${getBadgeColor(finalXl)}`}>
                          {finalXl}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-600">
                      {rec?.hasExemplaryProduct ? (
                        <div className="text-amber-800 bg-amber-50 border border-amber-200/80 p-1.5 rounded-lg flex items-start gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{rec.exemplaryDetail || 'Có sản phẩm STEM/HSG/Học bạ số tiêu biểu'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Đạt chuẩn theo kế hoạch</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {rec && (
                        <button
                          onClick={() => onOpenDecreeForm(staff, rec)}
                          className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg inline-flex items-center gap-1 font-semibold"
                          title="Xem & in phiếu theo mẫu Phụ lục II Nghị định 233"
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
    </div>
  );
};
