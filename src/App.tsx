import { useEffect, useMemo, useState } from 'react';
import { api } from './lib/api';
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
  X,
} from 'lucide-react';

type Subject = 'Mathematics' | 'English';
type Grade = 1 | 2 | 3;
type View =
  | 'home'
  | 'subject'
  | 'lesson'
  | 'progress'
  | 'revision'
  | 'assessment'
  | 'teacher'
  | 'settings';

type Question = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
};

type Lesson = {
  id: string;
  title: string;
  subStrand: string;
  description: string;
  competency: string;
  questions: Question[];
};

type SubjectData = {
  strands: { name: string; subStrands: string[] }[];
  lessons: Lesson[];
};

type Theme = 'meadow' | 'ocean' | 'sunset' | 'berry' | 'sky';
type GrowthProject = 'tree' | 'house' | 'painting';

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

const curriculum: Record<Grade, Record<Subject, SubjectData>> = {
  1: {
    Mathematics: {
      strands: [
        {
          name: 'Numbers',
          subStrands: [
            'Counting and number recognition',
            'Addition and subtraction',
          ],
        },
        { name: 'Measurement', subStrands: ['Length and time'] },
        { name: 'Geometry', subStrands: ['Shapes and position'] },
      ],
      lessons: [
        {
          id: 'g1m1',
          title: 'Counting Objects',
          subStrand: 'Counting and number recognition',
          description:
            'Count groups of familiar objects and connect quantities to numerals.',
          competency: 'Critical Thinking',
          questions: [
            {
              id: 'q1',
              text: 'How many stars are there? ★ ★ ★ ★ ★',
              options: ['4', '5', '6'],
              answer: '5',
              explanation: 'There are five stars.',
              hint: 'Count each star once.',
            },
            {
              id: 'q2',
              text: 'Which number comes after 7?',
              options: ['6', '8', '9'],
              answer: '8',
              explanation: 'After 7 comes 8.',
              hint: 'Say the numbers from 6 to 9.',
            },
            {
              id: 'q3',
              text: 'Which group has more? 🍊🍊🍊 or 🍊🍊',
              options: ['First group', 'Second group', 'They are equal'],
              answer: 'First group',
              explanation: 'Three oranges are more than two.',
              hint: 'Count both groups.',
            },
          ],
        },
        {
          id: 'g1m2',
          title: 'Adding Small Numbers',
          subStrand: 'Addition and subtraction',
          description:
            'Use pictures and number sentences to add small quantities.',
          competency: 'Problem Solving',
          questions: [
            {
              id: 'q4',
              text: '3 + 2 = ?',
              options: ['4', '5', '6'],
              answer: '5',
              explanation: 'Three plus two equals five.',
              hint: 'Start at 3 and count two more.',
            },
            {
              id: 'q5',
              text: 'Akinyi has 4 pencils and gets 1 more. How many pencils does she have?',
              options: ['3', '5', '6'],
              answer: '5',
              explanation: '4 + 1 = 5.',
              hint: 'Add one to four.',
            },
          ],
        },
      ],
    },
    English: {
      strands: [
        {
          name: 'Listening and Speaking',
          subStrands: ['Greetings and conversations'],
        },
        {
          name: 'Reading',
          subStrands: ['Phonics and simple words', 'Comprehension'],
        },
        { name: 'Writing', subStrands: ['Handwriting and sentences'] },
      ],
      lessons: [
        {
          id: 'g1e1',
          title: 'Letter Sounds',
          subStrand: 'Phonics and simple words',
          description:
            'Recognise common letter sounds and connect them to simple words.',
          competency: 'Communication',
          questions: [
            {
              id: 'q6',
              text: 'Which word begins with the /m/ sound?',
              options: ['mat', 'sun', 'top'],
              answer: 'mat',
              explanation: 'Mat begins with the /m/ sound.',
              hint: 'Say each word slowly.',
            },
            {
              id: 'q7',
              text: 'Which letter begins the word “cat”?',
              options: ['c', 't', 'a'],
              answer: 'c',
              explanation: 'Cat starts with c.',
              hint: 'Look at the first sound in cat.',
            },
          ],
        },
        {
          id: 'g1e2',
          title: 'Reading a Short Story',
          subStrand: 'Comprehension',
          description: 'Read a short passage and answer questions about it.',
          competency: 'Critical Thinking',
          questions: [
            {
              id: 'q8',
              text: 'Amina has a red ball. What colour is the ball?',
              options: ['Blue', 'Red', 'Green'],
              answer: 'Red',
              explanation: 'The story says Amina has a red ball.',
              hint: 'Find the colour word.',
            },
            {
              id: 'q9',
              text: 'Choose the correct sentence.',
              options: ['The boy run.', 'The boy runs.', 'The boy running.'],
              answer: 'The boy runs.',
              explanation: '“The boy runs” is the complete sentence.',
              hint: 'Look for a sentence that sounds complete.',
            },
          ],
        },
      ],
    },
  },
  2: {
    Mathematics: {
      strands: [
        {
          name: 'Numbers',
          subStrands: ['Place value', 'Multiplication and division'],
        },
        { name: 'Measurement', subStrands: ['Money and time'] },
        { name: 'Geometry and Data', subStrands: ['Shapes and simple data'] },
      ],
      lessons: [
        {
          id: 'g2m1',
          title: 'Place Value',
          subStrand: 'Place value',
          description: 'Understand tens and ones in two-digit numbers.',
          competency: 'Critical Thinking',
          questions: [
            {
              id: 'q10',
              text: 'In 47, what is the value of 4?',
              options: ['4', '40', '7'],
              answer: '40',
              explanation: 'The 4 is in the tens place, so its value is 40.',
              hint: 'The first digit in a two-digit number shows tens.',
            },
            {
              id: 'q11',
              text: 'Which number has 6 tens and 3 ones?',
              options: ['36', '63', '69'],
              answer: '63',
              explanation: '6 tens = 60 and 3 ones = 3, making 63.',
              hint: 'Build the number from tens and ones.',
            },
          ],
        },
        {
          id: 'g2m2',
          title: 'Multiplication as Groups',
          subStrand: 'Multiplication and division',
          description: 'Use equal groups to understand multiplication.',
          competency: 'Problem Solving',
          questions: [
            {
              id: 'q12',
              text: 'There are 3 bags with 2 oranges each. How many oranges are there?',
              options: ['5', '6', '8'],
              answer: '6',
              explanation: '3 groups of 2 make 6.',
              hint: 'Think 2 + 2 + 2.',
            },
          ],
        },
      ],
    },
    English: {
      strands: [
        {
          name: 'Reading',
          subStrands: ['Fluency and comprehension', 'Vocabulary'],
        },
        { name: 'Grammar', subStrands: ['Nouns and verbs', 'Tenses'] },
        { name: 'Writing', subStrands: ['Sentences and short paragraphs'] },
      ],
      lessons: [
        {
          id: 'g2e1',
          title: 'Nouns and Verbs',
          subStrand: 'Nouns and verbs',
          description:
            'Identify naming words and action words in simple sentences.',
          competency: 'Communication',
          questions: [
            {
              id: 'q13',
              text: 'Which word is a verb in “The girl sings.”?',
              options: ['girl', 'the', 'sings'],
              answer: 'sings',
              explanation: 'Sings tells us what the girl does.',
              hint: 'Look for the action word.',
            },
            {
              id: 'q14',
              text: 'Which word is a noun?',
              options: ['jump', 'teacher', 'quickly'],
              answer: 'teacher',
              explanation: 'Teacher names a person.',
              hint: 'A noun can name a person, place, animal or thing.',
            },
          ],
        },
        {
          id: 'g2e2',
          title: 'Short Paragraphs',
          subStrand: 'Sentences and short paragraphs',
          description:
            'Read and build connected sentences about familiar experiences.',
          competency: 'Creativity',
          questions: [
            {
              id: 'q15',
              text: 'Which sentence starts with a capital letter?',
              options: ['we went home.', 'We went home.', 'we Went home.'],
              answer: 'We went home.',
              explanation: 'A sentence starts with a capital letter.',
              hint: 'Check the first letter.',
            },
          ],
        },
      ],
    },
  },
  3: {
    Mathematics: {
      strands: [
        {
          name: 'Numbers',
          subStrands: ['Place value and operations', 'Fractions'],
        },
        { name: 'Measurement', subStrands: ['Length, mass, time and money'] },
        {
          name: 'Geometry and Data',
          subStrands: ['Shapes, patterns and data'],
        },
      ],
      lessons: [
        {
          id: 'g3m1',
          title: 'Multiplication Facts',
          subStrand: 'Place value and operations',
          description: 'Use multiplication facts to solve everyday problems.',
          competency: 'Problem Solving',
          questions: [
            {
              id: 'q16',
              text: '6 × 4 = ?',
              options: ['20', '24', '28'],
              answer: '24',
              explanation: 'Six groups of four make 24.',
              hint: 'Think of 4 added six times.',
            },
            {
              id: 'q17',
              text: 'A class has 5 rows of 7 chairs. How many chairs are there?',
              options: ['30', '35', '40'],
              answer: '35',
              explanation: '5 × 7 = 35.',
              hint: 'Multiply the number of rows by chairs in each row.',
            },
          ],
        },
        {
          id: 'g3m2',
          title: 'Fractions of a Whole',
          subStrand: 'Fractions',
          description:
            'Recognise and compare simple fractions using visual models.',
          competency: 'Critical Thinking',
          questions: [
            {
              id: 'q18',
              text: 'Which fraction means one part out of four equal parts?',
              options: ['1/2', '1/3', '1/4'],
              answer: '1/4',
              explanation: 'One out of four equal parts is one-quarter.',
              hint: 'Look at the denominator.',
            },
          ],
        },
      ],
    },
    English: {
      strands: [
        { name: 'Reading', subStrands: ['Comprehension and vocabulary'] },
        { name: 'Grammar', subStrands: ['Sentence structure and tenses'] },
        { name: 'Writing', subStrands: ['Paragraphs and creative writing'] },
      ],
      lessons: [
        {
          id: 'g3e1',
          title: 'Reading for Meaning',
          subStrand: 'Comprehension and vocabulary',
          description:
            'Read a short passage and use evidence from it to answer questions.',
          competency: 'Critical Thinking',
          questions: [
            {
              id: 'q19',
              text: 'If a story says “Kamau carried an umbrella because dark clouds appeared,” why did he carry it?',
              options: [
                'He wanted shade.',
                'He expected rain.',
                'He was going swimming.',
              ],
              answer: 'He expected rain.',
              explanation: 'Dark clouds suggested that rain might come.',
              hint: 'Connect the dark clouds with what an umbrella is used for.',
            },
            {
              id: 'q20',
              text: 'Choose the best word: “The children ___ football yesterday.”',
              options: ['play', 'played', 'playing'],
              answer: 'played',
              explanation: '“Yesterday” signals past tense.',
              hint: 'Look at the time word.',
            },
          ],
        },
        {
          id: 'g3e2',
          title: 'Building a Paragraph',
          subStrand: 'Paragraphs and creative writing',
          description:
            'Choose clear sentences that can form a short paragraph.',
          competency: 'Creativity',
          questions: [
            {
              id: 'q21',
              text: 'Which sentence is a good opening for a paragraph about school?',
              options: [
                'My school is a happy place to learn.',
                'Because.',
                'And then.',
              ],
              answer: 'My school is a happy place to learn.',
              explanation: 'It introduces the topic clearly.',
              hint: 'Choose a complete sentence that introduces school.',
            },
          ],
        },
      ],
    },
  },
};

