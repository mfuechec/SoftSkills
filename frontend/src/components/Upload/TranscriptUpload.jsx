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
    setTranscript(`**Teacher:** Welcome to our first deep discussion of Brave New World. What are your initial impressions?

**Casey:** It's so different from The Giver. Everything is excessive instead of restricted.

**Jordan:** Yeah, but the result is the same—people who don't think for themselves.

**Maya:** That's a really important parallel. Different methods, same outcome.

**Sam:** The conditioning is way more intense than anything in The Giver. They literally engineer people before they're even born.

**Alex:** And then they brainwash them while they sleep. It's disturbing how thorough it is.

**Casey:** The hypnopaedia—sleep teaching—is genius and terrifying. By the time people are adults, they can't even conceive of questioning the system.

**Jordan:** At least in The Giver, Jonas could wake up and see the truth. In Brave New World, is that even possible?

**Maya:** Good question, Jordan. What do you all think?

**Alex:** I think Bernard shows it's possible. He's uncomfortable with everything, even though he was conditioned the same way.

**Sam:** But Bernard is also kind of annoying. [interrupts] He complains but doesn't—oh, sorry Casey, go ahead.

**Casey:** [smiles] I was going to say something similar actually. Bernard sees the problems but he's too caught up in wanting acceptance to really rebel.

**Sam:** Yeah, exactly. Sorry for jumping in.

**Jordan:** It's okay, Sam. You caught yourself fast. And you're right—Bernard is all talk and no action so far.

**Maya:** Sam, I appreciate how quickly you self-corrected. That shows real growth.

**Alex:** I think Bernard is realistic though. Not everyone who sees problems has the courage to fight them.

**Casey:** That's true. He's like if Jonas was weaker or more conflicted. He knows something's wrong but can't bring himself to sacrifice his comfort.

**Jordan:** Helmholtz is more interesting to me. He's successful and valued, but he still feels empty.

**Sam:** What's Helmholtz's job again? I got confused by all the titles.

**Casey:** He's an Emotional Engineer. He writes the propaganda that conditions people. So he's part of the system, but he's starting to question it.

**Alex:** That makes him dangerous to the World State. If the people creating the propaganda start doubting, the whole system could collapse.

**Maya:** Alex, that's really insightful. The system only works if everyone believes in it, especially those in power.

**Jordan:** And Lenina is the perfect example of someone who's been completely conditioned. She can't even understand what Bernard is trying to say.

**Casey:** Every time Bernard tries to have a real conversation, she just repeats slogans. "Everyone belongs to everyone else." "Ending is better than mending."

**Sam:** Those slogans are creepy. They're designed to stop people from thinking.

**Alex:** Like precision of language in The Giver. Both societies use language to control thought.

**Maya:** Excellent connection, Alex. How else is language used in Brave New World?

**Alex:** Well, words like "mother" and "father" are considered obscene. They've erased family language because they've erased families.

**Jordan:** That's brutal. In The Giver, families existed even if they weren't based on love. In Brave New World, there's no family concept at all.

**Casey:** Which society is worse for that? Having fake families or no families?

**Sam:** I think no families is worse. At least Jonas had his parents and Lily, even if the relationships were shallow.

**Alex:** But fake families might be crueler because you think you have love when you don't. In Brave New World, people don't expect family love, so they don't miss it.

**Jordan:** That's depressing but logical. You can't miss what you never knew existed.

**Maya:** These are complex ethical questions. There aren't easy answers.

**Casey:** The caste system is horrifying. People are literally designed to be less intelligent so they can be workers.

**Sam:** And they're conditioned to be happy about it. Epsilons are taught to be grateful they're Epsilons.

**Alex:** That's the ultimate control—making people love their own oppression.

**Jordan:** At least in The Giver, people didn't know they were oppressed. In Brave New World, they're taught that their oppression is freedom.

**Maya:** Jordan, can you explain that distinction more?

**Jordan:** Sure. In The Giver, people thought they were happy and equal, but they were wrong. In Brave New World, people are told "you're free" while being completely controlled, and they believe it because freedom has been redefined.

**Casey:** So it's a language thing again. Freedom means something different to them than it means to us.

**Alex:** Like how release meant something different in The Giver. Euphemisms and redefinitions are tools of control.

**Sam:** I'm noticing that pattern everywhere now. In real life, not just books.

**Maya:** That's exactly what critical thinking looks like, Sam. Applying literary lessons to the world around you.

**Jordan:** The soma is maybe the scariest part. A drug that makes you feel good without any consequences.

**Casey:** It's literally chemical control. Feeling sad? Take soma. Feeling angry? Take soma. Don't ever deal with real emotions.

**Alex:** And everyone takes it willingly. There's no force needed because people want to escape discomfort.

**Sam:** That connects to what we said about our own world. Social media, phones, entertainment—we use those like soma sometimes.

**Jordan:** Yeah, to distract ourselves from problems instead of facing them.

**Maya:** These connections show sophisticated analysis. You're not just reading—you're understanding systems of control.

**Casey:** Do you think anyone in Brave New World will successfully rebel? Or is it all going to be tragic?

**Alex:** Based on the tone, I think it'll be tragic. But maybe meaningful tragedy, like The Giver.

**Jordan:** I hope someone rebels successfully. I need to believe resistance is possible, even in impossible situations.

**Sam:** What about John? The introduction mentioned someone called John the Savage.

**Casey:** He hasn't appeared yet, but I bet he's important. Probably someone from outside the World State.

**Alex:** That would be interesting. Someone who wasn't conditioned, seeing the society for the first time.

**Maya:** Like an outside perspective showing what's wrong with the system.

**Jordan:** Jonas had to learn to see clearly. Maybe John already sees clearly because he's from outside.

**Sam:** I hope he shakes things up. This society needs someone to challenge it.

**Casey:** Though realistically, one person probably can't change a global system. That's even harder than changing Jonas's small community.

**Alex:** But even failed resistance matters. It shows that human nature can't be completely suppressed.

**Jordan:** That's hopeful, Alex. Even in dystopia, the human spirit survives.

**Maya:** What are you most interested in as we continue reading?

**Casey:** I want to see if anyone breaks through their conditioning. If it's possible to wake up in this world.

**Sam:** I want to meet John and see what happens when someone unconditioned encounters this society.

**Jordan:** I'm interested in Helmholtz. He seems like he might actually do something, not just complain like Bernard.

**Alex:** I want to know if there's any hope. The Giver was ambiguous. Will Brave New World be completely bleak or is there a way forward?

**Maya:** All great goals for our continued reading. This is clearly a darker, more cynical book than The Giver.

**Jordan:** Yeah, Lowry seemed to believe in individual courage changing things. Huxley seems more pessimistic.

**Casey:** Maybe because Huxley's dystopia is more complete. It's global, it's technological, it's thoroughly internalized by everyone.

**Alex:** That makes rebellion almost impossible. But maybe that's the point—to warn us before we get there.

**Sam:** Like, we're not at Brave New World yet, but we could be if we're not careful.

**Maya:** Exactly. Dystopian fiction is always a warning about the present, not a prediction about the future.

**Teacher:** Excellent first discussion. I'm impressed by how you're drawing connections to The Giver and to our own world. Let's talk about the science briefly. Huxley wrote this in 1932. How do you feel about his predictions?

**Jordan:** Some of it seems pretty accurate. We have genetic engineering now. Test tube babies. Pharmaceutical mood management.

**Casey:** Yeah, we're not as extreme as Brave New World, but the pieces are there. That's what makes it scary.

**Sam:** I never thought a book from the 1930s would feel so relevant. But it really does.

**Alex:** Good dystopian fiction is timeless because it's about human nature, not technology. Technology just changes how control happens.

**Maya:** That's a sophisticated observation, Alex. The methods change but the fundamental questions about freedom and control remain.

**Jordan:** So whether it's pills, propaganda, genetic engineering, or social media—it's all about preventing people from thinking critically.

**Casey:** And getting people to voluntarily give up freedom for comfort.

**Sam:** Which is what makes Brave New World scarier than The Giver. Force is obvious and creates resistance. But comfort? People embrace that.

**Alex:** We trade freedom for convenience all the time. Privacy for apps. Attention for entertainment. Time for scrolling.

**Jordan:** That's uncomfortably accurate.

**Maya:** But recognizing it is the first step. You can't resist what you don't see.

**Casey:** So these books are teaching us to see. To recognize control even when it feels good.

**Sam:** I'm going to be paranoid about everything now.

**Alex:** Not paranoid. Aware. There's a difference.

**Jordan:** Right. Paranoia is irrational fear. Awareness is rational observation.

**Maya:** Well said. Critical thinking isn't about being scared of everything—it's about understanding systems and making informed choices.

**Teacher:** This has been an outstanding discussion. Your growth over these past weeks is remarkable. Sam, your self-correction was perfect. Alex, your confidence and insight are wonderful to see. Everyone, your ability to connect ideas and think critically is impressive. Keep this momentum going. See you next week for more Brave New World.

**Sam:** This is going to be an intense book.

**Casey:** But worth it, like The Giver.

**Alex:** Yeah. Hard books teach us important things.

**Jordan:** And this group makes the discussions valuable. We all push each other to think deeper.

**Maya:** That's what makes this class special. We're learning together.`);
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
