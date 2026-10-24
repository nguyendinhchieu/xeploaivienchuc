import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  Scale, 
  Clock, 
  ShieldCheck, 
  Award,
  ChevronRight
} from 'lucide-react';

export const RegulationsModal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'quych' | 'nd233' | 'thoidiem' | 'files'>('quych');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-indigo-950 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded">
                Văn bản pháp quy
              </span>
              <span className="text-amber-200 text-xs font-semibold">
                Nghị định 233/2026/NĐ-CP & Quyết định Trường TH&THCS Nguyễn Đình Chiểu
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              QUY CHẾ ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG ĐƠN VỊ & VIÊN CHỨC NĂM HỌC 2026 - 2027
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Hiệu trưởng: <strong className="text-white">Nguyễn Hồ Bắc</strong> • Ngày ký ban hành: 23/10/2026
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <a
              href="/assets/aistudio/10.2026_QUY_CHE_DANH_GIA_XEP_LOA_VIEN_CHUC_2026-2027_N_C_29a82399.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Xem PDF Quy Chế Gốc</span>
            </a>
            <a
              href="/assets/aistudio/DS_TH_NG_TIN_TO_CM_26-27__01.11.2026__8ad6360d.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Xem PDF Danh Sách 70 CB-GV</span>
            </a>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-100 px-5 py-2 border-b border-slate-200 flex space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveSection('quych')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'quych' ? 'bg-blue-700 text-white font-bold' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Khung Tiêu Chí & Thang Điểm (100đ)
          </button>
          <button
            onClick={() => setActiveSection('nd233')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'nd233' ? 'bg-blue-700 text-white font-bold' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Tiêu Chuẩn Xếp Loại & Tỷ Lệ Khống Chế (≤ 20%)
          </button>
          <button
            onClick={() => setActiveSection('thoidiem')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'thoidiem' ? 'bg-blue-700 text-white font-bold' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Quy Trình 4 Bước Hằng Tháng & Tổng Kết Năm
          </button>
          <button
            onClick={() => setActiveSection('files')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'files' ? 'bg-blue-700 text-white font-bold' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            4. Tệp Đính Kèm Gốc
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'quych' && (
        <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-800">
          {/* Card 1: Phần I */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b border-slate-100 pb-2">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>PHẦN I: TIÊU CHÍ CHUNG ĐỐI VỚI VIÊN CHỨC (TỐI ĐA 30 ĐIỂM - Điều 5)</span>
            </div>
            <p className="text-slate-600">
              Áp dụng theo Phụ lục I - Nghị định số 233/2026/NĐ-CP cho toàn thể viên chức và người lao động:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">1. Chấp hành đường lối, chính trị, pháp luật, nội quy (8 điểm):</span>
                <p className="text-slate-600 mt-1">Chấp hành nghiêm đường lối của Đảng, pháp luật; đi làm đúng giờ, đủ ngày công, dự họp đầy đủ. (Trừ 1đ/lần đi trễ, vắng không phép).</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">2. Đạo đức nghề nghiệp & Lối sống (7 điểm):</span>
                <p className="text-slate-600 mt-1">Giữ gìn tư cách nhà giáo; đoàn kết nội bộ; không dạy thêm trái quy định; không tiêu cực trong giáo dục. (Vi phạm dạy thêm/tiêu cực: 0 điểm mục này).</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">3. Tác phong làm việc & Tinh thần phối hợp (8 điểm):</span>
                <p className="text-slate-600 mt-1">Đổi mới tác phong, có văn hóa ứng xử chuẩn mực với HS, phụ huynh và đồng nghiệp; tích cực hỗ trợ các phong trào, đoàn thể.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">4. Năng lực đổi mới, sáng tạo & Trách nhiệm (7 điểm):</span>
                <p className="text-slate-600 mt-1">Chủ động đề xuất giải pháp, áp dụng sáng kiến/công nghệ mới; tích cực nhận nhiệm vụ đột xuất do BGH/Tổ trưởng giao. (Có sản phẩm sáng tạo được ghi nhận [+2đ]).</p>
              </div>
            </div>
          </div>

          {/* Card 2: Phần II theo từng nhóm đối tượng */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b border-slate-100 pb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>PHẦN II: TIÊU CHÍ KẾT QUẢ THỰC HIỆN NHIỆM VỤ (TỐI ĐA 70 ĐIỂM)</span>
            </div>

            <div className="space-y-3">
              <div className="border border-blue-200 rounded-xl p-3 bg-blue-50/30">
                <h4 className="font-bold text-blue-900">A. Tiêu chí đối với Giáo viên (Điều 6 - 70 điểm):</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-700">
                  <li><strong>Nề nếp hồ sơ chuyên môn & KHBD (20 điểm):</strong> Đầy đủ tiến độ 2 buổi/ngày; ma trận/đặc tả kiểm tra; lồng ghép địa chỉ GDQPAN cụ thể. (Trừ 2đ/lần thiếu/trễ).</li>
                  <li><strong>Chuyển đổi số, AI & Học bạ số (15 điểm):</strong> Nhập điểm chính xác; ký số 100% Học bạ số đúng hạn; ứng dụng AI hỗ trợ soạn giảng. (Trừ 3đ/lần trễ hạn ký số Học bạ số hoặc chậm vào điểm).</li>
                  <li><strong>Đổi mới PPDH, STEM/STEAM & Dạy ngoại ngữ (15 điểm):</strong> Triển khai bài học STEM; dạy học song ngữ theo đăng ký; sử dụng hiệu quả phòng bộ môn (+2đ nếu có sản phẩm báo cáo).</li>
                  <li><strong>Sinh hoạt chuyên môn (SHCM) & Dự giờ (10 điểm):</strong> Dự giờ đủ tiết, tham gia SHCM nghiên cứu bài học và SHCM cụm trường. (Trừ 2đ/tiết thiếu).</li>
                  <li><strong>Chất lượng giảng dạy, Bồi dưỡng HSG & Ôn thi lớp 10 (10 điểm):</strong> Duy trì nề nếp lớp học; phụ đạo HS Chưa đạt, bồi dưỡng HSG, ôn thi lớp 10 bám sát đề Sở GD&ĐT Đắk Lắk.</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900">B. Tiêu chí đối với Nhân viên & Hợp đồng (Điều 7 - 70 điểm):</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-700">
                  <li><strong>Khối lượng & Tiến độ công việc (25 điểm):</strong> Kế toán, Văn thư, Thư viện - Thiết bị, Y tế, Bảo vệ, Phục vụ hoàn thành 100% đúng hạn. (Trừ 2đ/lần chậm).</li>
                  <li><strong>Chất lượng chuyên môn theo vị trí (30 điểm):</strong> Y tế khám SK học sinh trước 30/9; Kế toán tài chính công khai; Thư viện - thiết bị phục vụ số; Văn thư làm sạch CSDL ngành; Bảo vệ an ninh an toàn.</li>
                  <li><strong>Thái độ phục vụ & Ứng dụng CNTT (15 điểm):</strong> Chu đáo, tận tụy, thành thạo phần mềm chuyên ngành. (Trừ 3-5đ nếu có phản ánh thái độ).</li>
                </ul>
              </div>

              <div className="border border-amber-200 rounded-xl p-3 bg-amber-50/40">
                <h4 className="font-bold text-amber-950">C. Tiêu chí đối với Viên chức Quản lý & Tổ trưởng / Tổ phó (Điều 8 - 70 điểm):</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-700">
                  <li><strong>Kết quả hoạt động của đơn vị/tổ phụ trách (30 điểm):</strong> Đơn vị/tổ hoàn thành các chỉ tiêu năm học; 100% tổ viên hoàn thành nhiệm vụ trở lên.</li>
                  <li><strong>Năng lực quản trị, điều hành và đổi mới (25 điểm):</strong> Chỉ đạo đột phá Chuyển đổi số, AI, Học bạ số, STEM/STEAM; duy trì kỷ cương; báo cáo đúng khung thời gian.</li>
                  <li><strong>Năng lực tập hợp, đoàn kết (15 điểm):</strong> Môi trường làm việc dân chủ, an toàn, không có khiếu nại tố cáo hoặc vi phạm kỷ luật.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'nd233' && (
        <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-800">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b border-slate-100 pb-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>TIÊU CHUẨN 4 MỨC XẾP LOẠI CHẤT LƯỢNG (Điều 9, 10, 11, 12)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Mức 1: Xuất sắc */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-300">
                <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  1. HOÀN THÀNH XUẤT SẮC NHIỆM VỤ (90 - 100 ĐIỂM)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-700">
                  <li>Đạt từ <strong>90 đến 100 điểm</strong>.</li>
                  <li>Thực hiện xuất sắc các tiêu chí chung tại Điều 5.</li>
                  <li><strong>Có sản phẩm vượt mức kế hoạch:</strong> có HSG cấp tỉnh/xã, có sản phẩm STEM/AI/KHKT đạt giải; ứng dụng Học bạ số/AI tiêu biểu; đạt GVDG cấp trường, xã, tỉnh.</li>
                  <li><strong>Tỷ lệ khống chế: Không quá 20%</strong> tổng số viên chức xếp loại "Hoàn thành tốt nhiệm vụ" trong cùng nhóm (tối đa 25% nếu trường/tổ đạt thành tích nổi trội).</li>
                </ul>
              </div>

              {/* Mức 2: Tốt */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-300">
                <span className="bg-blue-700 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  2. HOÀN THÀNH TỐT NHIỆM VỤ (70 - DƯỚI 90 ĐIỂM)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-700">
                  <li>Đạt từ <strong>70 đến dưới 90 điểm</strong>.</li>
                  <li>Hoàn thành 100% nhiệm vụ đúng tiến độ, chất lượng.</li>
                  <li>Ký Học bạ số đúng hạn; thực hiện đầy đủ tích hợp GDQPAN, STEM, AI đúng quy định.</li>
                  <li>Đối với VCQL & Tổ trưởng: 100% đơn vị phụ trách hoàn thành nhiệm vụ trở lên.</li>
                </ul>
              </div>

              {/* Mức 3: Hoàn thành */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-300">
                <span className="bg-amber-700 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  3. HOÀN THÀNH NHIỆM VỤ (50 - DƯỚI 70 ĐIỂM)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-700">
                  <li>Đạt từ <strong>50 đến dưới 70 điểm</strong>.</li>
                  <li>Đáp ứng các tiêu chí chung.</li>
                  <li>Nhiệm vụ cơ bản hoàn thành, có không quá 20% tiêu chí chưa bảo đảm tiến độ hoặc còn hạn chế nhỏ (trễ hạn báo cáo/vào điểm nhẹ; giáo án còn sót lỗi đã khắc phục).</li>
                </ul>
              </div>

              {/* Mức 4: Không hoàn thành */}
              <div className="bg-red-50/60 p-4 rounded-xl border border-red-300">
                <span className="bg-red-700 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  4. KHÔNG HOÀN THÀNH NHIỆM VỤ (DƯỚI 50 ĐIỂM)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-700">
                  <li>Tổng điểm <strong>dưới 50 điểm</strong> hoặc hoàn thành dưới 70% nhiệm vụ kế hoạch.</li>
                  <li>Bị kỷ luật khiển trách trở lên trong năm.</li>
                  <li>Vi phạm nghiêm trọng quy chế chuyên môn; gian lận điểm số; sử dụng AI sai quy định để gian lận học thuật; vi phạm dạy thêm học thêm.</li>
                  <li>Viên chức có 02 năm liên tiếp xếp loại "Không hoàn thành nhiệm vụ" sẽ bị đơn phương chấm dứt hợp đồng làm việc.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'thoidiem' && (
        <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-800">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>QUY TRÌNH CHẤM ĐIỂM HẰNG THÁNG & THỜI ĐIỂM ĐÁNH GIÁ NĂM HỌC (Điều 14 & 16)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <span className="text-blue-700 font-bold block text-sm">Bước 1: Trước ngày 25</span>
                <h5 className="font-bold text-slate-900 mt-1">Viên chức tự chấm điểm</h5>
                <p className="text-slate-600 mt-1">Căn cứ kết quả công tác trong tháng, viên chức làm báo cáo tự chấm điểm vào Phụ lục theo quy chế và nộp cho Tổ.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <span className="text-amber-700 font-bold block text-sm">Bước 2: Ngày 26 - 27</span>
                <h5 className="font-bold text-slate-900 mt-1">Họp tổ thẩm định điểm</h5>
                <p className="text-slate-600 mt-1">Tổ trưởng chuyên môn/Trưởng bộ phận họp toàn thể tổ, xét duyệt điểm, lấy ý kiến đóng góp và gửi bảng tổng hợp về BGH.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <span className="text-emerald-700 font-bold block text-sm">Bước 3: Trước ngày 30</span>
                <h5 className="font-bold text-slate-900 mt-1">BGH duyệt & Công khai</h5>
                <p className="text-slate-600 mt-1">Hiệu trưởng duyệt, ban hành kết quả và công khai kết quả thi đua tháng trên bảng tin và hệ thống quản lý nội bộ nhà trường.</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mt-3">
              <h5 className="font-bold text-blue-950 text-xs">Thời điểm đánh giá tổng kết năm học 2026 - 2027:</h5>
              <p className="text-slate-700 mt-1">
                - Thực hiện theo năm học (từ tháng 8/2026 đến tháng 5/2027).<br />
                - Thời điểm tiến hành đánh giá tập trung trong <strong>tháng 5/2027</strong> và <strong>hoàn thành trước ngày 20/5/2027</strong> để kịp tổng kết năm học, xét thi đua khen thưởng và báo cáo UBND xã Ea Kar, UBND tỉnh Đắk Lắk.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'files' && (
        <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-800">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>HỒ SƠ VĂN BẢN GỐC ĐÍNH KÈM CỦA TRƯỜNG TH & THCS NGUYỄN ĐÌNH CHIỂU</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white transition-all space-y-2">
                <span className="text-xs font-bold text-blue-900">VĂN BẢN 1: QUY CHẾ ĐÁNH GIÁ XẾP LOẠI (NĐ 233)</span>
                <p className="text-slate-600 text-[11px]">
                  Quyết định ban hành Quy chế đánh giá, xếp loại chất lượng đơn vị và viên chức Năm học 2026 - 2027 (16 trang), bao gồm biểu mẫu tháng Giáo viên, Nhân viên và khung điểm 100.
                </p>
                <div className="pt-2">
                  <a
                    href="/assets/aistudio/10.2026_QUY_CHE_DANH_GIA_XEP_LOA_VIEN_CHUC_2026-2027_N_C_29a82399.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải tệp PDF Quy chế (10.2026_QUY_CHE...)</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white transition-all space-y-2">
                <span className="text-xs font-bold text-blue-900">VĂN BẢN 2: DANH SÁCH 70 CB-GV & PHÂN CÔNG CHẤM</span>
                <p className="text-slate-600 text-[11px]">
                  Bảng tổng hợp danh sách 70 cán bộ giáo viên, nhân viên phân theo Trụ sở chính, Phân hiệu 1, Phân hiệu 2 kèm phân công cụ thể ai phụ trách chấm thi đua ai.
                </p>
                <div className="pt-2">
                  <a
                    href="/assets/aistudio/DS_TH_NG_TIN_TO_CM_26-27__01.11.2026__8ad6360d.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải tệp PDF Danh sách (DS_TH_NG_TIN_TO_CM...)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
