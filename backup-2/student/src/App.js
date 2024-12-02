import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentNav from "./components/studentNav/StudentNav";
import Instructions from "./pages/student/instructions/Instructions";
import QuestionsPanel from "./pages/student/questionsPanel/QuestionsPanel";
import StudentFeedback from "./pages/student/studentfeedback/StudentFeedback";
import ThankYou from "./pages/student/thankspage/ThankYou";
import ExamTerminationPage from "./pages/student/thankspage/ExamTerminationPage";
import LandingPage from "./pages/student/selfRegistration/LandingPage";
import PageNotFound from "./pages/pagenotfound/PageNotFound";
function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="*" element={<PageNotFound/>}/>

        <Route path="/" element={<StudentNav />}>
          <Route index element={<LandingPage />} />
          <Route path="questions" element={<QuestionsPanel />} />
          <Route path="feedback" element={<StudentFeedback/>} />
          <Route path="thanks" element={<ThankYou/>} />
          <Route path="termination" element={<ExamTerminationPage/>} />
          <Route path="examPortal" element={<Instructions />} />
          <Route path="errorPage" element={<PageNotFound/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;