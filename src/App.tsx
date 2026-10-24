import React, { useState, useEffect } from 'react';
import { Staff, EvaluationRecord } from './types';
import { 
  loadCurrentUser, 
  saveCurrentUser, 
  loadCurrentPeriod, 
  saveCurrentPeriod, 
  loadEvaluations, 
  saveEvaluations,
  resetAllDataToDefault,
  resetAllScoresToZero,
  resetEvaluatorScoresToZero,
  canAccessBghTab,
  canAccessGradingTab 
} from './utils/storage';
import { STAFF_LIST } from './data/staffData';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { SelfEvaluationView } from './components/SelfEvaluationView';
import { ManagerGradingView } from './components/ManagerGradingView';
import { BghApprovalView } from './components/BghApprovalView';
import { ReportsAndRankingsView } from './components/ReportsAndRankingsView';
import { StaffDirectoryView } from './components/StaffDirectoryView';
import { RegulationsModal } from './components/RegulationsModal';
import { OfficialDecreeFormModal } from './components/OfficialDecreeFormModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Staff>(loadCurrentUser);
  const [currentPeriod, setCurrentPeriod] = useState<string>(loadCurrentPeriod);
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationRecord>>(loadEvaluations);
  const [activeTab, setActiveTab] = useState<string>('self');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Selected report for Decree Form modal
  const [inspectingStaff, setInspectingStaff] = useState<Staff | null>(null);
  const [inspectingRecord, setInspectingRecord] = useState<EvaluationRecord | null>(null);

  // Strict permission tab redirect: if user does not have permission for the active tab, redirect to 'self'
  useEffect(() => {
    if (activeTab === 'bgh' && !canAccessBghTab(currentUser)) {
      setActiveTab('self');
    }
    if (activeTab === 'grading' && !canAccessGradingTab(currentUser)) {
      setActiveTab('self');
    }
  }, [currentUser, activeTab]);

  // Sync state to local storage when changed
  const handlePeriodChange = (periodId: string) => {
    setCurrentPeriod(periodId);
    saveCurrentPeriod(periodId);
  };

  const handleSelectUser = (user: Staff) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    setToastMessage(`Đã đăng nhập thành công với tài khoản: ${user.hoTen} (${user.viTri})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    setIsLoginModalOpen(true);
  };

  const handleSaveEvaluation = (record: EvaluationRecord) => {
    const next = {
      ...evaluations,
      [record.id]: record,
    };
    setEvaluations(next);
    saveEvaluations(next);
  };

  const handleBatchApprove = (updatedRecords: Record<string, EvaluationRecord>) => {
    setEvaluations(updatedRecords);
    saveEvaluations(updatedRecords);
  };

  const handleOpenDecreeForm = (staff: Staff, record: EvaluationRecord) => {
    setInspectingStaff(staff);
    setInspectingRecord(record);
  };

  const handleCloseDecreeForm = () => {
    setInspectingStaff(null);
    setInspectingRecord(null);
  };

  const handleResetScoresToZero = () => {
    const updated = resetAllScoresToZero(currentPeriod);
    setEvaluations(updated);
    setToastMessage('Đã đưa toàn bộ bảng điểm của kỳ hiện tại về 0 thành công! Sẵn sàng cho việc chấm điểm mới.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetEvaluatorScores = () => {
    const updated = resetEvaluatorScoresToZero(currentUser.id, currentPeriod);
    setEvaluations(updated);
    setToastMessage(`Đã đưa điểm tổ thẩm định về 0 để tổ chuyên môn bắt đầu chấm.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Calculate pending counts
  const pendingForEvaluatorCount = STAFF_LIST.filter((s) => {
    if (currentUser.role === 'HIEU_TRUONG') {
      return (s.evaluatorId === currentUser.id || s.evaluatorId === 'UBND_XA') &&
        evaluations[`${s.id}_${currentPeriod}`]?.status === 'SUBMITTED';
    }
    return s.evaluatorId === currentUser.id &&
      evaluations[`${s.id}_${currentPeriod}`]?.status === 'SUBMITTED';
  }).length;

  const pendingForBghCount = STAFF_LIST.filter(
    (s) => evaluations[`${s.id}_${currentPeriod}`]?.status === 'EVALUATED'
  ).length;

  const currentEvaluationKey = `${currentUser.id}_${currentPeriod}`;
  const currentEvaluationRecord = evaluations[currentEvaluationKey];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header & Navigation */}
      <Header
        currentUser={currentUser}
        currentPeriod={currentPeriod}
        onPeriodChange={handlePeriodChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        pendingForEvaluatorCount={pendingForEvaluatorCount}
        pendingForBghCount={pendingForBghCount}
        onResetAllToZero={handleResetScoresToZero}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-blue-900 text-white py-2 px-4 text-center text-xs font-semibold shadow-md border-b border-blue-800 animate-fade-in flex items-center justify-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'self' && (
          <SelfEvaluationView
            currentUser={currentUser}
            currentPeriod={currentPeriod}
            evaluationRecord={currentEvaluationRecord}
            onSaveEvaluation={handleSaveEvaluation}
            onOpenDecreeForm={handleOpenDecreeForm}
          />
        )}

        {activeTab === 'grading' && (
          <ManagerGradingView
            currentUser={currentUser}
            currentPeriod={currentPeriod}
            evaluations={evaluations}
            onUpdateEvaluation={handleSaveEvaluation}
            onOpenDecreeForm={handleOpenDecreeForm}
            onResetEvaluatorScores={handleResetEvaluatorScores}
          />
        )}

        {activeTab === 'bgh' && (
          <BghApprovalView
            currentUser={currentUser}
            currentPeriod={currentPeriod}
            evaluations={evaluations}
            onBatchApprove={handleBatchApprove}
            onUpdateEvaluation={handleSaveEvaluation}
            onOpenDecreeForm={handleOpenDecreeForm}
            onResetAllToZero={handleResetScoresToZero}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsAndRankingsView
            currentPeriod={currentPeriod}
            evaluations={evaluations}
            onOpenDecreeForm={handleOpenDecreeForm}
            onResetAllToZero={handleResetScoresToZero}
          />
        )}

        {activeTab === 'directory' && (
          <StaffDirectoryView
            currentUser={currentUser}
            onSelectUser={handleSelectUser}
          />
        )}

        {activeTab === 'regulations' && (
          <RegulationsModal />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-white tracking-wide">
              TRƯỜNG TH & THCS NGUYỄN ĐÌNH CHIỂU - UBND XÃ EA KAR
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Hệ thống bảo mật tài khoản & phân quyền đánh giá viên chức theo Nghị định 233/2026/NĐ-CP
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn đưa toàn bộ bảng điểm của kỳ hiện tại về 0 để chấm lại từ đầu không?')) {
                  handleResetScoresToZero();
                }
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline transition-colors"
            >
              Đưa bảng điểm về 0 để chấm
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu mẫu và mật khẩu ban đầu?')) {
                  const initial = resetAllDataToDefault();
                  setEvaluations(initial);
                  setCurrentUser(STAFF_LIST[0]);
                  setCurrentPeriod('thang_10_2026');
                }
              }}
              className="text-slate-400 hover:text-slate-200 underline transition-colors"
            >
              Khôi phục dữ liệu gốc
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Phiên bản 2.8</span>
          </div>
        </div>
      </footer>

      {/* User Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        currentUser={currentUser}
        onSuccess={(newPass) => {
          setToastMessage(`Đã cập nhật mật khẩu mới cho ${currentUser.hoTen}!`);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      {/* Official Decree 233 Appendix II Printable Form Modal */}
      <OfficialDecreeFormModal
        staff={inspectingStaff}
        record={inspectingRecord}
        currentPeriod={currentPeriod}
        onClose={handleCloseDecreeForm}
      />
    </div>
  );
}
