import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import StudentCard from '../Student/StudentCard';
import WeekSelector from '../Shared/WeekSelector';
import ClassInsights from '../ClassInsights/ClassInsights';
import InterventionPriority from '../ClassInsights/InterventionPriority';
import SessionComparison from '../SessionAnalysis/SessionComparison';
import { getAllStudents } from '../../utils/aggregateStudent';
import { Upload, Users, BarChart3, AlertCircle, FileText } from 'lucide-react';

export default function ClassOverview() {
  const navigate = useNavigate();
  const { loading, error, currentAnalysis, analyses, selectedWeek, availableWeeks } = useData();
  const [activeSection, setActiveSection] = useState('students');

  // Scroll spy - update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['students', 'environment', 'interventions', 'session'];
      const scrollPosition = window.scrollY + 150; // Offset for header + buffer

      // Find which section is currently most visible
      let currentSection = 'students';
      let minDistance = Infinity;

      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          // Check if section is in viewport
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = sectionId;
          } else if (scrollPosition < sectionTop) {
            // If we haven't reached this section yet, check distance
            const distance = sectionTop - scrollPosition;
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = sectionId;
            }
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const students = currentAnalysis?.students || [];
  const metadata = currentAnalysis?.transcript_metadata || {};

  // Get previous week's analysis for comparison
  const currentWeekIdx = availableWeeks.indexOf(selectedWeek);
  const previousWeek = currentWeekIdx > 0 ? availableWeeks[currentWeekIdx - 1] : null;
  const previousAnalysis = previousWeek ? analyses[previousWeek] : null;

  // Scroll to section smoothly
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  const sections = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'environment', label: 'Discussion Environment', icon: BarChart3 },
    { id: 'interventions', label: 'Intervention Priority', icon: AlertCircle },
    { id: 'session', label: 'Session Notes', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                SoftSkills Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {metadata.class_context || '8th Grade Book Club'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/upload')}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Transcript
              </button>
              <WeekSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Hidden on mobile, sticky on desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              {/* Session Info Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Week</p>
                    <p className="mt-0.5 text-lg font-semibold text-gray-900">
                      {selectedWeek}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs font-medium text-gray-500">Date</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {metadata.date || 'N/A'}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs font-medium text-gray-500">Students</p>
                    <p className="mt-0.5 text-lg font-semibold text-gray-900">
                      {students.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jump to Section
                </p>
                <div className="mt-1 space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Mobile Session Info */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Week</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {selectedWeek}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {metadata.date || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Students</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {students.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Students Grid - NOW FIRST */}
            <section id="students" className="scroll-mt-20 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {students.map((student) => (
                  <StudentCard
                    key={student.student_id}
                    student={student}
                    analyses={analyses}
                  />
                ))}
              </div>
            </section>

            {/* Class Insights / Discussion Environment */}
            <section id="environment" className="scroll-mt-20 mb-8">
              <ClassInsights analysis={currentAnalysis} />
            </section>

            {/* Intervention Priority */}
            <section id="interventions" className="scroll-mt-20 mb-8">
              <InterventionPriority analysis={currentAnalysis} previousAnalysis={previousAnalysis} />
            </section>

            {/* Session Analysis / Notes */}
            {currentAnalysis?.session_analysis && (
              <section id="session" className="scroll-mt-20">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Session Notes
                  </h2>
                  <div className="space-y-4">
                    {currentAnalysis.session_analysis.key_moments?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Key Moments
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {currentAnalysis.session_analysis.key_moments.map((moment, idx) => (
                            <li key={idx} className="text-gray-600 text-sm">
                              {moment}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {currentAnalysis.session_analysis.teacher_recommendations && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Teacher Recommendations
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {currentAnalysis.session_analysis.teacher_recommendations}
                        </p>
                      </div>
                    )}

                    {/* Week-over-Week Comparison */}
                    <SessionComparison
                      currentAnalysis={currentAnalysis}
                      previousAnalysis={previousAnalysis}
                    />
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
