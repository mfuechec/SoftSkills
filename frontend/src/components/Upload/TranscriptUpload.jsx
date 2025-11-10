import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function TranscriptUpload() {
  const navigate = useNavigate();
  const { addAnalysis } = useData();
  const [transcript, setTranscript] = useState('');
  const [weekNumber, setWeekNumber] = useState('20');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ step: 0, message: '', detectedStudents: [] });
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Progress steps
  const progressSteps = [
    { message: 'Parsing transcript...', duration: 3 },
    { message: 'Detecting students...', duration: 2 },
    { message: 'Analyzing evidence with AI...', duration: 35 },
    { message: 'Generating scores...', duration: 3 },
    { message: 'Finalizing results...', duration: 2 },
  ];

  // Countdown timer effect
  useEffect(() => {
    if (!isAnalyzing) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnalyzing]);

  // Progress simulation effect
  useEffect(() => {
    if (!isAnalyzing || progress.step >= progressSteps.length) return;

    const currentStep = progressSteps[progress.step];
    const timer = setTimeout(() => {
      if (progress.step < progressSteps.length - 1) {
        setProgress(prev => ({
          step: prev.step + 1,
          message: progressSteps[prev.step + 1].message,
          detectedStudents: prev.step === 0 ? ['Maya', 'Jordan', 'Alex', 'Sam', 'Casey'] : prev.detectedStudents,
        }));
      }
    }, currentStep.duration * 1000);

    return () => clearTimeout(timer);
  }, [isAnalyzing, progress.step]);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please paste a transcript first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress({ step: 0, message: progressSteps[0].message, detectedStudents: [] });
    setTimeRemaining(45);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          week: weekNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Add to DataContext
      addAnalysis(parseInt(weekNumber), data);

      setResult(data);
      setProgress({ step: progressSteps.length, message: 'Complete!', detectedStudents: progress.detectedStudents });
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze transcript');
      setProgress({ step: 0, message: '', detectedStudents: [] });
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setTranscript(`[Teacher]: Welcome everyone! Today we're discussing chapters 4-7 of "Brave New World." Let's start with Bernard. What are your initial thoughts?

[Alex]: I think... Bernard's really isolated, you know? Like, he doesn't fit into the World State's mold.

[Maya]: Alex, that's a really empathetic point. He does seem like an outsider.

[Jordan]: I agree. And that isolation is what makes him question the system.

[Sam]: But wait—

[Jordan]: Hold on, Sam. Let me finish this thought. Bernard's questioning is similar to Jonas in "The Giver."

[Sam]: Sorry. Go ahead.

[Jordan]: Thanks. Like Jonas, Bernard sees the cracks in what's supposed to be a "perfect" society.

[Casey]: That connects back to what we were talking about last week about control versus freedom.

[Maya]: That's a beautiful connection to The Giver, Casey.

[Alex]: Yeah, and I think... staying comfortable means losing yourself. Like, Bernard could just go along with everything, but then he wouldn't be Bernard anymore.

[Teacher]: That's profound, Alex. Class, let's think about that idea.`);
    setWeekNumber('20');
  };

  const progressPercentage = isAnalyzing ? ((progress.step / progressSteps.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Transcript</h1>
            <p className="mt-1 text-sm text-gray-500">
              Analyze a new discussion transcript in real-time
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Input Section */}
          {!result && !isAnalyzing && (
            <>
              <div className="mb-4">
                <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-2">
                  Week Number
                </label>
                <input
                  type="number"
                  id="week"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  min="1"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">
                    Transcript
                  </label>
                  <button
                    onClick={handleLoadSample}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Load Sample (Week 20)
                  </button>
                </div>
                <textarea
                  id="transcript"
                  rows={16}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono text-sm"
                  placeholder="Paste the discussion transcript here..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  {transcript.length} characters
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Error</p>
                      <p className="text-sm text-red-800 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!transcript.trim()}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5 mr-2" />
                Analyze Transcript
              </button>
            </>
          )}

          {/* Progress Display */}
          {isAnalyzing && (
            <div className="space-y-6">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {progress.message}
                </h3>
                <p className="text-sm text-gray-500">
                  Estimated time remaining: {timeRemaining} seconds
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Progress Steps */}
              <div className="space-y-2">
                {progressSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2 text-sm ${
                      idx < progress.step
                        ? 'text-green-600'
                        : idx === progress.step
                        ? 'text-primary-600 font-medium'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className="w-5 h-5 flex-shrink-0">
                      {idx < progress.step ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : idx === progress.step ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current" />
                      )}
                    </div>
                    <span>{step.message}</span>
                  </div>
                ))}
              </div>

              {/* Detected Students Preview */}
              {progress.detectedStudents.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Detected Students:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {progress.detectedStudents.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-lg font-medium text-green-900">Analysis Complete!</p>
                    <p className="text-sm text-green-800 mt-1">
                      Processed {result.students?.length || 0} students from Week {weekNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-900">
                  ✅ Week {weekNumber} has been added to your dashboard! You can now view the results in student profiles and select it from the week dropdown.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setTranscript('');
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Analyze Another
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
