import { useEffect, useState } from 'react';
import { api } from './lib/api';
import { curriculumApi } from './data/curriculumApi';
import { getPracticeQuestionsForAttempt } from './data/questionBank';
import { gradeInfo, type Grade, type Subject } from './data/curriculum';
import { curriculum } from './data/syllabusCurriculum';
import type { GeneratedQuestion } from './data/questionBank';
import type { LessonDetail } from './data/lessons';
import { LearningVisual } from './components/LearningVisual';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Plus,
  RotateCcw,
  Settings,
  Star,
  Trophy,
  TreePine,
  Users,
  Volume2,
  VolumeX,
  Play,
  X,
} from 'lucide-react';

type View =
  | 'home'
  | 'subject'
  | 'lesson'
  | 'progress'
  | 'revision'
  | 'assessment'
  | 'teacher'
  | 'settings';

type Theme = 'meadow' | 'ocean' | 'sunset' | 'berry' | 'sky';
type GrowthProject = 'tree' | 'house' | 'painting';
type VoiceTone = 'calm' | 'clear' | 'bright';
type VoiceSettings = { enabled: boolean; voiceURI: string; tone: VoiceTone; volume: number };

const voiceSettingsKey = 'cbc-voice-settings';
const defaultVoiceSettings: VoiceSettings = { enabled: false, voiceURI: '', tone: 'clear', volume: 1 };
const voiceToneProfiles: Record<VoiceTone, { rate: number; pitch: number }> = {
  calm: { rate: 0.82, pitch: 1.08 },
  clear: { rate: 0.9, pitch: 1 },
  bright: { rate: 0.94, pitch: 1.12 },
};

const loadVoiceSettings = (): VoiceSettings => {
  try {
    const saved = JSON.parse(localStorage.getItem(voiceSettingsKey) || '{}');
    return {
      enabled: saved.enabled === true,
      voiceURI: typeof saved.voiceURI === 'string' ? saved.voiceURI : '',
      tone: ['calm', 'clear', 'bright'].includes(saved.tone) ? saved.tone : 'clear',
      volume: typeof saved.volume === 'number' ? Math.min(1, Math.max(0.2, saved.volume)) : 1,
    };
  } catch {
    return defaultVoiceSettings;
  }
};

const supportsSpeech = () => typeof window !== 'undefined'
  && 'speechSynthesis' in window
  && typeof SpeechSynthesisUtterance !== 'undefined';

type Profile = {
  id: string;
  name: string;
  grade: Grade;
  age: string;
  school: string;
  favoriteSubject: Subject;
  avatar: string;
  theme: Theme;
  growthProject: GrowthProject;
  progress: Record<string, number>;
  points: number;
  activityDates: string[];
  completedTasks: string[];
};

const avatarOptions = ['🌻', '🦁', '🚀', '🦋', '🐼', '🦄'];
const growthProjects: { id: GrowthProject; label: string; icon: string; stages: string[] }[] = [
  { id: 'tree', label: 'Grow a tree', icon: '🌱', stages: ['🌱', '🌿', '🌳'] },
  { id: 'house', label: 'Build a house', icon: '🧱', stages: ['🧱', '🏠', '🏡'] },
  { id: 'painting', label: 'Paint a picture', icon: '🎨', stages: ['🖌️', '🖼️', '🌈'] },
];
const themeOptions: { id: Theme; label: string; colour: string }[] = [
  { id: 'meadow', label: 'Meadow', colour: '#2f765f' },
  { id: 'ocean', label: 'Ocean', colour: '#2c7292' },
  { id: 'sunset', label: 'Sunset', colour: '#b75f3e' },
  { id: 'berry', label: 'Berry', colour: '#8b4772' },
  { id: 'sky', label: 'Sky', colour: '#4c6fa4' },
];

const makeProfile = (
  details: Pick<Profile, 'name' | 'grade' | 'age' | 'school' | 'favoriteSubject' | 'avatar' | 'theme' | 'growthProject'>
): Profile => ({
  ...details,
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  progress: {},
  points: 0,
  activityDates: [],
  completedTasks: [],
});

const loadProfiles = (): Profile[] => {
  try {
    return JSON.parse(localStorage.getItem('cbc-profiles') || '[]');
  } catch {
    return [];
  }
};


