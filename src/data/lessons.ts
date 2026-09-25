import { curriculum, type Grade, type Lesson, type Subject } from './curriculum';

export type LessonDetail = Lesson & {
  learningOutcome: string;
  learningExperiences: string[];
  keyInquiryQuestions: string[];
  keyInquiryQuestion: string;
  coreCompetencies: string[];
  values: string[];
  assessmentConsiderations: string[];
  explanation: string;
  examples: string[];
  guidedActivity: string;
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
    explanation: `In this lesson, we focus on ${lesson.title.toLowerCase()}. ${lesson.description}`,
    examples: lesson.questions.map(question => question.text),
    guidedActivity: `Work with a partner to discuss: ${keyInquiryQuestion}`,
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
