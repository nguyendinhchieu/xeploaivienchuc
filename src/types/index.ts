export type TargetType = 'GV' | 'NV' | 'QL_TT';

export type UserRole = 'HIEU_TRUONG' | 'PHO_HIEU_TRUONG' | 'TO_TRUONG' | 'TO_PHO' | 'VIEN_CHUC';

export type Campus = 'Trụ sở chính' | 'Phân hiệu 1' | 'Phân hiệu 2';

export interface Staff {
  id: string;
  stt: number;
  coSo: Campus;
  toCM: string;
  hoTen: string;
  viTri: string;
  role: UserRole;
  targetType: TargetType;
  ngaySinh: string;
  gioiTinh: 'Nam' | 'Nữ';
  danToc: string;
  sdt: string;
  trinhDo: string;
  monDay: string;
  cccd: string;
  isDangVien: boolean;
  phuTrachCham: string;
  evaluatorId: string; // The staff ID responsible for evaluating this person
  evaluatorName: string;
  username: string; // Individual login username (e.g. bac.nh, khang.tm, nhan.ttm)
  defaultPassword: string; // Unique individual password for each person
  ghiChu?: string;
}

export interface Criterion {
  id: string;
  part: 'I' | 'II';
  code: string;
  title: string;
  description: string;
  maxScore: number;
  rulesHint: string;
}

export interface CriterionScore {
  criterionId: string;
  selfScore: number;
  evaluatorScore?: number;
  bghScore?: number;
  evidence?: string;
  note?: string;
}

export type XepLoai = 'Hoàn thành xuất sắc nhiệm vụ' | 'Hoàn thành tốt nhiệm vụ' | 'Hoàn thành nhiệm vụ' | 'Không hoàn thành nhiệm vụ' | 'Chưa đánh giá';

export interface EvaluationRecord {
  id: string;
  staffId: string;
  period: string; // e.g. "thang_10_2026", "thang_11_2026", "nam_hoc_2026_2027"
  scores: Record<string, CriterionScore>;
  selfTotal: number;
  evaluatorTotal?: number;
  bghTotal?: number;
  selfXepLoai: XepLoai;
  evaluatorXepLoai?: XepLoai;
  bghXepLoai?: XepLoai;
  hasExemplaryProduct: boolean; // Minh chứng hoàn thành vượt mức (sản phẩm STEM/HSG/Học bạ số tiêu biểu)
  exemplaryDetail?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'EVALUATED' | 'APPROVED';
  submittedAt?: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  tựNhậnXetƯuĐiểm?: string;
  tựNhậnXetKhuyếtĐiểm?: string;
  ýKiếnCuộcHọpTổ?: string;
  ýKiếnCấpỦy?: string;
}
