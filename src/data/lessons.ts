import type { Grade, Lesson, Subject } from './curriculum';
import { curriculum } from './syllabusCurriculum';

export type LessonDetail = Lesson & {
  introduction: string;
  learningObjective: string;
  guidedActivity: string;
  learningOutcome: string;
  learningExperiences: string[];
  keyInquiryQuestions: string[];
  keyInquiryQuestion: string;
  coreCompetencies: string[];
  values: string[];
  assessmentConsiderations: string[];
  explanation: string;
  examples: string[];
  independentActivity: string;
  recap: string;
};

export function buildLessonDetail(grade: Grade, subject: Subject, lesson: Lesson): LessonDetail {
  const keyInquiryQuestion = lesson.keyInquiryQuestions?.[0] ?? 'What do we notice in this activity?';

  return {
    ...lesson,
    learningOutcome: lesson.learningOutcome,
    learningExperiences: lesson.learningExperiences,
    keyInquiryQuestions: lesson.keyInquiryQuestions,
    keyInquiryQuestion,
    coreCompetencies: lesson.coreCompetencies,
    values: lesson.values,
    assessmentConsiderations: lesson.assessmentConsiderations,
    explanation: lesson.keyIdea ?? lesson.learningOutcome,
    examples: lesson.examples ?? [],
    introduction: lesson.introduction ?? `Today we will learn about ${lesson.title.toLowerCase()}.`,
    learningObjective: lesson.learningObjective ?? `You will learn: ${lesson.learningOutcome}`,
    guidedActivity: lesson.guidedActivity ?? `Try the idea: ${lesson.description}`,
    independentActivity: `Use the practice questions to show your understanding and explain your thinking using ${lesson.coreCompetencies[0] ?? 'the lesson skill'}.`,
    recap: `Today we practised ${lesson.title}. The key idea was: ${lesson.learningOutcome}`,
  };
}

export function getLessonsForGradeSubject(grade: Grade, subject: Subject): LessonDetail[] {
  return curriculum[grade][subject].lessons.map(lesson => buildLessonDetail(grade, subject, lesson));
}

export function getLessonForGradeSubject(grade: Grade, subject: Subject, lessonId: string): LessonDetail | undefined {
  return getLessonsForGradeSubject(grade, subject).find(lesson => lesson.id === lessonId);
}
