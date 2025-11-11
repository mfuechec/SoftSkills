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
    setTranscript(`**Teacher:** Let's discuss Chapters 4-7 of Brave New World. What are you noticing about how this society maintains control?

**Casey:** The conditioning is really intense. Like, they literally train people from birth to accept their place in society.

**Jordan:** Yeah, and everyone just goes along with it. Nobody questions the system.

**Maya:** Well, except Bernard. He seems uncomfortable with everything.

**Sam:** Bernard is so whiny though. Like, okay, you're unhappy, do something about it.

**Alex:** I don't think it's that easy, Sam. Everyone around him thinks he's weird. That's really isolating.

**Maya:** Alex, that's a really empathetic point. Bernard is struggling against an entire system by himself.

**Sam:** Okay, you're right. I hadn't thought about how lonely that would be.

**Jordan:** I feel like there's something important about how the society uses pleasure to control people. It's like... more sinister than force?

**Casey:** Oh, absolutely! Because people think they're free. Force is obvious, but pleasure is sneaky.

**Maya:** Casey, that's such an insightful observation. It connects back to what we were talking about last week.

**Alex:** It reminds me of what Jordan said about social media. We think we're choosing to use it, but maybe we're kind of addicted.

**Jordan:** Exactly, Alex! And that makes it way harder to resist than if someone was obviously controlling us.

**Sam:** So what you're saying is... we're all living in a version of Brave New World?

**Casey:** Maybe not quite that extreme, but there are definitely parallels.

**Maya:** I think the question is: how do we recognize when we're being controlled and actually do something about it?

**Jordan:** That's where Bernard is interesting, right? He recognizes it but doesn't know what to do.

**Alex:** He's also scared. Like, what if he speaks up and everyone rejects him?

**Casey:** Well, they're already kind of rejecting him. So maybe he has nothing to lose?

**Sam:** [interrupts] Yeah but—

**Jordan:** [gently] Hold on Sam, I think Casey's making a point.

**Sam:** Oh, sorry Casey. Go ahead.

**Casey:** I was just going to say, sometimes you have to risk rejection to stand up for what you believe in. That's what Jonas did.

**Maya:** That's a beautiful connection to The Giver, Casey. Both books are about that moment when you have to choose between comfort and truth.

**Jordan:** And I think what makes it hard is that choosing truth means losing everything that feels safe.

**Alex:** But staying comfortable means losing yourself.

**Maya:** Wow, Alex. That's really profound.

**Sam:** Okay, Alex just summed up both books in one sentence.

**Jordan:** [laughs] Seriously. That's going in my notes.

**Casey:** Do you think we'll meet anyone in Brave New World who actually successfully rebels? Or is it going to be depressing like The Giver might have been?

**Maya:** That's a great question. What do you all predict?

**Sam:** I think someone will try but fail. These dystopias don't usually have happy endings.

**Jordan:** Unless the point is to make us think about our own world, not to give us a neat resolution.

**Alex:** That would make sense. Like, the books are supposed to make us uncomfortable so we change things in real life.

**Casey:** I really like that interpretation, Alex.

**Maya:** Me too. These books aren't about escaping into a story - they're mirrors showing us what to avoid.

**Jordan:** So the real question is: what are we going to do with what we're learning?

**Sam:** That's heavy, Jordan. But you're right.

**Teacher:** These are exactly the kinds of questions I hoped you'd be asking. Let's dig deeper into the control mechanisms. What else have you noticed about how pleasure is used in this society?

**Alex:** The soma. They take it whenever they feel even slightly uncomfortable. It's like they've completely eliminated the ability to deal with negative emotions.

**Casey:** Right. And that's presented as a good thing - like suffering is this terrible evil that should be erased. But what happens when you can't feel pain?

**Jordan:** You can't grow. Pain and discomfort are how we learn and develop as people.

**Maya:** Jordan, that's such an important insight. Can you expand on that?

**Jordan:** Well, like, think about anything difficult you've done. Learning an instrument, working through a hard problem, having a difficult conversation. It's uncomfortable, but that's how you become stronger.

**Sam:** So in Brave New World, everyone stays weak because they never have to struggle?

**Casey:** Exactly. They're stunted. They can't mature emotionally because they run from anything hard.

**Alex:** It's like emotional babies in adult bodies. That's disturbing.

**Maya:** That's a vivid way to put it, Alex, but you're right. The society has created perpetual children who can't handle reality.

**Jordan:** And it's all by design. The Controllers want them that way - easier to manage people who can't think critically.

**Sam:** What about Lenina? She seems smart, but she's completely brainwashed. Every time Bernard tries to have a real conversation, she just repeats slogans.

**Casey:** The slogans are another control mechanism! "Everyone belongs to everyone else." "Ending is better than mending." They replace actual thinking with catchphrases.

**Maya:** Casey, yes! Language as a tool of control. Have you all noticed how limited their vocabulary is for discussing feelings or ideas?

**Alex:** They can't even understand what Bernard's trying to say when he talks about being alone or wanting meaning. They literally don't have the words for it.

**Jordan:** That's like what happened in The Giver too. Remember how they had to have "precision of language" but actually their language was super limited?

**Sam:** Oh wow, I didn't connect that. Both societies control language to control thought.

**Casey:** If you can't name something, you can't think about it. It's a form of erasure.

**Maya:** This is excellent analysis. You're seeing how these books use similar techniques in different ways.

**Teacher:** Let's talk about the caste system. How does that function as control?

**Jordan:** People are literally designed for their jobs. Alphas are smart, Epsilons are basically servants, and everyone in between has their place.

**Casey:** And they're conditioned from before birth to be happy with their position. The hypnopaedia makes them believe they're lucky to be what they are.

**Alex:** That's so messed up. Like, an Epsilon could have been an Alpha in a different world, but they're engineered to be less intelligent and then told to be grateful for it.

**Sam:** At least they don't know what they're missing? Like, if you genuinely believe you're happy, does it matter that you could have been more?

**Maya:** Sam's playing devil's advocate here. What do you all think - does ignorance equal happiness?

**Jordan:** I don't think so. Because even if they don't know what they're missing, they're still being denied their full potential as humans.

**Casey:** Plus, we've seen that the system isn't perfect. Bernard exists. Helmholtz exists. People slip through the cracks and feel dissatisfied even without knowing why.

**Alex:** That actually gives me hope. Like, the human spirit can't be completely crushed, even with all this conditioning.

**Maya:** That's a beautiful observation, Alex. There's something in humans that resists total control.

**Sam:** But most people don't resist. It's just a few weird outliers. The system mostly works.

**Jordan:** Which is terrifying. It means that control through pleasure is really effective on most people.

**Casey:** More effective than control through force would be. Force creates obvious oppression and rebellion. Pleasure creates... compliance that feels like freedom.

**Maya:** Casey, you've identified something crucial. The most effective tyranny is the one people don't recognize as tyranny.

**Alex:** Are we going back to the social media thing? Because I keep thinking about how this relates to our phones and stuff.

**Jordan:** I think we have to. These books are warnings. Huxley wrote this in the 1930s but it feels like he was predicting our exact moment.

**Sam:** So what do we do about it? Like, we can analyze the book all we want, but if we're living in a version of it, what's the answer?

**Casey:** Awareness is the first step. You can't resist what you don't recognize.

**Maya:** That's absolutely right. And you're all demonstrating that awareness by making these connections.

**Alex:** But awareness isn't enough on its own. Bernard is aware, but he's also kind of pathetic because he won't actually do anything.

**Jordan:** Alex, that's harsh but true. He complains but doesn't act. He wants to rebel but also wants to be accepted.

**Sam:** To be fair, acting would mean giving up everything. His job, his friends, his whole life. That's a big ask.

**Casey:** But isn't that what integrity requires sometimes? Sacrificing comfort for truth?

**Maya:** You're all grappling with a really difficult question - what's the price of living authentically in a false world?

**Jordan:** And different people have different answers. Jonas paid the price and left. Bernard can't bring himself to do it.

**Alex:** What would each of us do, honestly? Like, if we were in that world, would we be Jonas or Bernard?

**Sam:** I want to say I'd be Jonas, but realistically, I'd probably be too scared. I'd be Bernard, complaining but not acting.

**Casey:** I think it depends on whether I had someone to do it with. Jonas had The Giver. Bernard is alone. That makes a huge difference.

**Maya:** Casey, that's a really important point about community and support in resistance. It's so much harder alone.

**Jordan:** Which is maybe why the society isolates people emotionally. "Everyone belongs to everyone" actually means nobody truly connects with anyone.

**Alex:** So they're alone together. That's almost sadder than being actually alone.

**Sam:** I'm getting depressed. Does anything good happen in this book, or is it just bleak all the way through?

**Casey:** The bleakness is kind of the point though, isn't it? We're supposed to be disturbed.

**Maya:** Casey's right, but Sam's feeling is also valid. This is heavy material. What's making you most uncomfortable, Sam?

**Sam:** I think it's the hopelessness. Like, the system is so complete and so effective. How do you fight something that's everywhere and that most people support?

**Jordan:** You fight it by living differently. By refusing to take the soma, metaphorically speaking. By staying conscious even when it's easier to zone out.

**Alex:** By having real relationships instead of shallow ones. By choosing discomfort over fake happiness.

**Casey:** By reading books like this and talking about them and keeping ourselves aware. That's what we're doing right now.

**Maya:** Yes. This discussion is an act of resistance in itself. You're thinking critically, questioning, connecting ideas. That's exactly what the World State tries to prevent.

**Teacher:** We have a few minutes left. What's one thing you want to pay attention to as we continue reading?

**Jordan:** I want to see what happens when they go to the Savage Reservation. That seems like it'll be a major turning point.

**Casey:** I'm interested in whether anyone successfully rebels or if it's just going to be tragic. I need to know if resistance is even possible.

**Alex:** I want to understand Lenina better. Right now she seems one-dimensional, but I hope there's more to her.

**Sam:** I want to see if Bernard grows a spine. Like, will something push him to actually act on his beliefs?

**Maya:** I'm curious about how Huxley resolves the philosophical questions he's raising. Or if he even tries to resolve them.

**Teacher:** Excellent goals. Keep these questions in mind as you read. And keep bringing your full selves to these discussions. The connections you're making to our world, to other books, to your own experiences - that's what makes literature meaningful.

**Jordan:** This is probably our best discussion yet.

**Casey:** Agreed. I love when we get into the deep questions like this.

**Alex:** Me too. It makes the reading feel important, not just like homework.

**Sam:** Even though it's kind of depressing, I'm glad we're reading this. It's making me think about stuff I usually don't question.

**Maya:** That's the goal of education, Sam. Not just learning facts, but learning to think critically about the world.

**Teacher:** On that note, we'll end here. Great work today, everyone.`);
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
