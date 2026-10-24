import { EvaluationRecord, Staff, TargetType, XepLoai, CriterionScore } from '../types';
import { STAFF_LIST } from '../data/staffData';
import { getCriteriaForTarget, calculateXepLoai } from '../data/criteriaData';
import * as XLSX from 'xlsx';

const STORAGE_KEY_EVALUATIONS = 'ndc_evaluations_v2_zero';
const STORAGE_KEY_CURRENT_USER = 'ndc_current_user_v1';
const STORAGE_KEY_CURRENT_PERIOD = 'ndc_current_period_v1';

export function getInitialEvaluations(): Record<string, EvaluationRecord> {
  const records: Record<string, EvaluationRecord> = {};
  const currentPeriod = 'thang_10_2026';

  STAFF_LIST.forEach((staff) => {
    const key = `${staff.id}_${currentPeriod}`;
    const criteria = getCriteriaForTarget(staff.targetType);

    // Mọi tiêu chí được khởi tạo về 0 điểm để sẵn sàng chấm từ đầu
    const scores: Record<string, CriterionScore> = {};
    criteria.forEach((c) => {
      scores[c.id] = {
        criterionId: c.id,
        selfScore: 0,
        evaluatorScore: 0,
        bghScore: 0,
        evidence: '',
      };
    });

    records[key] = {
      id: key,
      staffId: staff.id,
      period: currentPeriod,
      scores,
      selfTotal: 0,
      evaluatorTotal: undefined,
      bghTotal: undefined,
      selfXepLoai: 'Chưa đánh giá',
      evaluatorXepLoai: undefined,
      bghXepLoai: undefined,
      hasExemplaryProduct: false,
      exemplaryDetail: '',
      status: 'DRAFT',
      submittedAt: undefined,
      evaluatedAt: undefined,
      evaluatedBy: staff.evaluatorName,
      approvedAt: undefined,
      approvedBy: undefined,
      tựNhậnXetƯuĐiểm: '',
      tựNhậnXetKhuyếtĐiểm: '',
      ýKiếnCuộcHọpTổ: '',
      ýKiếnCấpỦy: '',
    };
  });

  return records;
}

export function loadEvaluations(): Record<string, EvaluationRecord> {
  try {
    const data = localStorage.getItem(STORAGE_KEY_EVALUATIONS);
    if (!data) {
      const initial = getInitialEvaluations();
      saveEvaluations(initial);
      return initial;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading evaluations:', err);
    return getInitialEvaluations();
  }
}

export function saveEvaluations(data: Record<string, EvaluationRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving evaluations:', err);
  }
}

/**
 * Đưa toàn bộ bảng điểm của một kỳ (hoặc kỳ hiện tại) về 0 để bắt đầu chấm từ đầu
 */
export function resetAllScoresToZero(targetPeriod?: string): Record<string, EvaluationRecord> {
  const period = targetPeriod || loadCurrentPeriod();
  const current = loadEvaluations();
  const updated: Record<string, EvaluationRecord> = { ...current };

  STAFF_LIST.forEach((staff) => {
    const key = `${staff.id}_${period}`;
    const criteria = getCriteriaForTarget(staff.targetType);
    const scores: Record<string, CriterionScore> = {};

    criteria.forEach((c) => {
      scores[c.id] = {
        criterionId: c.id,
        selfScore: 0,
        evaluatorScore: 0,
        bghScore: 0,
        evidence: '',
      };
    });

    updated[key] = {
      id: key,
      staffId: staff.id,
      period: period,
      scores,
      selfTotal: 0,
      evaluatorTotal: undefined,
      bghTotal: undefined,
      selfXepLoai: 'Chưa đánh giá',
      evaluatorXepLoai: undefined,
      bghXepLoai: undefined,
      hasExemplaryProduct: false,
      exemplaryDetail: '',
      status: 'DRAFT',
      submittedAt: undefined,
      evaluatedAt: undefined,
      evaluatedBy: staff.evaluatorName,
      approvedAt: undefined,
      approvedBy: undefined,
      tựNhậnXetƯuĐiểm: '',
      tựNhậnXetKhuyếtĐiểm: '',
      ýKiếnCuộcHọpTổ: '',
      ýKiếnCấpỦy: '',
    };
  });

  saveEvaluations(updated);
  return updated;
}

/**
 * Đưa điểm thẩm định của toàn bộ tổ/bộ phận trực thuộc người chấm về 0
 */
export function resetEvaluatorScoresToZero(evaluatorId: string, targetPeriod?: string): Record<string, EvaluationRecord> {
  const period = targetPeriod || loadCurrentPeriod();
  const current = loadEvaluations();
  const updated: Record<string, EvaluationRecord> = { ...current };

  const assigned = STAFF_LIST.filter((s) => s.evaluatorId === evaluatorId);
  assigned.forEach((staff) => {
    const key = `${staff.id}_${period}`;
    const rec = updated[key];
    if (rec) {
      const nextScores: Record<string, CriterionScore> = { ...rec.scores };
      Object.keys(nextScores).forEach((cId) => {
        nextScores[cId] = {
          ...nextScores[cId],
          evaluatorScore: 0,
        };
      });
      updated[key] = {
        ...rec,
        scores: nextScores,
        evaluatorTotal: 0,
        evaluatorXepLoai: 'Chưa đánh giá',
        status: rec.status === 'APPROVED' ? 'APPROVED' : 'SUBMITTED',
      };
    }
  });

  saveEvaluations(updated);
  return updated;
}

export function loadCurrentUser(): Staff {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (data) {
      const parsed = JSON.parse(data);
      const found = STAFF_LIST.find((s) => s.id === parsed.id);
      if (found) return found;
    }
  } catch (err) {
    console.error(err);
  }
  // Default to Hiệu trưởng Nguyễn Hồ Bắc for full visibility
  return STAFF_LIST[0];
}

