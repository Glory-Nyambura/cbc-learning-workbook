import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { curriculumApi } from '../src/data/curriculumApi';
import { getLearnerCopy } from '../src/data/learnerLanguage';
import syllabusTopics from '../scripts/curriculum_topics.json';
import type { Grade, Subject } from '../src/data/curriculum';

const profile = {
  id: 'learner-test-1',
  name: 'Akinyi',
  grade: 1 as const,
  age: '7',
  school: 'Test School',
  favoriteSubject: 'Mathematics' as const,
  avatar: '🌻',
  theme: 'meadow' as const,
  growthProject: 'tree' as const,
  progress: {},
  points: 0,
  activityDates: [],
  completedTasks: [],
};

describe('workbook improvements', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('cbc-profiles', JSON.stringify([profile]));
    localStorage.setItem('cbc-active-profile', profile.id);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ progress: {} }),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('samples an assessment across different lessons in the subject', () => {
    const questions = curriculumApi.getAssessmentQuestions(1, 'Mathematics', 10);

    expect(questions).toHaveLength(10);
    expect(new Set(questions.map(question => question.lessonId)).size).toBe(10);
    expect(questions.every(question => question.grade === 1 && question.subject === 'Mathematics')).toBe(true);
  });

  it('has age-appropriate copy for every grade and subject topic', () => {
    for (const [grade, subjects] of Object.entries(syllabusTopics)) {
      for (const [subject, topics] of Object.entries(subjects)) {
        for (const topic of topics) {
          const copy = getLearnerCopy(Number(grade) as Grade, subject as Subject, topic.title);
          expect(copy).toBeDefined();
          if (subject === 'English') {
            expect(copy?.introduction, `${grade} ${topic.title}`).toBeTruthy();
            expect(copy?.objective, `${grade} ${topic.title}`).toBeTruthy();
            expect(copy?.example, `${grade} ${topic.title}`).toBeTruthy();
            expect(copy?.secondExample, `${grade} ${topic.title}`).toBeTruthy();
            expect(copy?.activity, `${grade} ${topic.title}`).toBeTruthy();
            expect(copy?.practiceQuestions, `${grade} ${topic.title}`).toHaveLength(5);
            expect(copy?.practiceQuestions?.some(question => [
              'What should you do?',
              'Which idea helps?',
              'Which strategy works?',
            ].includes(question.text))).toBe(false);
          }
        }
      }
    }
  });

  it('gives every lesson structured content and a topic-sized question bank', () => {
    for (const grade of [1, 2, 3] as const) {
      for (const subject of ['Mathematics', 'English'] as const) {
        for (const lesson of curriculumApi.getLessons(grade, subject)) {
          expect(lesson.examples.length, `${grade} ${subject}: ${lesson.title}`).toBeGreaterThanOrEqual(1);
          expect(lesson.examples.length, `${grade} ${subject}: ${lesson.title}`).toBeLessThanOrEqual(2);
          expect(lesson.exampleVisuals, `${grade} ${subject}: ${lesson.title}`).toHaveLength(lesson.examples.length);
          expect(lesson.exampleVisuals?.every(example =>
            example.groups.length > 0 && example.groups.every(visualGroup => visualGroup.items.length > 0)
          ), `${grade} ${subject}: ${lesson.title}`).toBe(true);
          expect(lesson.introduction, `${grade} ${subject}: ${lesson.title}`).toBeTruthy();
          expect(lesson.learningObjective, `${grade} ${subject}: ${lesson.title}`).toBeTruthy();
          expect(lesson.guidedActivity, `${grade} ${subject}: ${lesson.title}`).toBeTruthy();
          const bank = curriculumApi.getQuestionsForLesson(grade, subject, lesson.id);
          expect(bank, `${grade} ${subject}: ${lesson.title}`).toHaveLength(subject === 'English' ? 5 : 10);
          expect(new Set(bank.map(question => question.options.indexOf(question.answer))).size, `${grade} ${subject}: ${lesson.title}`).toBeGreaterThan(1);
          if (subject === 'Mathematics') {
            expect(new Set(bank.map(question => question.text)).size, `${grade} ${subject}: ${lesson.title}`).toBe(10);
            expect(new Set(bank.map(question => question.context)).size, `${grade} ${subject}: ${lesson.title}`).toBe(1);
            expect(bank.every(question => ![
              'What should you do?',
              'Which idea helps?',
              'Which strategy works?',
            ].includes(question.text) && !question.text.startsWith('True or false: We can practise ')), `${grade} ${subject}: ${lesson.title}`).toBe(true);
          }
          const attempt = curriculumApi.getPracticeQuestionsForAttempt(bank);
          expect(attempt).toHaveLength(Math.min(5, bank.length));
          expect(attempt.map(question => question.difficulty)).toEqual([
            'easy', 'easy', 'medium', 'medium', 'hard',
          ].slice(0, attempt.length));
          if (subject === 'English') {
            expect(new Set(bank.map(question => question.text)).size, `${grade} ${subject}: ${lesson.title}`).toBe(5);
          }
        }
      }
    }
  });

  it('asks calculation questions that match each mathematics lesson', () => {
    const addition = curriculumApi.getLessons(1, 'Mathematics').find(lesson => lesson.title === 'Adding Numbers');
    const multiplication = curriculumApi.getLessons(3, 'Mathematics').find(lesson => lesson.title === 'Multiplication Facts');
    expect(addition).toBeDefined();
    expect(multiplication).toBeDefined();

    const additionQuestions = curriculumApi.getQuestionsForLesson(1, 'Mathematics', addition!.id);
    const multiplicationQuestions = curriculumApi.getQuestionsForLesson(3, 'Mathematics', multiplication!.id);
    expect(additionQuestions.map(question => question.text)).toContain('What is 3 + 4?');
    expect(multiplicationQuestions.map(question => question.text)).toContain('What is 4 × 6?');
    expect(additionQuestions.every(question => question.context === 'Addition')).toBe(true);
    expect(multiplicationQuestions.every(question => question.context === 'Multiplication')).toBe(true);
  });

  it('shows curriculum-authored lesson explanations and examples', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));
    fireEvent.click(document.querySelector('.lesson-card')!);

    expect(screen.getByRole('heading', { name: 'Sort by Colour' })).toBeTruthy();
    expect(screen.getByText('WHAT WE ARE LEARNING')).toBeTruthy();
    expect(screen.getByText('LET’S UNDERSTAND')).toBeTruthy();
    expect(screen.getByText('EXAMPLE 1')).toBeTruthy();
    expect(screen.getByText('TRY IT TOGETHER')).toBeTruthy();
    expect(screen.getByText('Put 3 red bottle tops in one group. Put 2 blue tops in another group.')).toBeTruthy();
    expect(screen.getAllByText('Red group')).toHaveLength(2);
    expect(screen.getAllByText('Blue group')).toHaveLength(1);
    expect(screen.getByText('red ball')).toBeTruthy();
    expect(screen.getByText('red cup')).toBeTruthy();
    expect(screen.queryByText(/Problem SolvingKey inquiry/i)).toBeNull();
  });

  it('keeps read-aloud optional and speaks a selected sentence with the chosen voice and tone', () => {
    const speak = vi.fn();
    const voice = { voiceURI: 'friendly-en-gb', name: 'Friendly English', lang: 'en-GB' } as SpeechSynthesisVoice;
    class MockUtterance {
      voice: SpeechSynthesisVoice | null = null;
      lang = '';
      rate = 1;
      pitch = 1;
      volume = 1;
      constructor(readonly text: string) {}
    }
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
    vi.stubGlobal('speechSynthesis', {
      getVoices: () => [voice],
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      cancel: vi.fn(),
      speak,
    });

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));
    fireEvent.click(document.querySelector('.lesson-card')!);
    const toggle = screen.getByRole('checkbox');

    expect(toggle.checked).toBe(false);
    expect(screen.queryByRole('button', { name: /read sentence aloud/i })).toBeNull();

    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /read sentence aloud: today we will learn to put things with the same colour together/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Read sentence aloud: Example 2. A red ball and a red cup can go in the red group.' }));
    expect((speak.mock.calls[0][0] as MockUtterance).text).toBe('Example 2. A red ball and a red cup can go in the red group.');
    fireEvent.click(screen.getByTitle('Settings'));
    fireEvent.change(screen.getByLabelText('Voice'), { target: { value: voice.voiceURI } });
    fireEvent.click(screen.getByRole('button', { name: 'Bright' }));
    fireEvent.click(screen.getByRole('button', { name: /play voice sample/i }));

    const utterance = speak.mock.calls[speak.mock.calls.length - 1][0] as MockUtterance;
    expect(utterance.text).toBe('Hello! Let us read and learn together.');
    expect(utterance.voice).toBe(voice);
    expect(utterance.pitch).toBe(1.12);
    expect(utterance.rate).toBe(0.94);
    expect(utterance.volume).toBe(1);
  });

  it('uses concept-matched visuals for length, solid shapes, and English grammar', () => {
    const lengthLesson = curriculumApi.getLessons(1, 'Mathematics').find(lesson => lesson.title === 'Measuring Length');
    const solidShapesLesson = curriculumApi.getLessons(3, 'Mathematics').find(lesson => lesson.title === 'Solid Shapes');
    const pronounsLesson = curriculumApi.getLessons(1, 'English').find(lesson => lesson.title === 'Words for People and Things');
    const placeValueLesson = curriculumApi.getLessons(2, 'Mathematics').find(lesson => lesson.title === 'Hundreds and Number Patterns');
    const articlesLesson = curriculumApi.getLessons(2, 'English').find(lesson => lesson.title === 'Using A and An');
    const presentTenseLesson = curriculumApi.getLessons(2, 'English').find(lesson => lesson.title === 'Actions Happening Now');

    expect(lengthLesson?.exampleVisuals?.[0].groups[0].items.map(item => item.length)).toEqual(['short', 'long']);
    expect(solidShapesLesson?.exampleVisuals?.[0].groups[0].label).toBe('Solid shapes');
    expect(pronounsLesson?.exampleVisuals?.[0].groups[0].label).toBe('Say the name once');
    expect(placeValueLesson?.exampleVisuals?.[0].groups[0].label).toBe('Hundreds, tens, ones');
    expect(articlesLesson?.exampleVisuals?.[0].groups[0].label).toBe('Choose a or an');
    expect(presentTenseLesson?.exampleVisuals?.[0].groups[0].label).toBe('Happening now');
  });

  it('opens a 10-question assessment and syncs under the active profile', async () => {
    render(<App />);
    fireEvent.click(screen.getByTitle('Assessments'));
    fireEvent.click(document.querySelector('.assessment-card button')!);

    expect(screen.getByText('Question 1 of 5')).toBeTruthy();
    for (let questionIndex = 0; questionIndex < 4; questionIndex += 1) {
      const questionText = screen.getByRole('heading', { level: 2 }).textContent;
      const question = curriculumApi.getAllQuestionsForSubject(1, 'Mathematics').find(item => item.text === questionText);
      const correctOption = [...document.querySelectorAll('.options button')].find(option => option.textContent === question?.answer);
      fireEvent.click(correctOption!);
      fireEvent.click(screen.getByRole('button', { name: /next question/i }));
      expect(screen.queryByRole('heading', { name: 'Your Score' })).toBeNull();
      expect(vi.mocked(fetch).mock.calls.some(([, init]) => init?.method === 'POST')).toBe(false);
    }
    const finalQuestionText = screen.getByRole('heading', { level: 2 }).textContent;
    const finalQuestion = curriculumApi.getAllQuestionsForSubject(1, 'Mathematics').find(item => item.text === finalQuestionText);
    const finalCorrectOption = [...document.querySelectorAll('.options button')].find(option => option.textContent === finalQuestion?.answer);
    fireEvent.click(finalCorrectOption!);
    fireEvent.click(screen.getByRole('button', { name: /submit answers/i }));
    expect(screen.getByRole('heading', { name: 'Your Score' })).toBeTruthy();
    expect(screen.getByText('5/5')).toBeTruthy();

    await waitFor(() => {
      const calls = vi.mocked(fetch).mock.calls;
      const postCall = calls.find(([, init]) => init?.method === 'POST');
      expect(postCall).toBeTruthy();
      expect(JSON.parse(String(postCall?.[1]?.body)).profileId).toBe(profile.id);
    });
  });

  it('shows corrections after the score and retries with a fresh five-question set', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));
    fireEvent.click(document.querySelector('.lesson-card')!);
    const firstAttempt: string[] = [];

    for (let questionIndex = 0; questionIndex < 5; questionIndex += 1) {
      const questionText = screen.getByRole('heading', { level: 2 }).textContent || '';
      firstAttempt.push(questionText);
      const question = curriculumApi.getQuestionsForLesson(1, 'Mathematics', 'g1m-sorting-by-colour').find(item => item.text === questionText);
      const options = document.querySelectorAll('.options button');
      const wrongOption = [...options].find(option => option.textContent !== question?.answer);
      fireEvent.click(wrongOption!);
      fireEvent.click(screen.getByRole('button', {
        name: questionIndex < 4 ? /next question/i : /submit answers/i,
      }));
    }

    expect(screen.getByText('0/5')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Review My Answers' }));
    expect(screen.getAllByText(/Your answer:/)).toHaveLength(5);
    expect(screen.getAllByText(/Correct answer:/)).toHaveLength(5);
    expect(screen.getAllByText(/Why\?/)).toHaveLength(5);

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('Question 1 of 5')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Your Score' })).toBeNull();
    expect(firstAttempt).not.toContain(screen.getByRole('heading', { level: 2 }).textContent);
    expect(screen.queryByText(/Your answer:/)).toBeNull();
  });

  it('makes Progress and Adult View reachable from the workspace navigation', () => {
    render(<App />);
    fireEvent.click(screen.getByTitle('Progress'));
    expect(screen.getByRole('heading', { name: 'Your progress' })).toBeTruthy();

    fireEvent.click(screen.getByTitle('Adult view'));
    expect(screen.getByRole('heading', { name: 'Learning overview' })).toBeTruthy();
  });
});