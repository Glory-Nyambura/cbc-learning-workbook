import { curriculum, type Grade, type Subject } from './curriculum';
import { getLessonForGradeSubject, getLessonsForGradeSubject } from './lessons';
import { buildQuestionBankForSubject } from './questionBank';

export const curriculumApi = {
  getCurriculumForGradeSubject(grade: Grade, subject: Subject) {
    return curriculum[grade][subject];
  },

  getSubjectsForGrade(grade: Grade): Subject[] {
    return Object.keys(curriculum[grade]) as Subject[];
  },

  getLessons(grade: Grade, subject: Subject) {
    return getLessonsForGradeSubject(grade, subject);
  },

  getLesson(grade: Grade, subject: Subject, lessonId: string) {
    return getLessonForGradeSubject(grade, subject, lessonId);
  },

  getQuestionsForLesson(grade: Grade, subject: Subject, lessonId: string) {
    return buildQuestionBankForSubject(grade, subject).filter(question => question.lessonId === lessonId);
  },

  getAllQuestionsForSubject(grade: Grade, subject: Subject) {
    return buildQuestionBankForSubject(grade, subject);
  },
};

export const loadCurriculumFromApi = async (grade: Grade, subject: Subject) => {
  try {
    const response = await fetch(`/api/curriculum?grade=${grade}&subject=${encodeURIComponent(subject)}`);
    if (!response.ok) throw new Error('Failed to fetch curriculum');
    const payload = await response.json();
    return payload?.data ?? curriculumApi.getCurriculumForGradeSubject(grade, subject);
  } catch {
    return curriculumApi.getCurriculumForGradeSubject(grade, subject);
  }
};