const gradeInfo: Record<
  Grade,
  { label: string; colour: string; tagline: string }
> = {
  1: {
    label: 'Grade 1',
    colour: 'sun',
    tagline: 'Discover, practise and build strong foundations.',
  },
  2: {
    label: 'Grade 2',
    colour: 'leaf',
    tagline: 'Grow your skills and solve new challenges.',
  },
  3: {
    label: 'Grade 3',
    colour: 'sky',
    tagline: 'Think deeper, read confidently and solve problems.',
  },
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
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [taskKind, setTaskKind] = useState<'lesson' | 'assessment' | 'revision'>('lesson');
  const [adultProfileId, setAdultProfileId] = useState('');
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const activeProfile = profiles.find(profile => profile.id === activeProfileId);
  const today = new Date().toISOString().slice(0, 10);
  const currentTheme = activeProfile?.theme || 'meadow';
  const selectedGrowth = growthProjects.find(project => project.id === (activeProfile?.growthProject || 'tree')) || growthProjects[0];

  const data = curriculum[grade][subject];
  const allLessons = useMemo(() => data.lessons, [data.lessons]);
  const currentQuestion = lesson?.questions[answerIndex];

  useEffect(() => {
    if (activeProfile) {
      setProgress(activeProfile.progress);
      setGrade(activeProfile.grade);
      setSubject(activeProfile.favoriteSubject);
    }
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
      await api.post('/api/progress', { progress: next });
    } catch {}
  };

  const completeTask = (kind: 'lesson' | 'assessment' | 'revision') => {
    if (!activeProfile || !lesson) return;
    const taskId = `${kind}:${lesson.id}`;
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
    nextLesson: Lesson,
    kind: 'lesson' | 'assessment' | 'revision' = 'lesson'
  ) => {
    setLesson(nextLesson);
    setTaskKind(kind);
    setAnswerIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setView('lesson');
  };

  const submitAnswer = () => {
    if (!currentQuestion || !selected || answered) return;
    const correct = selected === currentQuestion.answer;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setAnswered(true);
    if (lesson) saveProgress(lesson.id, nextScore, lesson.questions.length);
  };

  const nextQuestion = () => {
    if (!lesson) return;
    if (answerIndex < lesson.questions.length - 1) {
      setAnswerIndex(answerIndex + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setAnswerIndex(lesson.questions.length);
      setSelected(null);
      setAnswered(false);
      completeTask(taskKind);
    }
  };

  const startGrade = (g: Grade) => {
    setGrade(g);
    setView('subject');
  };

  const startSubject = (s: Subject) => {
    setSubject(s);
    setView('subject');
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
          <span className="eyebrow">CBC WORKBOOK</span>
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
            <strong>CBC Workbook</strong>
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
        <span className="sidebar-divider" />
        <button title="Settings" className={view === 'settings' ? 'active' : ''} onClick={() => nav('settings')}><Settings size={17} /><span>Settings</span></button>
      </aside>

      <main>
        {view === 'home' && (
          <div className="page">
            <section className="hero">
              <div>
                <span className="eyebrow">KENYAN CBC • DIGITAL WORKBOOK</span>
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
                <p>Choose a lesson and learn at your own pace.</p>
              </div>
              <div className="subject-stat">
                <span>{completedFor(grade, subject)}%</span>
                <small>complete</small>
              </div>
            </section>
            <div className="lesson-layout">
              <aside className="strand-list">
                <span className="aside-label">CURRICULUM MAP</span>
                {data.strands.map((strand, i) => (
                  <button className="strand" key={strand.name} onClick={() => openLesson(data.lessons.find(item => item.subStrand === strand.subStrands[0]) || data.lessons[0])}>
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
                <span className="aside-label">LESSONS</span>
                {allLessons.map((l, i) => {
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
                <span className="eyebrow">
                  {lesson.subStrand.toUpperCase()}
                </span>
                <h1>{lesson.title}</h1>
                <p>{lesson.description}</p>
                <span className="competency">
                  <Brain size={14} /> {lesson.competency}
                </span>
              </div>
              <div className="lesson-badge">
                <BookOpen size={28} />
                <span>
                  Lesson {allLessons.findIndex(l => l.id === lesson.id) + 1}
                </span>
              </div>
            </section>
            <div className="learn-panel">
              <div className="learn-title">
                <span>LET'S LEARN</span>
                <small>
                  Question {Math.min(answerIndex + 1, lesson.questions.length)}{' '}
                  of {lesson.questions.length}
                </small>
              </div>
              {answerIndex < lesson.questions.length ? (
                <>
                  <div className="question-box">
                    <CircleHelp size={20} />
                    <h2>{currentQuestion?.text}</h2>
                  </div>
                  <div className="options">
                    {currentQuestion?.options.map(option => (
                      <button
                        key={option}
                        className={selected === option ? 'selected' : ''}
                        disabled={answered}
                        onClick={() => setSelected(option)}
                      >
                        {option}
                        <span>
                          {selected === option && answered
                            ? option === currentQuestion.answer
                              ? '✓'
                              : '×'
                            : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                  {answered && (
                    <div
                      className={
                        'feedback ' +
                        (selected === currentQuestion?.answer
                          ? 'correct'
                          : 'try')
                      }
                    >
                      <strong>
                        {selected === currentQuestion?.answer
                          ? '🎉 Correct!'
                          : 'Not quite yet.'}
                      </strong>
                      <span>
                        {selected === currentQuestion?.answer
                          ? currentQuestion.explanation
                          : currentQuestion.hint}
                      </span>
                    </div>
                  )}
                  <div className="lesson-controls">
                    <button
                      className="hint-btn"
                      onClick={() => alert(currentQuestion?.hint)}
                    >
                      <CircleHelp size={16} /> Need a hint?
                    </button>
                    {!answered ? (
                      <button
                        className="primary"
                        disabled={!selected}
                        onClick={submitAnswer}
                      >
                        Check answer
                      </button>
                    ) : (
                      <button className="primary" onClick={nextQuestion}>
                        {answerIndex < lesson.questions.length - 1
                          ? 'Next question'
                          : 'Finish lesson'}{' '}
                        <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="completion">
                  <div className="trophy">
                    <Trophy size={34} />
                  </div>
                  <h2>Lesson complete!</h2>
                  <p>
                    You scored{' '}
                    <strong>
                      {score}/{lesson.questions.length}
                    </strong>
                    . Keep practising to improve your mastery.
                  </p>
                  <div className="completion-actions">
                    <button
                      className="secondary"
                      onClick={() => openLesson(lesson, taskKind)}
                    >
                      Try again
                    </button>
                    <button
                      className="primary"
                      onClick={openNextLesson}
                    >
                      {nextLesson ? 'Next lesson' : 'Back to lessons'} <ChevronRight size={18} />
                    </button>
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
              <div className="saved-toast">
                <CheckCircle2 size={16} /> Progress saved
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
                      const l = curriculum[g][s].lessons[0];
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
                  <h3>{s} assessment</h3>
                  <p>
                    A focused check using {gradeInfo[activeProfile.grade].label} {s} lessons.
                  </p>
                  <button
                    onClick={() => {
                      setGrade(activeProfile.grade);
                      setSubject(s);
                      openLesson(curriculum[activeProfile.grade][s].lessons[0], 'assessment');
                    }}
                  >
                    Start {s} assessment <ChevronRight size={16} />
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
        <span>© 2026 CBC Workbook</span>
        <span>Grade 1–3 • Mathematics & English</span>
        <span>Learn with confidence.</span>
      </footer>
    </div>
  );
}

export default App;
