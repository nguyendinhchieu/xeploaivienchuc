import { Criterion, TargetType } from '../types';

// PHẦN I: TIÊU CHÍ CHUNG (TỐI ĐA 30 ĐIỂM)
// Áp dụng Phụ lục I - Nghị định 233/2026/NĐ-CP
export const COMMON_CRITERIA: Criterion[] = [
  {
    id: 'TCC_1',
    part: 'I',
    code: '1',
    title: 'Chấp hành tư tưởng, chính trị, pháp luật, nội quy',
    description: 'Chấp hành nghiêm chủ trương của Đảng, pháp luật Nhà nước; đi làm đúng giờ, thực hiện đúng ngày công, thời khóa biểu; tham gia đầy đủ các cuộc họp, hội nghị.',
    maxScore: 8,
    rulesHint: 'Trừ 1đ/lần đi trễ, họp vắng không phép.',
  },
  {
    id: 'TCC_2',
    part: 'I',
    code: '2',
    title: 'Đạo đức nghề nghiệp & Lối sống',
    description: 'Giữ gìn tư cách nhà giáo; đoàn kết nội bộ; không vi phạm quy định về dạy thêm, học thêm; không tiêu cực trong giáo dục.',
    maxScore: 7,
    rulesHint: 'Vi phạm dạy thêm/tiêu cực: 0 điểm mục này.',
  },
  {
    id: 'TCC_3',
    part: 'I',
    code: '3',
    title: 'Tác phong làm việc & Tinh thần phối hợp',
    description: 'Đổi mới tác phong, có văn hóa ứng xử chuẩn mực với HS, phụ huynh và đồng nghiệp; tích cực hỗ trợ các phong trào, đoàn thể.',
    maxScore: 8,
    rulesHint: 'Đánh giá qua phản ánh và ghi nhận thực tế.',
  },
  {
    id: 'TCC_4',
    part: 'I',
    code: '4',
    title: 'Năng lực đổi mới, sáng tạo & Trách nhiệm',
    description: 'Chủ động đề xuất giải pháp, áp dụng sáng kiến/công nghệ mới; tích cực nhận và hoàn thành các nhiệm vụ đột xuất do BGH/Tổ trưởng giao.',
    maxScore: 7,
    rulesHint: 'Có sản phẩm sáng tạo được ghi nhận [+2đ].',
  },
];

// PHẦN II: DÀNH CHO GIÁO VIÊN (TỐI ĐA 70 ĐIỂM)
export const TEACHER_CRITERIA: Criterion[] = [
  {
    id: 'TCC_GV_1',
    part: 'II',
    code: '1',
    title: 'Nề nếp hồ sơ chuyên môn & Kế hoạch bài dạy (KHBD)',
    description: 'Soạn giảng đầy đủ, đúng tiến độ chương trình 2 buổi/ngày; KHBD thể hiện rõ đổi mới PPDH, xây dựng ma trận/đặc tả kiểm tra đúng quy định; Lồng ghép, tích hợp địa chỉ GDQPAN cụ thể vào KHBD (đối với Lịch sử - Địa lí, GDCD, GDTC, Tin học...).',
    maxScore: 20,
    rulesHint: 'Trừ 2đ/lần thiếu/trễ giáo án hoặc thiếu địa chỉ GDQPAN.',
  },
  {
    id: 'TCC_GV_2',
    part: 'II',
    code: '2',
    title: 'Thực hiện Chuyển đổi số, AI & Học bạ số',
    description: 'Nhập điểm, nhận xét chính xác, đúng thời gian quy định trên hệ thống CSDL; Thực hiện ký số Học bạ số 100% đúng tiến độ trong tháng; Khai thác, ứng dụng các công cụ AI hỗ trợ soạn giảng, tạo học liệu an toàn, hiệu quả.',
    maxScore: 15,
    rulesHint: 'Trừ 3đ/lần trễ hạn ký số Học bạ số hoặc chậm vào điểm.',
  },
  {
    id: 'TCC_GV_3',
    part: 'II',
    code: '3',
    title: 'Đổi mới PPDH, STEM/STEAM & Dạy học Ngoại ngữ',
    description: 'Triển khai bài học STEM/chuẩn bị sản phẩm STEM theo kế hoạch tháng; GV Toán, GDTC, Nghệ thuật, Trải nghiệm... thực hiện dạy học song ngữ/Tiếng Anh theo đăng ký; Sử dụng hiệu quả phòng bộ môn, thiết bị dạy học hiện có.',
    maxScore: 15,
    rulesHint: 'Báo cáo sản phẩm STEM/giờ dạy song ngữ [+2đ].',
  },
  {
    id: 'TCC_GV_4',
    part: 'II',
    code: '4',
    title: 'Sinh hoạt chuyên môn (SHCM) & Dự giờ',
    description: 'Tham gia đầy đủ, đóng góp tích cực trong SHCM theo nghiên cứu bài học và SHCM cụm trường; Thực hiện đủ số tiết dự giờ hằng tháng theo quy định, có ghi chép, nhận xét hoạt động học của HS.',
    maxScore: 10,
    rulesHint: 'Trừ 2đ/tiết dự giờ thiếu hoặc SHCM vắng mặt.',
  },
  {
    id: 'TCC_GV_5',
    part: 'II',
    code: '5',
    title: 'Chất lượng giảng dạy, Bồi dưỡng HSG & Ôn thi lớp 10',
    description: 'Duy trì nề nếp lớp học, tỷ lệ chuyên cần học sinh; Thực hiện nghiêm túc lịch bồi dưỡng HSG, phụ đạo HS Chưa đạt; Đội ngũ GV lớp 9 thực hiện giảng dạy, ôn tập bám sát cấu trúc đề thi Tuyển sinh lớp 10 của Sở GD&ĐT Đắk Lắk.',
    maxScore: 10,
    rulesHint: 'Đánh giá theo kết quả khảo sát/kiểm tra định kỳ trong tháng.',
  },
];

