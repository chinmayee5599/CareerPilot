import { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Play, Pause, RotateCcw, Send, MessageSquare,
  Clock, Award, TrendingUp, ChevronRight, Volume2, Video, VideoOff
} from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

const DEMO_QUESTIONS = [
  "Tell me about yourself and your background in backend engineering.",
  "Describe a time you had to optimize a slow API. What was your approach?",
  "How do you handle database migrations in a production environment?",
  "Explain the difference between REST and gRPC. When would you choose one over the other?",
  "Walk me through how you would design a rate limiter for a high-traffic API.",
];

function ScoreRing({ value, label, size = 80 }: { value: number; label: string; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={7} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
            strokeWidth={7} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
    </div>
  );
}

export default function InterviewSimulator() {
  const { sessions, scoreBreakdown } = useDemoData();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setTimer(0);
    setCurrentQuestion(0);
    setSessionComplete(false);
    setMessages([
      {
        id: '1',
        role: 'ai',
        content: `Welcome to your interview practice session! I will ask you ${DEMO_QUESTIONS.length} questions. Let's begin.\n\n**Question 1:** ${DEMO_QUESTIONS[0]}`,
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const nextQ = currentQuestion + 1;
      if (nextQ < DEMO_QUESTIONS.length) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: `Good response! Here is some feedback: Your answer was well-structured and included specific examples. Consider adding more quantifiable results next time.\n\n**Question ${nextQ + 1}:** ${DEMO_QUESTIONS[nextQ]}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentQuestion(nextQ);
      } else {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: `Excellent work! You have completed all ${DEMO_QUESTIONS.length} questions. Here is your session summary:\n\n- Communication: 84/100\n- Technical Depth: 68/100\n- Structured Thinking: 76/100\n- Problem Solving: 92/100\n- Confidence: 80/100\n\nOverall Score: 74/100\n\nKey insight: Your problem-solving skills are exceptional. Focus on deepening technical explanations for system design questions.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
        setSessionComplete(true);
        setIsActive(false);
      }
    }, 1500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!isActive && messages.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Interview Simulator</h1>
          <p className="text-slate-500 mt-1">Practice with AI-powered mock interviews and get real-time feedback.</p>
        </div>

        {/* Session Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {['Behavioral', 'System Design', 'DSA', 'HR Round'].map((type, i) => {
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500'];
            const session = sessions.find(s => s.session_type === type);
            return (
              <button
                key={type}
                onClick={startSession}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left hover:shadow-md transition-shadow group"
              >
                <div className={`w-10 h-10 rounded-lg ${colors[i]} flex items-center justify-center mb-3`}>
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">{type}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {session ? `${session.questions_count} questions · Avg ${session.score}` : '5 questions · AI feedback'}
                </p>
                <div className="flex items-center gap-1 mt-3 text-emerald-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Start Session <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Past Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Past Sessions</h2>
          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{session.session_type}</p>
                  <p className="text-xs text-slate-500">{session.questions_count} questions · {session.duration_minutes} min</p>
                </div>
                <div className="flex items-center gap-4">
                  <ScoreRing value={session.score || 0} label="Score" size={60} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Session Complete!</h2>
          <p className="text-slate-500 mt-2">Here is how you performed</p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
            <ScoreRing value={scoreBreakdown.communication} label="Communication" />
            <ScoreRing value={scoreBreakdown.technicalDepth} label="Technical Depth" />
            <ScoreRing value={scoreBreakdown.structuredThinking} label="Structured Thinking" />
            <ScoreRing value={scoreBreakdown.problemSolving} label="Problem Solving" />
            <ScoreRing value={scoreBreakdown.confidenceSignals} label="Confidence" />
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={startSession}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              Start New Session
            </button>
            <button
              onClick={() => { setMessages([]); setSessionComplete(false); }}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen">
      {/* Session Header */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Interview Practice</h2>
            <p className="text-xs text-slate-500">Question {currentQuestion + 1} of {DEMO_QUESTIONS.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { setIsActive(false); setMessages([]); }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  <div className="whitespace-pre-line">{msg.content}</div>
                  <span className={`text-[10px] mt-1 block ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4 bg-white">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
                  isRecording ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type your response..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="p-3 rounded-xl bg-emerald-600 text-white flex-shrink-0 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="hidden lg:flex w-72 border-l border-slate-200 bg-slate-50 flex-col">
          {/* Camera Preview */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Camera</span>
              <button
                onClick={() => setShowCamera(!showCamera)}
                className="p-1 rounded hover:bg-slate-200 text-slate-500"
              >
                {showCamera ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            </div>
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
              {showCamera ? (
                <div className="text-white text-xs">Camera preview</div>
              ) : (
                <VideoOff className="w-8 h-8 text-slate-500" />
              )}
            </div>
          </div>

          {/* Live Scores */}
          <div className="p-4 flex-1 overflow-y-auto">
            <span className="text-xs font-semibold text-slate-500 uppercase">Live Metrics</span>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <ScoreRing value={scoreBreakdown.communication} label="Communication" size={70} />
              <ScoreRing value={scoreBreakdown.technicalDepth} label="Technical" size={70} />
              <ScoreRing value={scoreBreakdown.structuredThinking} label="Structure" size={70} />
              <ScoreRing value={scoreBreakdown.problemSolving} label="Problem Solving" size={70} />
            </div>

            <div className="mt-6">
              <span className="text-xs font-semibold text-slate-500 uppercase">Tips</span>
              <div className="mt-2 space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">Use the STAR method for behavioral questions</p>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">Quantify your impact with metrics</p>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">Speak clearly and pause between points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