function App() {
  const [view, setView] = useState<View>('home');
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);
  const [activeProfileId, setActiveProfileId] = useState(
    () => localStorage.getItem('cbc-active-profile') || ''
  );
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    grade: 1 as Grade,
    age: '',
    school: '',
    favoriteSubject: 'Mathematics' as Subject,
    avatar: avatarOptions[0],
    theme: 'meadow' as Theme,
    growthProject: 'tree' as GrowthProject,
  });
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [grade, setGrade] = useState<Grade>(1);
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<GeneratedQuestion[]>([]);
  const [attemptQuestions, setAttemptQuestions] = useState<GeneratedQuestion[]>([]);
  const [previousAttemptQuestionIds, setPreviousAttemptQuestionIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewOpen, setReviewOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [taskKind, setTaskKind] = useState<'lesson' | 'assessment' | 'revision'>('lesson');
  const [adultProfileId, setAdultProfileId] = useState('');
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'syncing' | 'synced'>('local');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(loadVoiceSettings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechAvailable = supportsSpeech();
  const activeProfile = profiles.find(profile => profile.id === activeProfileId);
  const today = new Date().toISOString().slice(0, 10);
  const currentTheme = activeProfile?.theme || 'meadow';
  const selectedGrowth = growthProjects.find(project => project.id === (activeProfile?.growthProject || 'tree')) || growthProjects[0];

  const [curriculumData, setCurriculumData] = useState(() => curriculumApi.getCurriculumForGradeSubject(grade, subject));
  const [allLessons, setAllLessons] = useState<LessonDetail[]>(() => curriculumApi.getLessons(grade, subject));

  useEffect(() => {
    if (!speechAvailable) return;
    const speech = window.speechSynthesis;
    const updateVoices = () => setAvailableVoices(speech.getVoices().filter(voice => voice.lang.toLowerCase().startsWith('en')));
    updateVoices();
    speech.addEventListener('voiceschanged', updateVoices);
    return () => speech.removeEventListener('voiceschanged', updateVoices);
  }, [speechAvailable]);

  useEffect(() => {
    localStorage.setItem(voiceSettingsKey, JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  useEffect(() => {
    if (!voiceSettings.enabled && speechAvailable) window.speechSynthesis.cancel();
  }, [voiceSettings.enabled, speechAvailable]);

  useEffect(() => () => {
    if (speechAvailable) window.speechSynthesis.cancel();
  }, [speechAvailable]);

  const speakText = (text: string) => {
    if (!voiceSettings.enabled || !speechAvailable) return;
    const speech = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = availableVoices.find(item => item.voiceURI === voiceSettings.voiceURI);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en-GB';
    utterance.rate = voiceToneProfiles[voiceSettings.tone].rate;
    utterance.pitch = voiceToneProfiles[voiceSettings.tone].pitch;
    utterance.volume = voiceSettings.volume;
    speech.cancel();
    speech.speak(utterance);
  };

  const readAloudButton = (text: string) => voiceSettings.enabled && speechAvailable && (
    <button
      className="speak-btn"
      type="button"
      aria-label={`Read sentence aloud: ${text}`}
      title="Read this sentence aloud"
      onClick={() => speakText(text)}
    >
      <Volume2 size={16} />
    </button>
  );

  const voiceToggle = (
    <label className="voice-toggle">
      <input
        type="checkbox"
        aria-label="Read aloud"
        checked={voiceSettings.enabled}
        disabled={!speechAvailable}
        onChange={event => setVoiceSettings(current => ({ ...current, enabled: event.target.checked }))}
      />
      <span>{voiceSettings.enabled ? 'On' : 'Off'}</span>
    </label>
  );

  useEffect(() => {
    let ignore = false;

    const loadCurriculum = async () => {
      const nextData = curriculumApi.getCurriculumForGradeSubject(grade, subject);
      const nextLessons = curriculumApi.getLessons(grade, subject);

      if (!ignore) {
        setCurriculumData(nextData);
        setAllLessons(nextLessons);
        setSelectedStrand(null);
      }
    };

    loadCurriculum();

    return () => {
      ignore = true;
    };
  }, [grade, subject]);

  const data = curriculumData;
  const visibleLessons = selectedStrand
    ? allLessons.filter(item => item.strand === selectedStrand)
    : allLessons;
  const lessonQuestions = attemptQuestions;
  const currentQuestion = lessonQuestions[answerIndex];

  useEffect(() => {
    let ignore = false;
    if (!activeProfile) return () => { ignore = true; };

    setProgress(activeProfile.progress ?? {});
    setGrade(activeProfile.grade);
    setSubject(activeProfile.favoriteSubject);

    const loadProfileProgress = async () => {
      try {
        const response = await api.get(`/api/progress?profileId=${encodeURIComponent(activeProfile.id)}`) as {
          progress?: Record<string, number>;
        };
        if (ignore) return;
        const localProgress = activeProfile.progress ?? {};
        const remoteProgress = response.progress ?? {};
        const mergedProgress = Object.fromEntries(
          [...new Set([...Object.keys(localProgress), ...Object.keys(remoteProgress)])]
            .map(id => [id, Math.max(localProgress[id] ?? 0, remoteProgress[id] ?? 0)])
        );
        setProgress(mergedProgress);
        const nextProfiles = loadProfiles().map(profile =>
          profile.id === activeProfile.id ? { ...profile, progress: mergedProgress } : profile
        );
        persistProfiles(nextProfiles);
        setSyncStatus('synced');
      } catch {
        if (!ignore) setSyncStatus('local');
      }
    };

    loadProfileProgress();
    return () => { ignore = true; };
  }, [activeProfileId]);

  const persistProfiles = (nextProfiles: Profile[]) => {
    setProfiles(nextProfiles);
    localStorage.setItem('cbc-profiles', JSON.stringify(nextProfiles));
  };

  const addActivity = (sourceProfiles = profiles) => {
    if (!activeProfile || activeProfile.activityDates.includes(today)) return;
    const nextProfiles = sourceProfiles.map(profile =>
      profile.id === activeProfile.id
        ? { ...profile, activityDates: [...profile.activityDates, today] }
        : profile
    );
    persistProfiles(nextProfiles);
  };

  const saveProgress = async (
    lessonId: string,
    nextScore: number,
    total: number
  ) => {
    const pct = Math.round((nextScore / total) * 100);
    const next = {
      ...progress,
      [lessonId]: Math.max(progress[lessonId] || 0, pct),
    };
    setProgress(next);
    if (activeProfile) {
      const nextProfiles = profiles.map(profile =>
          profile.id === activeProfile.id ? { ...profile, progress: next } : profile
        );
      addActivity(nextProfiles);
      if (activeProfile.activityDates.includes(today)) persistProfiles(nextProfiles);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    try {
      if (activeProfile) {
        setSyncStatus('syncing');
        await api.post('/api/progress', { profileId: activeProfile.id, progress: next });
        setSyncStatus('synced');
      }
    } catch {
      setSyncStatus('local');
    }
  };

  const completeTask = (kind: 'lesson' | 'assessment' | 'revision') => {
    if (!activeProfile || !lesson) return;
    const taskId = kind === 'assessment'
      ? `${kind}:${grade}:${subject}`
      : `${kind}:${lesson.id}`;
    if (activeProfile.completedTasks.includes(taskId)) return;
    const nextProfiles = profiles.map(profile =>
      profile.id === activeProfile.id
        ? {
            ...profile,
            points: profile.points + 25,
            completedTasks: [...profile.completedTasks, taskId],
          }
        : profile
    );
    addActivity(nextProfiles);
    if (activeProfile.activityDates.includes(today)) persistProfiles(nextProfiles);
  };

  const openLesson = (
    nextLesson: LessonDetail,
    kind: 'lesson' | 'assessment' | 'revision' = 'lesson',
    questions = curriculumApi.getQuestionsForLesson(grade, subject, nextLesson.id)
  ) => {
    setLesson(nextLesson);
    setSessionQuestions(questions);
    setTaskKind(kind);
    setAnswerIndex(0);
    setSelected(null);
    setScore(0);
    setAnswers({});
    setPreviousAttemptQuestionIds([]);
    setReviewOpen(false);
    setAttemptQuestions(getPracticeQuestionsForAttempt(questions));
    setView('lesson');
  };

  const submitAnswer = () => {
    if (!currentQuestion || !selected) return;
    const nextAnswers = { ...answers, [currentQuestion.id]: selected };
    setAnswers(nextAnswers);

    if (answerIndex < lessonQuestions.length - 1) {
      setAnswerIndex(answerIndex + 1);
      setSelected(null);
      return;
    }

    const finalScore = lessonQuestions.reduce(
      (total, question) => total + (nextAnswers[question.id] === question.answer ? 1 : 0),
      0
    );
    setScore(finalScore);
    setAnswerIndex(lessonQuestions.length);
    setSelected(null);
    setReviewOpen(false);
    if (lesson) {
      const progressId = taskKind === 'assessment'
        ? `assessment:${grade}:${subject}`
        : lesson.id;
      void saveProgress(progressId, finalScore, lessonQuestions.length);
    }
    completeTask(taskKind);
  };

  const retryLesson = () => {
    const usedQuestionIds = [...previousAttemptQuestionIds, ...attemptQuestions.map(question => question.id)];
    setPreviousAttemptQuestionIds(usedQuestionIds);
    setAttemptQuestions(getPracticeQuestionsForAttempt(sessionQuestions, usedQuestionIds));
    setAnswerIndex(0);
    setSelected(null);
    setAnswers({});
    setScore(0);
    setReviewOpen(false);
  };

  const startGrade = (g: Grade) => {
    setGrade(g);
    setView('subject');
  };

  const startSubject = (s: Subject) => {
    setSubject(s);
    setView('subject');
  };

  const startAssessment = (s: Subject) => {
    const assessmentGrade = activeProfile?.grade ?? grade;
    const questions = curriculumApi.getAssessmentQuestions(assessmentGrade, s);
    const firstQuestion = questions[0];
    const firstLesson = firstQuestion
      ? curriculumApi.getLesson(assessmentGrade, s, firstQuestion.lessonId)
      : undefined;
    if (!firstLesson || !questions.length) return;
    setGrade(assessmentGrade);
    setSubject(s);
    openLesson(firstLesson, 'assessment', questions);
  };

  const completedFor = (g: Grade, s: Subject) => {
    const lessons = curriculum[g][s].lessons;
    if (!lessons.length) return 0;
    return Math.round(
      (lessons.filter(l => (progress[l.id] || 0) >= 80).length /
        lessons.length) *
        100
    );
  };

  const profileCompletedFor = (profile: Profile, g: Grade, s: Subject) => {
    const lessons = curriculum[g][s].lessons;
    return lessons.length
      ? Math.round((lessons.filter(l => (profile.progress[l.id] || 0) >= 80).length / lessons.length) * 100)
      : 0;
  };

  const adultProfile = profiles.find(profile => profile.id === adultProfileId) || profiles[0] || activeProfile;

  const overall = completedFor(activeProfile?.grade || grade, subject);

  const nav = (nextView: View) => {
    setView(nextView);
    setMobileMenu(false);
  };

  const selectProfile = (profile: Profile) => {
    setActiveProfileId(profile.id);
    localStorage.setItem('cbc-active-profile', profile.id);
    setShowProfileForm(false);
  };

  const beginEditProfile = (profile: Profile) => {
    setEditingProfileId(profile.id);
    setNewProfile({
      name: profile.name,
      grade: profile.grade,
      age: profile.age,
      school: profile.school,
      favoriteSubject: profile.favoriteSubject,
      avatar: profile.avatar,
      theme: profile.theme,
      growthProject: profile.growthProject,
    });
  };

  const createProfile = () => {
    if (!newProfile.name.trim() || !newProfile.age.trim() || !newProfile.school.trim()) return;
    const profile = makeProfile({ ...newProfile, name: newProfile.name.trim() });
    const nextProfiles = [...profiles, profile].slice(0, 3);
    persistProfiles(nextProfiles);
    selectProfile(profile);
  };

  const saveEditedProfile = () => {
    if (!editingProfileId || !newProfile.name.trim() || !newProfile.age.trim() || !newProfile.school.trim()) return;
    persistProfiles(profiles.map(profile => profile.id === editingProfileId ? { ...profile, ...newProfile, name: newProfile.name.trim() } : profile));
    setEditingProfileId(null);
  };

  const updateActiveProfile = (updates: Partial<Profile>) => {
    if (!activeProfile) return;
    persistProfiles(
      profiles.map(profile =>
        profile.id === activeProfile.id ? { ...profile, ...updates } : profile
      )
    );
  };

  const streak = activeProfile
    ? activeProfile.activityDates.reduce((count, date, index, dates) => {
        if (index === 0) return 1;
        const previous = new Date(dates[index - 1]);
        const current = new Date(date);
        return current.getTime() - previous.getTime() === 86400000 ? count + 1 : 1;
      }, 0)
    : 0;

  const nextLesson = lesson
    ? allLessons[allLessons.findIndex(item => item.id === lesson.id) + 1]
    : undefined;

  const openNextLesson = () => {
    if (nextLesson) openLesson(nextLesson, taskKind);
    else setView('subject');
  };

  if (!activeProfile) {
    return (
      <div className="login-shell">
        <div className="login-art">
          <span className="eyebrow">CBE WORKBOOK</span>
          <h1>Choose your<br /><span>learning space.</span></h1>
          <p>Every visit helps your ideas take root.</p>
          <div className="login-tree"><TreePine size={120} strokeWidth={1.2} /></div>
        </div>
        <div className="login-panel">
          <div className="login-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Who is learning today?</h2>
            <p>Choose a profile to continue, or create one for a new learner.</p>
          </div>
          <div className="profile-picker">
            {profiles.map(profile => (
              <button className="login-profile" key={profile.id} onClick={() => selectProfile(profile)}>
                <span className="avatar large">{profile.avatar}</span>
                <span><strong>{profile.name}</strong><small>Grade {profile.grade} • {profile.points} points</small></span>
                <ChevronRight size={18} />
              </button>
            ))}
            {profiles.length < 3 && (
              <button className="create-profile" onClick={() => setShowProfileForm(true)}>
                <Plus size={20} /><span><strong>Add learner profile</strong><small>{3 - profiles.length} profile slot{profiles.length === 2 ? '' : 's'} available</small></span>
              </button>
            )}
          </div>
          {showProfileForm && (
            <div className="profile-form">
              <div className="form-title"><strong>Create a learner profile</strong><button onClick={() => setShowProfileForm(false)} aria-label="Close"><X size={17} /></button></div>
              <div className="form-grid">
                <label>Name<input value={newProfile.name} onChange={e => setNewProfile({ ...newProfile, name: e.target.value })} placeholder="e.g. Akinyi" /></label>
                <label>Age<input value={newProfile.age} onChange={e => setNewProfile({ ...newProfile, age: e.target.value })} placeholder="e.g. 7" /></label>
                <label>School<input value={newProfile.school} onChange={e => setNewProfile({ ...newProfile, school: e.target.value })} placeholder="School name" /></label>
                <label>Grade<select value={newProfile.grade} onChange={e => setNewProfile({ ...newProfile, grade: Number(e.target.value) as Grade })}><option value="1">Grade 1</option><option value="2">Grade 2</option><option value="3">Grade 3</option></select></label>
                <label>Favourite subject<select value={newProfile.favoriteSubject} onChange={e => setNewProfile({ ...newProfile, favoriteSubject: e.target.value as Subject })}><option>Mathematics</option><option>English</option></select></label>
              </div>
              <div className="form-choice"><span>Choose an avatar</span><div className="avatar-options">{avatarOptions.map(avatar => <button key={avatar} className={newProfile.avatar === avatar ? 'chosen' : ''} onClick={() => setNewProfile({ ...newProfile, avatar })}>{avatar}</button>)}</div></div>
              <div className="form-choice"><span>Choose a theme</span><div className="theme-options">{themeOptions.map(theme => <button key={theme.id} className={newProfile.theme === theme.id ? 'chosen' : ''} onClick={() => setNewProfile({ ...newProfile, theme: theme.id })}><i style={{ background: theme.colour }} />{theme.label}</button>)}</div></div>
              <button className="primary form-submit" onClick={createProfile}>Create profile <ChevronRight size={17} /></button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={'app-shell theme-' + currentTheme}>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => nav('home')}
          aria-label="Go home"
        >
          <span className="brand-mark">
            <GraduationCap size={22} />
          </span>
          <span>
            <strong>CBE Workbook</strong>
            <small>Grade 1–3</small>
          </span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button
            className={view === 'home' ? 'active' : ''}
            onClick={() => nav('home')}
          >
            <Home size={17} /> Home
          </button>
          <button
            className={view === 'revision' ? 'active' : ''}
            onClick={() => nav('revision')}
          >
            <RotateCcw size={17} /> Revision
          </button>
          <button
            className={view === 'assessment' ? 'active' : ''}
            onClick={() => nav('assessment')}
          >
            <CheckCircle2 size={17} /> Assessments
          </button>
        </nav>
        <div className="learner-chip">
          <button onClick={() => { setActiveProfileId(''); localStorage.removeItem('cbc-active-profile'); }} title="Switch learner">
            <span className="avatar tiny">{activeProfile.avatar}</span>
            <span>{activeProfile.name}</span>
          </button>
          <button className="logout-btn" onClick={() => { setActiveProfileId(''); localStorage.removeItem('cbc-active-profile'); }} aria-label="Switch learner"><LogOut size={15} /></button>
        </div>
        <button
          className="menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Open menu"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </header>

      {mobileMenu && (
        <div className="mobile-nav">
          {[
            ['home', 'Home'],
            ['revision', 'Revision'],
            ['assessment', 'Assessments'],
            ['progress', 'Progress'],
            ['teacher', 'Adult view'],
            ['settings', 'Settings'],
          ].map(([v, label]) => (
            <button key={v} onClick={() => nav(v as View)}>
              {label}
            </button>
          ))}
        </div>
      )}

      <aside className={'app-sidebar ' + (sidebarCollapsed ? 'collapsed ' : '') + (mobileMenu ? 'mobile-open' : '')} aria-label="Workspace navigation">
        <div className="sidebar-heading"><span className="sidebar-label">WORKSPACE</span><button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}</button></div>
        <button title="Home" className={view === 'home' ? 'active' : ''} onClick={() => nav('home')}><Home size={17} /><span>Home</span></button>
        <button title="Revision" className={view === 'revision' ? 'active' : ''} onClick={() => nav('revision')}><RotateCcw size={17} /><span>Revision</span></button>
        <button title="Assessments" className={view === 'assessment' ? 'active' : ''} onClick={() => nav('assessment')}><CheckCircle2 size={17} /><span>Assessments</span></button>
        <button title="Progress" className={view === 'progress' ? 'active' : ''} onClick={() => nav('progress')}><Star size={17} /><span>Progress</span></button>
        <button title="Adult view" className={view === 'teacher' ? 'active' : ''} onClick={() => nav('teacher')}><Users size={17} /><span>Adult view</span></button>
        <span className="sidebar-divider" />
        <button title="Settings" className={view === 'settings' ? 'active' : ''} onClick={() => nav('settings')}><Settings size={17} /><span>Settings</span></button>
      </aside>

      <main>
        {view === 'home' && (
          <div className="page">
            <section className="hero">
              <div>
                <span className="eyebrow">KENYAN CBE • DIGITAL WORKBOOK</span>
                <h1>
                  Learn. Practise.
                  <br />
                  <span>Grow.</span>
                </h1>
                <p>
                  Interactive Mathematics and English practice for Grade 1,
                  Grade 2 and Grade 3 learners.
                </p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => startGrade(grade)}>
                    Continue learning <ChevronRight size={18} />
                  </button>
                  <button className="secondary" onClick={() => nav('revision')}>
                    Quick revision
                  </button>
                </div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orb orb-one">🔢</div>
                <div className="orb orb-two">📖</div>
                <div className="orb orb-three">⭐</div>
                <div className="hero-card">
                  <Brain size={30} />
                  <strong>Keep going!</strong>
                  <span>Every question helps you learn.</span>
                </div>
              </div>
            </section>

            <section className="section-head">
              <div>
                <span className="eyebrow">CHOOSE YOUR LEVEL</span>
                <h2>What are you learning today?</h2>
              </div>
              <div className="overall-pill">
                <Star size={16} /> Overall progress <strong>{overall}%</strong>
              </div>
            </section>

            <div className="grade-grid primary-grade-grid">
              {[activeProfile.grade].map(g => (
                <button
                  className={'grade-card grade-' + g}
                  key={g}
                  onClick={() => startGrade(g)}
                >
                  <div className="grade-number">0{g}</div>
                  <div className="grade-copy">
                    <span>{gradeInfo[g].label}</span>
                    <strong>{gradeInfo[g].tagline}</strong>
                    <div className="mini-progress">
                      <i
                        style={{ width: completedFor(g, 'Mathematics') + '%' }}
                      />
                    </div>
                    <small>
                      {completedFor(g, 'Mathematics')}% Mathematics •{' '}
                      {completedFor(g, 'English')}% English
                    </small>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>

            <section className="subject-strip">
              <div>
                <span className="eyebrow">TWO CORE SUBJECTS</span>
                <h2>Pick a subject and start practising</h2>
              </div>
              <div className="subject-actions">
                <button onClick={() => startSubject('Mathematics')}><span className="subject-icon math">∑</span><span><strong>Mathematics</strong><small>Count • Calculate • Solve</small></span><ChevronRight /></button>
                <button onClick={() => startSubject('English')}><span className="subject-icon english">Aa</span><span><strong>English</strong><small>Read • Write • Communicate</small></span><ChevronRight /></button>
              </div>
            </section>

            <section className="other-grades">
              <div>
                <span className="eyebrow">EXPLORE FURTHER</span>
                <h2>Other grades</h2>
                <p>Your Grade {activeProfile.grade} work stays first. Explore another level whenever you are ready.</p>
              </div>
              <div className="other-grade-actions">
                {([1, 2, 3] as Grade[]).filter(g => g !== activeProfile.grade).map(g => (
                  <button key={g} onClick={() => startGrade(g)}><span>Grade {g}</span><small>{gradeInfo[g].tagline}</small><ChevronRight size={17} /></button>
                ))}
              </div>
            </section>

          </div>
        )}

        {view === 'subject' && (
          <div className="page narrow">
            <div className="breadcrumb">
              <button onClick={() => nav('home')}>Home</button>
              <ChevronRight size={14} />
              <span>{gradeInfo[grade].label}</span>
              <ChevronRight size={14} />
              <strong>{subject}</strong>
            </div>
            <section className="subject-heading">
              <div>
                <span className="eyebrow">
                  {gradeInfo[grade].label.toUpperCase()}
                </span>
                <h1>{subject}</h1>
                <p>Pick a lesson. Learn one step at a time.</p>
              </div>
              <div className="subject-stat">
                <span>{completedFor(grade, subject)}%</span>
                <small>complete</small>
              </div>
            </section>
            <div className="lesson-layout">
              <aside className="strand-list">
                <span className="aside-label">PICK A TOPIC</span>
                {data.strands.map((strand, i) => (
                  <button
                    className={`strand ${selectedStrand === strand.name ? 'active' : ''}`}
                    key={strand.name}
                    aria-pressed={selectedStrand === strand.name}
                    onClick={() => setSelectedStrand(strand.name)}
                  >
                    <span className="strand-num">0{i + 1}</span>
                    <div>
                      <strong>{strand.name}</strong>
                      {strand.subStrands.map(s => (
                        <small key={s}>{s}</small>
                      ))}
                    </div>
                  </button>
                ))}
              </aside>
              <section className="lesson-list">
                <span className="aside-label">
                  {selectedStrand ? `${selectedStrand.toUpperCase()} LESSONS` : 'LESSONS'}
                  {' · '}{visibleLessons.length}
                </span>
                {visibleLessons.map((l, i) => {
                  const pct = progress[l.id] || 0;
                  return (
                    <button
                      className="lesson-card"
                      key={l.id}
                      onClick={() => openLesson(l)}
                    >
                      <span className="lesson-index">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="lesson-body">
                        <small>{l.subStrand}</small>
                        <strong>{l.title}</strong>
                        <span>{l.description}</span>
                        <div className="mini-progress">
                          <i style={{ width: pct + '%' }} />
                        </div>
                      </span>
                      <span className="lesson-status">
                        {pct >= 80 ? <CheckCircle2 /> : <ChevronRight />}
                      </span>
                    </button>
                  );
                })}
              </section>
            </div>
          </div>
        )}

        {view === 'lesson' && lesson && (
          <div className="page narrow">
            <div className="breadcrumb">
              <button onClick={() => setView('subject')}>{subject}</button>
              <ChevronRight size={14} />
              <strong>{lesson.title}</strong>
            </div>
            <section className="lesson-hero">
              <div>
                <span className="eyebrow">{gradeInfo[grade].label.toUpperCase()} · {subject.toUpperCase()}</span>
                <h1>{lesson.title}</h1>
                  <div className="speakable-sentence"><p>{lesson.introduction}</p>{readAloudButton(lesson.introduction)}</div>
              </div>
              <div className="lesson-badge">
                <BookOpen size={28} />
                <span>
                  Lesson {allLessons.findIndex(l => l.id === lesson.id) + 1}
                </span>
              </div>
            </section>
            <div className="voice-toolbar">
              <div className="voice-toolbar-copy">
                {voiceSettings.enabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
                <span><strong>Read aloud</strong><small>{speechAvailable ? 'Choose when to hear a sentence.' : 'Speech is not available in this browser.'}</small></span>
              </div>
              {voiceToggle}
              {voiceSettings.enabled && speechAvailable && (
                <button className="secondary voice-sample" onClick={() => speakText(`${lesson.title}. ${lesson.introduction}`)}>
                  <Play size={15} /> Hear sample
                </button>
              )}
            </div>
            <section className="lesson-teaching" aria-label="Lesson explanation and example">
              {lesson.exampleVisuals?.[0] && (
                <div className="lesson-visual-intro">
                  <span className="eyebrow">LOOK</span>
                  <LearningVisual visual={lesson.exampleVisuals[0]} grade={grade} />
                </div>
              )}
              <div className="lesson-key-idea">
                <span className="eyebrow">WHAT WE ARE LEARNING</span>
                <div className="speakable-sentence"><p>{lesson.learningObjective}</p>{readAloudButton(`What we are learning. ${lesson.learningObjective}`)}</div>
              </div>
              <div className="lesson-key-idea">
                <span className="eyebrow">LET’S UNDERSTAND</span>
                <div className="speakable-sentence"><p>{lesson.explanation}</p>{readAloudButton(`Let's understand. ${lesson.explanation}`)}</div>
              </div>
              {lesson.examples.map((example, index) => (
                <div className="lesson-example" key={`${lesson.id}-example-${index}`}>
                  <span className="eyebrow">EXAMPLE {index + 1}</span>
                  <div className="speakable-sentence"><p>{example}</p>{readAloudButton(`Example ${index + 1}. ${example}`)}</div>
                  {lesson.exampleVisuals?.[index] && index > 0 && (
                    <LearningVisual visual={lesson.exampleVisuals[index]} grade={grade} />
                  )}
                </div>
              ))}
              <div className="lesson-activity">
                <span className="eyebrow">TRY IT TOGETHER</span>
                <div className="speakable-sentence"><p>{lesson.guidedActivity}</p>{readAloudButton(`Try it together. ${lesson.guidedActivity}`)}</div>
              </div>
            </section>
            <div className="learn-panel">
              <div className="learn-title">
                <span>{taskKind === 'assessment' ? 'ASSESSMENT' : taskKind === 'revision' ? 'REVISION' : "LET'S LEARN"}</span>
                <small>
                  Question {Math.min(answerIndex + 1, lessonQuestions.length)}{' '}
                  of {lessonQuestions.length}
                </small>
              </div>
              {answerIndex < lessonQuestions.length ? (
                <>
                  <div className="question-box">
                    <CircleHelp size={20} />
                    <h2>{currentQuestion?.text}</h2>
                    {currentQuestion && readAloudButton(currentQuestion.text)}
                  </div>
                  {currentQuestion?.visual && (
                    <LearningVisual visual={currentQuestion.visual} grade={grade} />
                  )}
                  <div className="options">
                    {currentQuestion?.options.map(option => {
                      const optionVisual = currentQuestion.visualOptions?.find(item => item.option === option)?.visual;
                      return (
                        <button
                          key={option}
                          className={selected === option ? 'selected' : ''}
                          aria-label={`Choose ${option}`}
                          onClick={() => setSelected(option)}
                        >
                          {optionVisual && <LearningVisual visual={optionVisual} grade={grade} compact />}
                          {(!optionVisual || !/^\d+$/.test(option)) && <span>{option}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="lesson-controls">
                    <button
                      className="hint-btn"
                      onClick={() => alert(currentQuestion?.hint)}
                    >
                      <CircleHelp size={16} /> Need a hint?
                    </button>
                    <button
                      className="primary"
                      disabled={!selected}
                      onClick={submitAnswer}
                    >
                      {answerIndex < lessonQuestions.length - 1 ? 'Next question' : 'Submit answers'}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="completion" aria-live="polite">
                  <div className="trophy">
                    <Trophy size={34} />
                  </div>
                  <h2>Your Score</h2>
                  <p>
                    <strong>{score}/{lessonQuestions.length}</strong>
                  </p>
                  <p>
                    {score === lessonQuestions.length
                      ? `Great work! You got all ${lessonQuestions.length} questions correct.`
                      : score >= Math.ceil(lessonQuestions.length / 2)
                        ? `Good try! You got ${score} questions correct.`
                        : `Keep practising! You got ${score} questions correct.`}
                  </p>
                  {reviewOpen && (
                    <div className="answer-review">
                      <h3>Let’s check your answers</h3>
                      {lessonQuestions.filter(question => answers[question.id] !== question.answer).length === 0 ? (
                        <p>You got every question right!</p>
                      ) : lessonQuestions.filter(question => answers[question.id] !== question.answer).map(question => (
                        <article className="answer-review-item" key={question.id}>
                          <strong>Question {lessonQuestions.indexOf(question) + 1}</strong>
                          <p>{question.text}</p>
                          <p><b>Your answer:</b> {answers[question.id] ?? 'No answer'}</p>
                          <p><b>Correct answer:</b> {question.answer}</p>
                          <p><b>Why?</b> {question.explanation}</p>
                        </article>
                      ))}
                    </div>
                  )}
                  <div className="completion-actions">
                    <button
                      className="secondary"
                      onClick={() => setReviewOpen(!reviewOpen)}
                    >
                      {reviewOpen ? 'Hide My Answers' : 'Review My Answers'}
                    </button>
                    <button className="secondary" onClick={retryLesson}>
                      Try Again
                    </button>
                    {taskKind === 'assessment' ? (
                      <button className="primary" onClick={() => nav('assessment')}>
                        Back to assessments <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button className="primary" onClick={openNextLesson}>
                        {nextLesson ? 'Next lesson' : 'Back to lessons'} <ChevronRight size={18} />
                      </button>
                    )}
                    <button className="secondary" onClick={() => setView('home')}>
                      Return home <Home size={17} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'progress' && (
          <div className="page narrow">
            <section className="simple-head">
              <span className="eyebrow">MY LEARNING</span>
              <h1>Your progress</h1>
              <p>
                Small steps add up. Keep practising.
              </p>
            </section>
            <div className="profile-card">
              <div className="avatar">{activeProfile.avatar}</div>
              <div>
                <span>{activeProfile.school} • Age {activeProfile.age}</span>
                <strong>{activeProfile.name}</strong>
              </div>
              <div className="overall-big">
                <strong>{overall}%</strong>
                <small>overall</small>
              </div>
            </div>
            <div className="progress-highlights">
              <div><TreePine size={20} /><strong>{streak} day{streak === 1 ? '' : 's'}</strong><span>growth streak</span></div>
              <div><Star size={20} /><strong>{activeProfile.points}</strong><span>points earned</span></div>
              <div><Palette size={20} /><strong>{themeOptions.find(theme => theme.id === currentTheme)?.label}</strong><span>current theme</span></div>
            </div>
            <div className="growth-panel">
              <div className="growth-copy"><span className="eyebrow">YOUR DAILY BUILD</span><h2>{streak >= 7 ? `${selectedGrowth.label} is thriving!` : streak >= 3 ? `Your ${selectedGrowth.label.toLowerCase()} is taking shape.` : 'Start building from scratch.'}</h2><p>Show up each day and your activity adds the next piece. Choose what you want to build below.</p><div className="growth-choices">{growthProjects.map(project => <button key={project.id} className={selectedGrowth.id === project.id ? 'chosen' : ''} onClick={() => updateActiveProfile({ growthProject: project.id })}><span>{project.icon}</span>{project.label}</button>)}</div></div>
              <div className="growth-tree" data-stage={Math.min(3, Math.max(1, Math.ceil(streak / 2)))}><span>{selectedGrowth.stages[0]}</span><span>{selectedGrowth.stages[1]}</span><span>{selectedGrowth.stages[2]}</span></div>
            </div>
            <div className="leaderboard">
              <div className="section-label"><span className="eyebrow">LEARNER LEAGUE</span><strong>Daily builders</strong></div>
              {[...profiles].sort((a, b) => b.activityDates.length - a.activityDates.length || b.points - a.points).map((profile, index) => (
                <div className={'leader-row ' + (profile.id === activeProfile.id ? 'current' : '')} key={profile.id}><b>0{index + 1}</b><span className="avatar tiny">{profile.avatar}</span><strong>{profile.name}</strong><span>{profile.activityDates.length} day{profile.activityDates.length === 1 ? '' : 's'}</span><em>{profile.points} pts</em></div>
              ))}
            </div>
            <div className="progress-grid">
              {[activeProfile.grade].map(g => (
                <div className="progress-card" key={g}>
                  <div className="progress-card-head">
                    <strong>{gradeInfo[g].label}</strong>
                    <span>
                      {Math.round(
                        (completedFor(g, 'Mathematics') +
                          completedFor(g, 'English')) /
                          2
                      )}
                      %
                    </span>
                  </div>
                  <div className="progress-row">
                    <span>Mathematics</span>
                    <div className="track">
                      <i
                        style={{ width: completedFor(g, 'Mathematics') + '%' }}
                      />
                    </div>
                    <b>{completedFor(g, 'Mathematics')}%</b>
                  </div>
                  <div className="progress-row">
                    <span>English</span>
                    <div className="track">
                      <i style={{ width: completedFor(g, 'English') + '%' }} />
                    </div>
                    <b>{completedFor(g, 'English')}%</b>
                  </div>
                </div>
              ))}
            </div>
            {saved && (
              <div className="saved-toast" role="status">
                <CheckCircle2 size={16} />
                {syncStatus === 'syncing' ? 'Progress saved here; syncing…' : syncStatus === 'synced' ? 'Progress saved and synced' : 'Progress saved on this device'}
              </div>
            )}
          </div>
        )}

        {view === 'revision' && (
          <div className="page narrow">
            <section className="simple-head">
              <span className="eyebrow">PRACTISE WHAT YOU KNOW</span>
              <h1>Revision room</h1>
              <p>
                Choose a grade and subject. Revision uses the lessons in that
                learning area.
              </p>
            </section>
            <div className="revision-grid">
              {([1, 2, 3] as Grade[]).flatMap(g =>
                (['Mathematics', 'English'] as Subject[]).map(s => (
                  <button
                    key={g + s}
                    className="revision-card"
                    onClick={() => {
                      setGrade(g);
                      setSubject(s);
                      const l = curriculumApi.getLessons(g, s)[0];
                      openLesson(l, 'revision');
                    }}
                  >
                    <span className="revision-grade">{g}</span>
                    <div>
                      <small>{gradeInfo[g].label}</small>
                      <strong>{s}</strong>
                      <span>
                        {curriculum[g][s].lessons.length} practice lessons
                      </span>
                    </div>
                    <ChevronRight />
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'assessment' && (
          <div className="page narrow">
            <section className="simple-head">
              <span className="eyebrow">CHECK YOUR UNDERSTANDING</span>
              <h1>Assessments</h1>
              <p>
                Complete a short assessment by choosing a learning area below.
              </p>
            </section>
            <div className="assessment-grade-label"><span className="eyebrow">YOUR GRADE</span><strong>{gradeInfo[activeProfile.grade].label}</strong><small>Choose one subject at a time</small></div>
            <div className="assessment-grid">
              {(['Mathematics', 'English'] as Subject[]).map(s => (
                <div className="assessment-card" key={s}>
                  <div className="assessment-top">
                    <span>{s}</span>
                    <CheckCircle2 />
                  </div>
                  <h3>{s} practice check</h3>
                  <p>
                    A focused check using {gradeInfo[activeProfile.grade].label} {s} lessons.
                  </p>
                  <button
                    onClick={() => {
                      startAssessment(s);
                    }}
                  >
                    Start 10-question assessment <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'teacher' && (
          <div className="page narrow">
            <section className="simple-head">
              <span className="eyebrow">PARENT / TEACHER VIEW</span>
              <h1>Learning overview</h1>
              <p>
                Use this view to see which areas have been practised and where
                revision may be useful.
              </p>
            </section>
            <div className="adult-profiles">
              {profiles.map(profile => <button key={profile.id} className={adultProfile?.id === profile.id ? 'selected' : ''} onClick={() => setAdultProfileId(profile.id)}><span className="avatar">{profile.avatar}</span><span><strong>{profile.name}</strong><small>{profile.school} • Grade {profile.grade}</small></span><ChevronRight size={17} /></button>)}
            </div>
            {adultProfile && <div className="adult-banner">
              <Users size={28} />
              <div><strong>{adultProfile.name}'s details</strong><span>{adultProfile.school} • Age {adultProfile.age} • Grade {adultProfile.grade} • {adultProfile.favoriteSubject}</span></div>
              <div className="overall-big"><strong>{profileCompletedFor(adultProfile, adultProfile.grade, adultProfile.favoriteSubject)}%</strong><small>profile progress</small></div>
            </div>}
            <div className="adult-table">
              <div className="table-row table-head">
                <span>Grade</span>
                <span>Mathematics</span>
                <span>English</span>
                <span>Suggested action</span>
              </div>
              {adultProfile && <div className="table-row">
                  <strong>Grade {adultProfile.grade}</strong>
                  <span>{profileCompletedFor(adultProfile, adultProfile.grade, 'Mathematics')}%</span>
                  <span>{profileCompletedFor(adultProfile, adultProfile.grade, 'English')}%</span>
                  <span>
                    {Math.min(
                      profileCompletedFor(adultProfile, adultProfile.grade, 'Mathematics'),
                      profileCompletedFor(adultProfile, adultProfile.grade, 'English')
                    ) < 80
                      ? 'Recommended revision'
                      : 'Keep practising'}
                  </span>
                </div>}
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="page narrow">
            <section className="simple-head"><span className="eyebrow">LEARNER SETTINGS</span><h1>Settings</h1><p>Manage learner profiles, appearance, progress and adult access.</p></section>
            <div className="settings-layout">
              <section className="settings-content">
                <div className="settings-block voice-settings">
                  <div className="settings-block-heading">
                    <div><span className="eyebrow">ACCESSIBILITY</span><h2>Read aloud</h2></div>
                    {voiceSettings.enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </div>
                  <div className="voice-settings-row">
                    <p>Let the learner choose when lesson sentences are spoken.</p>
                    {voiceToggle}
                  </div>
                  {speechAvailable ? (
                    <div className="voice-settings-options">
                      <label className="voice-field">
                        <span>Voice</span>
                        <select
                          value={voiceSettings.voiceURI}
                          disabled={!voiceSettings.enabled || availableVoices.length === 0}
                          onChange={event => setVoiceSettings(current => ({ ...current, voiceURI: event.target.value }))}
                        >
                          <option value="">Device default</option>
                          {availableVoices.map(voice => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>
                          ))}
                        </select>
                        {availableVoices.length === 0 && <small>Using the device's default English voice.</small>}
                      </label>
                      <div className="voice-field">
                        <span>Reading tone</span>
                        <div className="voice-tone-options" role="group" aria-label="Reading tone">
                          {([
                            ['calm', 'Calm'],
                            ['clear', 'Clear'],
                            ['bright', 'Bright'],
                          ] as const).map(([tone, label]) => (
                            <button
                              key={tone}
                              type="button"
                              className={voiceSettings.tone === tone ? 'active' : ''}
                              disabled={!voiceSettings.enabled}
                              aria-pressed={voiceSettings.tone === tone}
                              onClick={() => setVoiceSettings(current => ({ ...current, tone }))}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <label className="voice-field">
                        <span>Voice volume <strong>{Math.round(voiceSettings.volume * 100)}%</strong></span>
                        <input
                          aria-label="Voice volume"
                          type="range"
                          min="0.2"
                          max="1"
                          step="0.1"
                          value={voiceSettings.volume}
                          disabled={!voiceSettings.enabled}
                          onChange={event => setVoiceSettings(current => ({ ...current, volume: Number(event.target.value) }))}
                        />
                      </label>
                      <button className="secondary voice-sample" disabled={!voiceSettings.enabled} onClick={() => speakText('Hello! Let us read and learn together.') }>
                        <Play size={15} /> Play voice sample
                      </button>
                    </div>
                  ) : (
                    <p className="voice-unavailable">Read aloud is not supported by this browser or device.</p>
                  )}
                </div>
                <div className="settings-block"><div className="settings-block-heading"><div><span className="eyebrow">LEARNERS</span><h2>Profile details</h2></div><span>{profiles.length}/3 profiles</span></div>
                  {profiles.map(profile => <div className="editable-profile" key={profile.id}><span className="avatar">{profile.avatar}</span><div><strong>{profile.name}</strong><small>{profile.school} • Age {profile.age} • Grade {profile.grade}</small></div><button className="secondary" onClick={() => beginEditProfile(profile)}>Edit profile</button></div>)}
                </div>
                <div className="settings-block"><div className="settings-block-heading"><div><span className="eyebrow">APPEARANCE</span><h2>Theme</h2></div><Palette size={18} /></div><div className="theme-options settings-themes">{themeOptions.map(theme => <button key={theme.id} className={currentTheme === theme.id ? 'chosen' : ''} onClick={() => updateActiveProfile({ theme: theme.id })}><i style={{ background: theme.colour }} />{theme.label}</button>)}</div></div>
                {editingProfileId && <div className="profile-form settings-edit-form"><div className="form-title"><strong>Edit learner profile</strong><button onClick={() => setEditingProfileId(null)} aria-label="Close"><X size={17} /></button></div><div className="form-grid"><label>Name<input value={newProfile.name} onChange={e => setNewProfile({ ...newProfile, name: e.target.value })} /></label><label>Age<input value={newProfile.age} onChange={e => setNewProfile({ ...newProfile, age: e.target.value })} /></label><label>School<input value={newProfile.school} onChange={e => setNewProfile({ ...newProfile, school: e.target.value })} /></label><label>Grade<select value={newProfile.grade} onChange={e => setNewProfile({ ...newProfile, grade: Number(e.target.value) as Grade })}><option value="1">Grade 1</option><option value="2">Grade 2</option><option value="3">Grade 3</option></select></label><label>Favourite subject<select value={newProfile.favoriteSubject} onChange={e => setNewProfile({ ...newProfile, favoriteSubject: e.target.value as Subject })}><option>Mathematics</option><option>English</option></select></label></div><div className="form-choice"><span>Avatar</span><div className="avatar-options">{avatarOptions.map(avatar => <button key={avatar} className={newProfile.avatar === avatar ? 'chosen' : ''} onClick={() => setNewProfile({ ...newProfile, avatar })}>{avatar}</button>)}</div></div><button className="primary form-submit" onClick={saveEditedProfile}>Save profile <CheckCircle2 size={16} /></button></div>}
              </section>
            </div>
          </div>
        )}
      </main>

      <footer>
        <span>© 2026 </span>
        <span>Grade 1–3 • Mathematics & English</span>
        <span>Learn with confidence.</span>
      </footer>
    </div>
  );
}

export default App;