// PHẦN II: DÀNH CHO NHÂN VIÊN & HỢP ĐỒNG LAO ĐỘNG (TỐI ĐA 70 ĐIỂM)
export const STAFF_CRITERIA: Criterion[] = [
  {
    id: 'TCC_NV_1',
    part: 'II',
    code: '1',
    title: 'Khối lượng & Tiến độ công việc',
    description: 'Hoàn thành 100% nhiệm vụ theo kế hoạch công tác tháng của bộ phận (Kế toán, Văn thư, Thư viện - Thiết bị, Y tế, Bảo vệ, Phục vụ) đúng thời hạn.',
    maxScore: 25,
    rulesHint: 'Trừ 2đ/lần chậm tiến độ công việc.',
  },
  {
    id: 'TCC_NV_2',
    part: 'II',
    code: '2',
    title: 'Chất lượng chuyên môn theo vị trí việc làm',
    description: 'Y tế: Khám SK, theo dõi SK học sinh, ATVSTP, phòng dịch. TV-TB: Vận hành phòng thư viện, TN-TH, mượn trả thiết bị, số hóa. Kế toán - Văn thư: Báo cáo tài chính công khai, hỗ trợ CSDL ngành, Học bạ số. Bảo vệ: An ninh an toàn.',
    maxScore: 30,
    rulesHint: 'Đánh giá theo hồ sơ, sổ nhật ký làm việc thực tế.',
  },
  {
    id: 'TCC_NV_3',
    part: 'II',
    code: '3',
    title: 'Thái độ phục vụ & Ứng dụng CNTT',
    description: 'Phục vụ chu đáo, tận tụy đối với GV và HS; Quản lý lưu trữ hồ sơ tài sản khoa học; Ứng dụng tốt phần mềm chuyên ngành giáo dục.',
    maxScore: 15,
    rulesHint: 'Phản ánh về thái độ phục vụ: trừ từ 3 - 5đ.',
  },
];

// PHẦN II: DÀNH CHO CÁN BỘ QUẢN LÝ & TỔ TRƯỞNG / TỔ PHÓ (ĐIỀU 8 - TỐI ĐA 70 ĐIỂM)
export const LEADER_CRITERIA: Criterion[] = [
  {
    id: 'TCC_QL_1',
    part: 'II',
    code: '1',
    title: 'Kết quả hoạt động của đơn vị/tổ phụ trách',
    description: 'Đơn vị/tổ hoàn thành các chỉ tiêu kế hoạch tháng và năm học; 100% tổ viên hoàn thành nhiệm vụ trở lên; không để xảy ra sai sót chuyên môn nghiêm trọng.',
    maxScore: 30,
    rulesHint: 'Căn cứ tỷ lệ hoàn thành nhiệm vụ của các tổ viên trực thuộc.',
  },
  {
    id: 'TCC_QL_2',
    part: 'II',
    code: '2',
    title: 'Năng lực quản trị, điều hành và đổi mới',
    description: 'Chỉ đạo đột phá Chuyển đổi số, AI, Học bạ số, STEM/STEAM; duy trì kỷ cương chuyên môn; thực hiện đúng khung thời gian năm học và báo cáo Sở GD&ĐT, UBND xã đúng hạn.',
    maxScore: 25,
    rulesHint: 'Đánh giá tiến độ báo cáo và mức độ cải cách đơn vị.',
  },
  {
    id: 'TCC_QL_3',
    part: 'II',
    code: '3',
    title: 'Năng lực tập hợp, đoàn kết nội bộ',
    description: 'Xây dựng môi trường làm việc dân chủ, an toàn, đoàn kết; không có khiếu nại tố cáo hoặc vi phạm kỷ luật trong tổ/đơn vị phụ trách.',
    maxScore: 15,
    rulesHint: 'Đánh giá qua không khí dân chủ và phản hồi của tổ viên.',
  },
];

