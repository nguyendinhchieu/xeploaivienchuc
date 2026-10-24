import React from 'react';
import { Staff, EvaluationRecord } from '../types';
import { getCriteriaForTarget, EVALUATION_PERIODS } from '../data/criteriaData';
import { X, Printer, Download, Award, CheckCircle } from 'lucide-react';

interface OfficialDecreeFormModalProps {
  staff: Staff | null;
  record: EvaluationRecord | null;
  currentPeriod: string;
  onClose: () => void;
}

export const OfficialDecreeFormModal: React.FC<OfficialDecreeFormModalProps> = ({
  staff,
  record,
  currentPeriod,
  onClose,
}) => {
  if (!staff || !record) return null;

  const criteria = getCriteriaForTarget(staff.targetType);
  const part1 = criteria.filter((c) => c.part === 'I');
  const part2 = criteria.filter((c) => c.part === 'II');

  const periodObj = EVALUATION_PERIODS.find((p) => p.id === currentPeriod) || EVALUATION_PERIODS[2];

  const handlePrint = () => {
    window.print();
  };

  const finalXl = record.bghXepLoai || record.evaluatorXepLoai || record.selfXepLoai;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300 print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs uppercase">
              Mẫu Phụ lục II - Nghị định số 233/2026/NĐ-CP
            </span>
            <span className="text-slate-400 text-xs">• {periodObj.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu / Xuất PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 font-serif text-slate-950 leading-relaxed text-sm bg-white print:overflow-visible print:p-4">
          {/* Header 2 columns */}
          <div className="grid grid-cols-2 gap-4 text-center border-b border-slate-300 pb-4 mb-6">
            <div>
              <div className="font-semibold text-xs uppercase">UBND XÃ EA KAR</div>
              <div className="font-bold text-xs uppercase tracking-tight">TRƯỜNG TH & THCS NGUYỄN ĐÌNH CHIỂU</div>
              <div className="text-[11px] italic mt-0.5">Số: ...... /PĐG-NĐC</div>
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-semibold text-xs border-b border-slate-800 inline-block pb-0.5">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="text-[11px] italic mt-1">Ea Kar, ngày ...... tháng ...... năm 202...</div>
            </div>
          </div>

          {/* Form Title */}
          <div className="text-center my-5">
            <h1 className="text-base font-black uppercase tracking-wide">
              PHIẾU ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG VIÊN CHỨC
            </h1>
            <p className="text-xs font-semibold mt-1">
              (Kèm theo Nghị định số 233/2026/NĐ-CP và Quyết định số 23/10/2026-QĐ-NĐC)
            </p>
            <p className="text-xs italic text-slate-600 mt-0.5 font-sans">
              Kỳ đánh giá: <strong className="text-slate-900">{periodObj.label}</strong>
            </p>
          </div>

          {/* Personnel Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs space-y-2 font-sans">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                Họ và tên: <strong className="text-slate-950 font-bold">{staff.hoTen}</strong>
              </div>
              <div>
                Ngày sinh: <strong>{staff.ngaySinh}</strong> ({staff.gioiTinh})
              </div>
              <div>
                Chức vụ / Vị trí việc làm: <strong>{staff.viTri}</strong>
              </div>
              <div>
                Dân tộc: <strong>{staff.danToc}</strong>
              </div>
              <div>
                Tổ chuyên môn: <strong>{staff.toCM}</strong>
              </div>
              <div>
                Cơ sở: <strong>{staff.coSo}</strong>
              </div>
              <div>
                Môn dạy / Nhiệm vụ: <strong>{staff.monDay}</strong>
              </div>
              <div>
                Trình độ đào tạo: <strong>{staff.trinhDo}</strong>
              </div>
              <div>
                Số CCCD: <strong>{staff.cccd}</strong>
              </div>
              <div>
                Đảng viên: <strong>{staff.isDangVien ? 'Đảng viên Đảng Cộng sản Việt Nam' : 'Quần chúng'}</strong>
              </div>
              <div className="col-span-2">
                Người phụ trách trực tiếp theo dõi & chấm thi đua: <strong>{staff.evaluatorName}</strong>
              </div>
            </div>
          </div>

          {/* Scores Table */}
          <table className="w-full text-left text-xs border border-slate-400 border-collapse mb-6 font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400 text-center">
                <th className="py-2 px-2 border-r border-slate-400 w-10">TT</th>
                <th className="py-2 px-3 border-r border-slate-400 text-left">Nội dung tiêu chí đánh giá</th>
                <th className="py-2 px-2 border-r border-slate-400 w-16">Điểm tối đa</th>
                <th className="py-2 px-2 border-r border-slate-400 w-20">Cá nhân tự chấm</th>
                <th className="py-2 px-2 border-r border-slate-400 w-20">Tổ chấm</th>
                <th className="py-2 px-2 border-r border-slate-400 w-20">BGH duyệt</th>
                <th className="py-2 px-3">Minh chứng cụ thể</th>
              </tr>
            </thead>
            <tbody>
              {/* Part 1 Header */}
              <tr className="bg-slate-200 font-bold border-b border-slate-400">
                <td colSpan={7} className="py-1.5 px-3 uppercase text-[11px]">
                  PHẦN I: TIÊU CHÍ CHUNG (TỐI ĐA 30 ĐIỂM)
                </td>
              </tr>
              {part1.map((c) => (
                <tr key={c.id} className="border-b border-slate-300">
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold">{c.code}</td>
                  <td className="py-2 px-3 border-r border-slate-300">
                    <span className="font-semibold">{c.title}</span>
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-semibold">{c.maxScore}</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold text-blue-800">
                    {record.scores?.[c.id]?.selfScore ?? c.maxScore}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold text-slate-800">
                    {record.scores?.[c.id]?.evaluatorScore ?? '-'}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold text-amber-950">
                    {record.scores?.[c.id]?.bghScore ?? '-'}
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-600">
                    {record.scores?.[c.id]?.evidence || '-'}
                  </td>
                </tr>
              ))}

              {/* Part 2 Header */}
              <tr className="bg-slate-200 font-bold border-b border-slate-400">
                <td colSpan={7} className="py-1.5 px-3 uppercase text-[11px]">
                  PHẦN II: TIÊU CHÍ KẾT QUẢ THỰC HIỆN NHIỆM VỤ (TỐI ĐA 70 ĐIỂM)
                </td>
              </tr>
              {part2.map((c) => (
                <tr key={c.id} className="border-b border-slate-300">
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold">{c.code}</td>
                  <td className="py-2 px-3 border-r border-slate-300">
                    <span className="font-semibold">{c.title}</span>
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-semibold">{c.maxScore}</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold text-blue-800">
                    {record.scores?.[c.id]?.selfScore ?? c.maxScore}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold text-slate-800">
                    {record.scores?.[c.id]?.evaluatorScore ?? '-'}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-center font-bold text-amber-950">
                    {record.scores?.[c.id]?.bghScore ?? '-'}
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-600">
                    {record.scores?.[c.id]?.evidence || '-'}
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-amber-50 font-black text-slate-950 text-xs border-t-2 border-slate-400">
                <td colSpan={2} className="py-2 px-3 uppercase text-center border-r border-slate-400">
                  TỔNG CỘNG ĐIỂM (PHẦN I + PHẦN II)
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-400">100</td>
                <td className="py-2 px-2 text-center border-r border-slate-400 font-bold text-blue-900">
                  {record.selfTotal}
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-400 font-bold">
                  {record.evaluatorTotal ?? '-'}
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-400 font-black text-amber-950">
                  {record.bghTotal ?? '-'}
                </td>
                <td className="py-2 px-3 font-bold text-[11px]">
                  Xếp loại: {finalXl}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Self-Reflection & Meeting sections */}
          <div className="space-y-4 text-xs font-sans mb-8">
            <div className="border border-slate-300 p-3 rounded-lg">
              <strong className="block text-slate-900 mb-1">1. Ý kiến tự nhận xét của viên chức:</strong>
              <p className="text-slate-700">
                <strong>Ưu điểm:</strong> {record.tựNhậnXetƯuĐiểm || 'Hoàn thành tốt các nhiệm vụ được giao.'}
              </p>
              <p className="text-slate-700 mt-1">
                <strong>Tồn tại, hạn chế:</strong> {record.tựNhậnXetKhuyếtĐiểm || 'Cần tiếp tục phấn đấu nâng cao trình độ chuyên môn.'}
              </p>
            </div>

            <div className="border border-slate-300 p-3 rounded-lg">
              <strong className="block text-slate-900 mb-1">
                2. Ý kiến nhận xét, đánh giá tại cuộc họp Tổ chuyên môn / Tổ văn phòng:
              </strong>
              <p className="text-slate-700 italic">
                {record.ýKiếnCuộcHọpTổ || 'Cuộc họp tổ ngày ... đã thống nhất 100% biểu quyết thông qua điểm số và đề xuất xếp loại.'}
              </p>
            </div>

            <div className="border border-slate-300 p-3 rounded-lg bg-amber-50/40">
              <strong className="block text-slate-900 mb-1">
                3. Quyết định xếp loại chất lượng của Hiệu trưởng:
              </strong>
              <div className="flex items-center gap-3">
                <span>Mức xếp loại:</span>
                <span className="font-black text-sm uppercase text-slate-950 px-2 py-0.5 rounded bg-amber-200 border border-amber-300">
                  {finalXl}
                </span>
                {record.hasExemplaryProduct && (
                  <span className="text-emerald-800 text-[11px] font-semibold">
                    (Có sản phẩm / thành tích vượt mức theo NĐ 233)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3 Signatures */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs mt-10 pt-4 font-sans border-t border-slate-200">
            <div>
              <div className="font-bold uppercase">VIÊN CHỨC TỰ ĐÁNH GIÁ</div>
              <div className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16 flex items-center justify-center italic text-blue-700 font-serif">
                (Đã ký số)
              </div>
              <div className="font-bold text-slate-900">{staff.hoTen}</div>
            </div>

            <div>
              <div className="font-bold uppercase">TỔ TRƯỞNG / NGƯỜI CHẤM</div>
              <div className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16 flex items-center justify-center italic text-blue-700 font-serif">
                (Đã ký số)
              </div>
              <div className="font-bold text-slate-900">{staff.evaluatorName.split('(')[0]}</div>
            </div>

            <div>
              <div className="font-bold uppercase">HIỆU TRƯỞNG</div>
              <div className="text-[11px] italic text-slate-500">(Ký tên và đóng dấu)</div>
              <div className="h-16 flex items-center justify-center italic text-red-700 font-serif">
                (Đã phê duyệt & ký số)
              </div>
              <div className="font-bold text-slate-900">Nguyễn Hồ Bắc</div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs print:hidden">
          <span className="text-slate-500">
            Trường TH & THCS Nguyễn Đình Chiểu • Nghị định số 233/2026/NĐ-CP
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
