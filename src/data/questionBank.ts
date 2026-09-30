import { type Difficulty, type Grade, type Question, type Subject } from './curriculum';
import { curriculum } from './syllabusCurriculum';

export type GeneratedQuestion = Question & {
  lessonId: string;
  grade: Grade;
  subject: Subject;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  difficulty: Difficulty;
  context: string;
};

export function buildQuestionBankForSubject(grade: Grade, subject: Subject): GeneratedQuestion[] {
  return curriculum[grade][subject].lessons.flatMap(lesson =>
    lesson.questions.map((question, index) => ({
      ...question,
      lessonId: lesson.id,
      grade,
      subject,
      type: question.type ?? 'multiple-choice',
      difficulty: question.difficulty ?? (index === 0 ? 'easy' : 'medium'),
      context: question.context ?? lesson.subStrand,
      id: `${lesson.id}-${question.id}`,
    }))
  );
}

export function getQuestionsForLesson(grade: Grade, subject: Subject, lessonId: string): GeneratedQuestion[] {
  return buildQuestionBankForSubject(grade, subject).filter(question => question.lessonId === lessonId);
}

const shuffle = <T,>(items: T[]): T[] => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

export function getPracticeQuestionsForAttempt(
  questions: GeneratedQuestion[],
  previousQuestionIds: string[] = [],
  limit = 5
): GeneratedQuestion[] {
  const sampleSize = Math.min(limit, questions.length);
  if (sampleSize === 0) return [];

  const previous = new Set(previousQuestionIds);
  const picked: GeneratedQuestion[] = [];
  const targets: [Difficulty, number][] = [['easy', 2], ['medium', 2], ['hard', 1]];

  for (const [difficulty, count] of targets) {
    const available = shuffle(questions.filter(question =>
      question.difficulty === difficulty && !previous.has(question.id) && !picked.includes(question)
    ));
    picked.push(...available.slice(0, count));
  }

  if (picked.length < sampleSize) {
    const unused = shuffle(questions.filter(question => !picked.includes(question) && !previous.has(question.id)));
    picked.push(...unused.slice(0, sampleSize - picked.length));
  }

  if (picked.length < sampleSize) {
    const unused = shuffle(questions.filter(question => !picked.includes(question)));
    picked.push(...unused.slice(0, sampleSize - picked.length));
  }

  const difficultyOrder: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };
  return picked
    .slice(0, sampleSize)
    .sort((first, second) => difficultyOrder[first.difficulty] - difficultyOrder[second.difficulty]);
}

export function getQuestionPool(grade: Grade, subject: Subject, limit = 15): GeneratedQuestion[] {
  const questions = buildQuestionBankForSubject(grade, subject);
  return questions.slice(0, limit);
}

export function getAssessmentQuestions(grade: Grade, subject: Subject, limit = 10): GeneratedQuestion[] {
  const questions = buildQuestionBankForSubject(grade, subject);
  const sampleSize = Math.min(Math.max(0, limit), questions.length);

  for (let index = questions.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
  }

  const seenLessons = new Set<string>();
  const lessonSamples = questions.filter(question => {
    if (seenLessons.has(question.lessonId)) return false;
    seenLessons.add(question.lessonId);
    return true;
  });
  const sampledIds = new Set(lessonSamples.map(question => question.id));
  const remainingQuestions = questions.filter(question => !sampledIds.has(question.id));

  return [...lessonSamples, ...remainingQuestions].slice(0, sampleSize);
}
