import { curriculum, type Difficulty, type Grade, type Question, type Subject } from './curriculum';

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

export function getQuestionPool(grade: Grade, subject: Subject, limit = 15): GeneratedQuestion[] {
  const questions = buildQuestionBankForSubject(grade, subject);
  return questions.slice(0, limit);
}
