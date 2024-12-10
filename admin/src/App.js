import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/admin/login/Login';
import MainLayout from './pages/admin/main/MainLayout';
import Home from './pages/admin/home/Home';

import QuestionManagement from './pages/admin/questionManagement/QuestionManagement';
import QuestionnaireList from './pages/admin/questionnaireManagement/QuestionnaireList';
import QuestionnaireAdd from './pages/admin/questionnaireManagement/QuestionnaireAdd';
import QuestionPaperView from './pages/admin/questionnaireManagement/QuestionPaperView';

import QuestionCategoryList from './pages/admin/questionCategory/QuestionCategoryManagement';


import InstitutionsList from './pages/admin/institutions/InstitutionManagement';
import StudentManagement from './pages/admin/studentManagement/StudentManagement';
import AdminExamsList from './pages/admin/examManagement/ExamList';
import AdminExamDetail from './pages/admin/examManagement/ExamDetailPage';
import AdminProtected from './services/authentication/AdminProtected';
import RedirectIfAuthenticated from './services/authentication/RedirectAuthentication';
import PageNotFound from './pages/pagenotfound/PageNotFound';
import FeedbackManagement from './pages/admin/feedback/FeedbackManagement';
import QuestionLevels from './components/difficultlevels/QuestionLevels';

import ExamAdd from './pages/admin/examManagement/ExamAdd';
import ExamBatch from './pages/admin/examManagement/ExamBatch';


import BatchDetails from './pages/admin/examManagement/BatchDetails';
import StudentsShortlisted from './pages/admin/shortlist/StudentsShortlisted';
import SummaryReport from './pages/admin/studentSummaryReport/SummaryReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="*" element={<PageNotFound/>}/>
        <Route path="/dashboard" element={<AdminProtected><MainLayout /></AdminProtected>}>
          <Route index element={<Home />} />
          <Route path="questionCategoryList" element={<QuestionCategoryList />} />
          <Route path="questions" element={<QuestionManagement />} />
          <Route path="institutionsList" element={<InstitutionsList />} />
          <Route path="examsList" element={<AdminExamsList />} />
          <Route path="examsList/examDetail/:id" element={<AdminExamDetail />} />
          {/* <Route path="examsList/examDetail/:id/short-list/:id" element={<ShortListedStudents/>} /> */}
          <Route path="students" element={<StudentManagement/>}/>
          <Route path="feedback" element={<FeedbackManagement/>} />
          {/* <Route path="errorCard" element={<ErrorCard  />} /> */}
          <Route path="examAdd" element={<ExamAdd/>}/>
          <Route path="levels" element={<QuestionLevels/>}/>
          <Route path="exam-batches" element={<ExamBatch/>}/>
          <Route path="examsList/examDetail/batchDetails/:id" element={<BatchDetails />} />
          <Route path="examsList/examDetail/batchDetails/:id/summaryReport/:studentId" element={<SummaryReport />} />
          <Route path="questionnaireList" element={<QuestionnaireList />} />
          <Route path="questionnaireList/questionnaireAdd" element={<QuestionnaireAdd />} />
          <Route path="questionnairePaperView/:id" element={<QuestionPaperView />} />
          <Route path="examsList/examDetail/:examId/shortlisted" element={<StudentsShortlisted />} />     
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;