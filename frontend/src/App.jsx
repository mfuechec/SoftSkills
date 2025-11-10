import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import ClassOverview from './components/Dashboard/ClassOverview';
import StudentProfile from './components/Student/StudentProfile';
import TranscriptUpload from './components/Upload/TranscriptUpload';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<ClassOverview />} />
            <Route path="/student/:studentId" element={<StudentProfile />} />
            <Route path="/upload" element={<TranscriptUpload />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