export function saveCurrentUser(staff: Staff) {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(staff));
  } catch (err) {
    console.error(err);
  }
}

export function loadCurrentPeriod(): string {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CURRENT_PERIOD);
    if (data) return data;
  } catch (err) {
    console.error(err);
  }
  return 'thang_10_2026';
}

export function saveCurrentPeriod(periodId: string) {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_PERIOD, periodId);
  } catch (err) {
    console.error(err);
  }
}

const STORAGE_KEY_PASSWORDS = 'ndc_custom_passwords_v1';

export function getCustomPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PASSWORDS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error(err);
  }
  return {};
}

export function getStaffPassword(staffId: string): string {
  const custom = getCustomPasswords();
  if (custom[staffId]) return custom[staffId];
  const staff = STAFF_LIST.find((s) => s.id === staffId);
  return staff ? staff.defaultPassword : '123';
}

export function setStaffPassword(staffId: string, newPassword: string): void {
  const custom = getCustomPasswords();
  custom[staffId] = newPassword;
  localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(custom));
}

export function authenticateUser(loginId: string, passwordInput: string): Staff | null {
  const cleanId = loginId.trim().toLowerCase();
  const staff = STAFF_LIST.find(
    (s) =>
      s.username.toLowerCase() === cleanId ||
      s.sdt.trim() === cleanId ||
      s.cccd.trim() === cleanId ||
      s.id.toLowerCase() === cleanId
  );
  if (!staff) return null;

  const validPassword = getStaffPassword(staff.id);
  if (validPassword === passwordInput.trim()) {
    return staff;
  }
  return null;
}

// Strict Permission Handlers:
export function canAccessBghTab(staff: Staff): boolean {
  // Only Principal and Vice Principals can access BGH Approval Tab
  return staff.role === 'HIEU_TRUONG' || staff.role === 'PHO_HIEU_TRUONG';
}

export function canAccessGradingTab(staff: Staff): boolean {
  // Evaluators who have assigned subordinates to grade
  if (staff.role === 'HIEU_TRUONG' || staff.role === 'PHO_HIEU_TRUONG') return true;
  return STAFF_LIST.some((s) => s.evaluatorId === staff.id);
}

export function getAuthorizedStaffToGrade(evaluator: Staff): Staff[] {
  if (evaluator.role === 'HIEU_TRUONG') {
    // Hiệu trưởng can evaluate all or assigned PHT and TT
    return STAFF_LIST.filter((s) => s.evaluatorId === evaluator.id || s.evaluatorId === 'UBND_XA');
  }
  // Strictly restricted to personnel where evaluatorId === evaluator.id
  return STAFF_LIST.filter((s) => s.evaluatorId === evaluator.id);
}

export function canGradeSpecificStaff(evaluator: Staff, targetStaff: Staff): boolean {
  if (evaluator.role === 'HIEU_TRUONG') return true;
  return targetStaff.evaluatorId === evaluator.id;
}

export function canEditSelfEvaluation(currentUser: Staff, targetStaffId: string): boolean {
  // Strictly restricted: each person can ONLY edit their own self-evaluation score
  return currentUser.id === targetStaffId;
}

export function resetAllDataToDefault() {
  const initial = getInitialEvaluations();
  saveEvaluations(initial);
  saveCurrentUser(STAFF_LIST[0]);
  saveCurrentPeriod('thang_10_2026');
  localStorage.removeItem(STORAGE_KEY_PASSWORDS);
  return initial;
}

// Export evaluation table to Excel
export function exportEvaluationsToExcel(
  records: Record<string, EvaluationRecord>,
  periodLabel: string,
  staffList: Staff[]
) {
  const rows = staffList.map((s, idx) => {
    const key = `${s.id}_${loadCurrentPeriod()}`;
    const rec = records[key];

    return {
      'STT': s.stt,
      'Cơ sở': s.coSo,
      'Tổ CM/Bộ phận': s.toCM,
      'Họ và tên': s.hoTen,
      'Vị trí việc làm': s.viTri,
      'Môn dạy': s.monDay,
      'Người phụ trách chấm': s.evaluatorName,
      'Cá nhân tự chấm (Đ/100)': rec ? rec.selfTotal : 'Chưa nộp',
      'Tổ chấm (Đ/100)': rec && rec.evaluatorTotal !== undefined ? rec.evaluatorTotal : 'Chưa chấm',
      'BGH duyệt (Đ/100)': rec && rec.bghTotal !== undefined ? rec.bghTotal : 'Chưa duyệt',
      'Xếp loại BGH': rec && rec.bghXepLoai ? rec.bghXepLoai : (rec?.evaluatorXepLoai || rec?.selfXepLoai || 'Chưa đánh giá'),
      'Sản phẩm vượt mức/STEM/HSG': rec?.hasExemplaryProduct ? 'Có (' + (rec.exemplaryDetail || '') + ')' : 'Không',
      'Trạng thái': rec ? (rec.status === 'APPROVED' ? 'Đã duyệt' : rec.status === 'EVALUATED' ? 'Tổ đã chấm' : 'Đã nộp tự chấm') : 'Chưa nộp',
      'Số điện thoại': s.sdt,
      'CCCD': s.cccd,
      'Đảng viên': s.isDangVien ? 'Đảng viên' : '',
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ket_Qua_Danh_Gia');

  // Generate file name
  const safePeriod = periodLabel.replace(/[\/\s-]/g, '_');
  const fileName = `Danh_Gia_Vien_Chuc_NguyenDinhChieu_${safePeriod}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