export function getCriteriaForTarget(targetType: TargetType): Criterion[] {
  switch (targetType) {
    case 'GV':
      return [...COMMON_CRITERIA, ...TEACHER_CRITERIA];
    case 'NV':
      return [...COMMON_CRITERIA, ...STAFF_CRITERIA];
    case 'QL_TT':
      return [...COMMON_CRITERIA, ...LEADER_CRITERIA];
    default:
      return [...COMMON_CRITERIA, ...TEACHER_CRITERIA];
  }
}

export interface EvaluationPeriod {
  id: string;
  label: string;
  type: 'month' | 'quarter' | 'year';
  deadlineSelf: string;
  deadlineEvaluator: string;
  deadlineBgh: string;
  isCurrent?: boolean;
}

export const EVALUATION_PERIODS: EvaluationPeriod[] = [
  { id: 'thang_08_2026', label: 'Tháng 08/2026', type: 'month', deadlineSelf: '25/08/2026', deadlineEvaluator: '27/08/2026', deadlineBgh: '30/08/2026' },
  { id: 'thang_09_2026', label: 'Tháng 09/2026', type: 'month', deadlineSelf: '25/09/2026', deadlineEvaluator: '27/09/2026', deadlineBgh: '30/09/2026' },
  { id: 'thang_10_2026', label: 'Tháng 10/2026', type: 'month', deadlineSelf: '25/10/2026', deadlineEvaluator: '27/10/2026', deadlineBgh: '30/10/2026', isCurrent: true },
  { id: 'thang_11_2026', label: 'Tháng 11/2026', type: 'month', deadlineSelf: '25/11/2026', deadlineEvaluator: '27/11/2026', deadlineBgh: '30/11/2026' },
  { id: 'thang_12_2026', label: 'Tháng 12/2026', type: 'month', deadlineSelf: '25/12/2026', deadlineEvaluator: '27/12/2026', deadlineBgh: '30/12/2026' },
  { id: 'thang_01_2027', label: 'Tháng 01/2027', type: 'month', deadlineSelf: '25/01/2027', deadlineEvaluator: '27/01/2027', deadlineBgh: '30/01/2027' },
  { id: 'thang_02_2027', label: 'Tháng 02/2027', type: 'month', deadlineSelf: '25/02/2027', deadlineEvaluator: '27/02/2027', deadlineBgh: '28/02/2027' },
  { id: 'thang_03_2027', label: 'Tháng 03/2027', type: 'month', deadlineSelf: '25/03/2027', deadlineEvaluator: '27/03/2027', deadlineBgh: '30/03/2027' },
  { id: 'thang_04_2027', label: 'Tháng 04/2027', type: 'month', deadlineSelf: '25/04/2027', deadlineEvaluator: '27/04/2027', deadlineBgh: '30/04/2027' },
  { id: 'thang_05_2027', label: 'Tháng 05/2027', type: 'month', deadlineSelf: '15/05/2027', deadlineEvaluator: '18/05/2027', deadlineBgh: '20/05/2027' },
  { id: 'nam_hoc_2026_2027', label: 'Tổng kết Năm học 2026 - 2027 (Nghị định 233)', type: 'year', deadlineSelf: '15/05/2027', deadlineEvaluator: '18/05/2027', deadlineBgh: '20/05/2027' },
];

export function calculateXepLoai(score: number, hasExemplaryProduct: boolean = false): import('../types').XepLoai {
  if (score >= 90) {
    // Để được xếp loại Hoàn thành xuất sắc nhiệm vụ: cần từ 90 đến 100 điểm VÀ có ít nhất 1 sản phẩm/nhiệm vụ vượt mức
    return hasExemplaryProduct ? 'Hoàn thành xuất sắc nhiệm vụ' : 'Hoàn thành tốt nhiệm vụ';
  } else if (score >= 70) {
    return 'Hoàn thành tốt nhiệm vụ';
  } else if (score >= 50) {
    return 'Hoàn thành nhiệm vụ';
  } else {
    return 'Không hoàn thành nhiệm vụ';
  }
}
