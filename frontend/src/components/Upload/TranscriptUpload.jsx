import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function TranscriptUpload() {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const [weekNumber, setWeekNumber] = useState('21');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please paste a transcript first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress('Preparing transcript...');

    try {
      setProgress('Sending to AI for analysis...');

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

      setProgress('Processing results...');
      const data = await response.json();

      setResult(data);
      setProgress('');
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze transcript');
      setProgress('');
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    // Load Week 20 transcript as sample
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
          {!result && (
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
                  disabled={isAnalyzing}
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
                    disabled={isAnalyzing}
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
                  disabled={isAnalyzing}
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
                disabled={isAnalyzing || !transcript.trim()}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {progress || 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Analyze Transcript
                  </>
                )}
              </button>
            </>
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
                      Processed {result.students?.length || 0} students from Week {result.transcript_metadata?.week || weekNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Overview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Topic:</span> {result.transcript_metadata?.topic || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Turns:</span> {result.transcript_metadata?.total_turns || 0}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Overall Engagement:</span> {result.session_analysis?.overall_engagement || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Student Results */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Results</h3>
                <div className="space-y-4">
                  {result.students?.map((student) => (
                    <div key={student.student_id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{student.student_id}</h4>
                        <span className="text-sm text-gray-600">
                          {student.total_turns} turns
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(student.suggested_score || {}).map(([skill, score]) => {
                          if (skill === 'score_note') return null;
                          return (
                            <div key={skill} className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{score}</div>
                              <div className="text-xs text-gray-500 truncate">
                                {skill.split('_')[0]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setTranscript('');
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
