import syllabusTopics from '../../scripts/curriculum_topics.json';
import type { Grade, Lesson, Subject, SubjectData } from './curriculum';
import { getLearnerCopy } from './learnerLanguage';
import { getLessonExampleVisuals } from './lessonVisuals';
import { getMathPracticeQuestions } from './mathPracticeQuestions';

const subjects: Subject[] = ['Mathematics', 'English'];
const grades: Grade[] = [1, 2, 3];

const createLesson = (
  grade: Grade,
  subject: Subject,
  topic: (typeof syllabusTopics)[keyof typeof syllabusTopics][keyof (typeof syllabusTopics)[1]][number],
  index: number
): Lesson => {
  const strand = topic.strand.replace(/^\d+\.\d+\s+/, '');
  const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const copy = getLearnerCopy(grade, subject, topic.title);
  const title = copy?.title ?? topic.title;
  const idea = copy?.idea ?? topic.key_idea;
  const example = copy?.example ?? topic.example;
  const secondExample = copy?.secondExample ?? `Now try the same idea with a different ${subject === 'Mathematics' ? 'number or object' : 'word or sentence'}.`;
  const examples = copy?.secondExample ? [example, secondExample] : [example];
  const activity = copy?.activity ?? (subject === 'Mathematics'
    ? 'Try the idea with something near you.'
    : 'Say or write your own example.');
  const practiceExample = subject === 'Mathematics'
    ? 'Try the idea with something new near you.'
    : 'Say or write your own example.';
  const answer = copy?.answer ?? idea;
  const options = copy?.options ?? [
    idea,
    grade === 1 ? 'Guess without counting.' : 'Guess without checking.',
    grade === 1 ? 'Skip the example.' : 'Skip a step.',
  ];

  return {
  id: `g${grade}${subject === 'Mathematics' ? 'm' : 'e'}-${slug}`,
  title,
  strand,
  subStrand: strand,
  description: idea,
  competency: subject === 'Mathematics' ? 'Problem Solving' : 'Communication',
  introduction: copy?.introduction ?? `Today we will learn about ${title.toLowerCase()}.`,
  learningObjective: copy?.objective ?? `You will learn: ${idea}`,
  guidedActivity: activity,
  learningOutcome: idea,
  learningExperiences: [activity],
  keyInquiryQuestions: ['What do you notice?'],
  coreCompetencies: ['Communication', 'Critical thinking', 'Problem solving'],
  values: ['Curiosity', 'Persistence', 'Co-operation'],
  assessmentConsiderations: [
    `Check whether the learner can explain: ${topic.key_idea}`,
    `Ask the learner to apply the idea to: ${topic.example}`,
  ],
  keyIdea: idea,
  examples,
  exampleVisuals: getLessonExampleVisuals(grade, subject, topic.title, examples.length),
  questions: subject === 'Mathematics'
    ? getMathPracticeQuestions(grade, topic.title)
    : copy?.practiceQuestions ?? [
    {
      id: 'q1',
      text: copy?.question ?? (grade === 1
        ? 'What should you do?'
        : grade === 2
          ? 'Which idea helps?'
          : 'Which strategy works?'),
      options,
      answer,
      explanation: copy?.answerExplanation ?? idea,
      hint: 'Look at the example for help.',
      type: 'multiple-choice',
      difficulty: 'easy',
      context: topic.title,
    },
    {
      id: 'q2',
      text: `True or false: We can practise ${title.toLowerCase()} with things around us.`,
      options: ['True', 'False'],
      answer: 'True',
      explanation: `True! ${activity}`,
      hint: 'Think about the example you just tried.',
      type: 'true-false',
      difficulty: 'easy',
      context: topic.title,
    },
    {
      id: 'q3',
      text: `Which choice shows ${title.toLowerCase()}?`,
      options: [idea, 'Do not try the example.', 'Choose without looking.'],
      answer: idea,
      explanation: idea,
      hint: 'Try the idea with something new.',
      type: 'multiple-choice',
      difficulty: 'medium',
      context: topic.title,
    },
    {
      id: 'q4',
      text: 'True or false: Trying an example can help you learn.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'True! Trying an example helps you practise the idea.',
      hint: 'Think about what you did in the example.',
      type: 'true-false',
      difficulty: 'medium',
      context: topic.title,
    },
    {
      id: 'q5',
      text: 'Which example shows the idea?',
      options: [example, 'Pick things at random.', 'Skip the activity.'],
      answer: example,
      explanation: 'Yes! This example shows the idea we are learning.',
      hint: 'Look at Example 1.',
      type: 'multiple-choice',
      difficulty: 'hard',
      context: topic.title,
    },
    {
      id: 'q6',
      text: 'What can you do next?',
      options: [activity, 'Stop trying.', 'Guess without looking.'],
      answer: activity,
      explanation: 'Good choice. Practising helps you learn.',
      hint: 'Think of a way to try the idea yourself.',
      type: 'multiple-choice',
      difficulty: 'medium',
      context: topic.title,
    },
    {
      id: 'q7',
      text: `Your friend is learning about ${title.toLowerCase()}. How can you help?`,
      options: ['Show an example and explain the idea.', 'Tell your friend to guess.', 'Hide the things they need.'],
      answer: 'Show an example and explain the idea.',
      explanation: 'An example can help your friend understand the idea.',
      hint: 'Think about what helped you learn.',
      type: 'multiple-choice',
      difficulty: 'hard',
      context: topic.title,
    },
    {
      id: 'q8',
      text: 'What could you do if your first try is not right?',
      options: ['Try again and look at the example.', 'Give up straight away.', 'Pick an answer without looking.'],
      answer: 'Try again and look at the example.',
      explanation: 'Trying again can help you find the right way.',
      hint: 'You can learn by trying again.',
      type: 'multiple-choice',
      difficulty: 'hard',
      context: topic.title,
    },
    {
      id: 'q9',
      text: 'How can you check your answer?',
      options: ['Try it and look carefully.', 'Skip the example.', 'Guess and stop.'],
      answer: 'Try it and look carefully.',
      explanation: 'Looking carefully helps you check your work.',
      hint: 'Use the example to help you.',
      type: 'multiple-choice',
      difficulty: 'hard',
      context: topic.title,
    },
    {
      id: 'q10',
      text: 'Which choice uses the idea in a new way?',
      options: [practiceExample, 'Do something without thinking.', 'Skip the activity.'],
      answer: practiceExample,
      explanation: 'You can use the same idea with something new.',
      hint: 'Try the idea with a new thing or word.',
      type: 'multiple-choice',
      difficulty: 'hard',
      context: topic.title,
    },
  ],
  };
};

const buildSubjectData = (grade: Grade, subject: Subject): SubjectData => {
  const topics = syllabusTopics[String(grade) as keyof typeof syllabusTopics][subject];
  const strandGroups = new Map<string, string[]>();

  topics.forEach(topic => {
    const strandName = topic.strand.replace(/^\d+\.\d+\s+/, '');
    const subStrands = strandGroups.get(strandName) ?? [];
    subStrands.push(getLearnerCopy(grade, subject, topic.title)?.title ?? topic.title);
    strandGroups.set(strandName, subStrands);
  });

  return {
    strands: Array.from(strandGroups, ([name, subStrands]) => ({ name, subStrands })),
    lessons: topics.map((topic, index) => createLesson(grade, subject, topic, index)),
  };
};

export const curriculum: Record<Grade, Record<Subject, SubjectData>> = Object.fromEntries(
  grades.map(grade => [
    grade,
    Object.fromEntries(subjects.map(subject => [subject, buildSubjectData(grade, subject)])),
  ])
) as Record<Grade, Record<Subject, SubjectData>>;
