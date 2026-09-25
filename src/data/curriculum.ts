export type Subject = 'Mathematics' | 'English';
export type Grade = 1 | 2 | 3;
export type QuestionType = 'multiple-choice' | 'short-answer' | 'true-false';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Question = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
  type?: QuestionType;
  difficulty?: Difficulty;
  context?: string;
};

export type Lesson = {
  id: string;
  title: string;
  subStrand: string;
  description: string;
  competency: string;
  learningOutcome: string;
  learningExperiences: string[];
  keyInquiryQuestions: string[];
  coreCompetencies: string[];
  values: string[];
  assessmentConsiderations: string[];
  questions: Question[];
};

export type SubjectData = {
  strands: { name: string; subStrands: string[] }[];
  lessons: Lesson[];
};

export const gradeInfo: Record<Grade, { label: string; colour: string; tagline: string }> = {
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

type LessonSeed = {
  id: string;
  title: string;
  subStrand: string;
  description: string;
  competency: string;
  outcome: string;
  experiences: string[];
  inquiry: string[];
  competencies: string[];
  values: string[];
  assessment: string[];
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
};

const createLesson = (seed: LessonSeed): Lesson => ({
  id: seed.id,
  title: seed.title,
  subStrand: seed.subStrand,
  description: seed.description,
  competency: seed.competency,
  learningOutcome: seed.outcome,
  learningExperiences: seed.experiences,
  keyInquiryQuestions: seed.inquiry,
  coreCompetencies: seed.competencies,
  values: seed.values,
  assessmentConsiderations: seed.assessment,
  questions: [{
    id: `${seed.id}-q1`,
    text: seed.question,
    options: seed.options,
    answer: seed.answer,
    explanation: seed.explanation,
    hint: seed.hint,
    type: 'multiple-choice',
    difficulty: 'medium',
    context: seed.subStrand,
  }],
});

const additionalLessons: Record<string, Lesson[]> = {
  g1m: [
    createLesson({ id: 'g1m3', title: 'Comparing Numbers', subStrand: 'Counting and number recognition', description: 'Compare and order numbers using objects and number cards.', competency: 'Critical Thinking', outcome: 'The learner should be able to compare and order numbers up to 20.', experiences: ['Compare groups of counters.', 'Use greater than and less than language.', 'Order number cards on a line.'], inquiry: ['Which group has more?', 'How can we prove our answer?'], competencies: ['Critical thinking', 'Communication'], values: ['Accuracy', 'Co-operation'], assessment: ['Observe comparison language.', 'Check correct ordering of number cards.'], question: 'Which number is greater: 8 or 5?', options: ['5', '8', 'They are equal'], answer: '8', explanation: '8 comes after 5 and represents a larger quantity.', hint: 'Think about which number is farther along the number line.' }),
    createLesson({ id: 'g1m4', title: 'Taking Away', subStrand: 'Addition and subtraction', description: 'Model subtraction by taking objects away from a group.', competency: 'Problem Solving', outcome: 'The learner should be able to subtract numbers within 10 using concrete materials.', experiences: ['Act out take-away stories.', 'Use counters and drawings.', 'Record subtraction sentences.'], inquiry: ['What changes when objects are taken away?', 'How many remain?'], competencies: ['Problem solving', 'Creativity'], values: ['Patience', 'Responsibility'], assessment: ['Observe use of counters.', 'Check matching subtraction sentences.'], question: 'There are 6 birds. 2 fly away. How many remain?', options: ['3', '4', '8'], answer: '4', explanation: '6 take away 2 leaves 4.', hint: 'Count backwards two steps from 6.' }),
    createLesson({ id: 'g1m5', title: 'Length and Height', subStrand: 'Length and time', description: 'Compare and measure familiar objects using simple language.', competency: 'Critical Thinking', outcome: 'The learner should be able to compare objects by length and height.', experiences: ['Compare classroom objects directly.', 'Measure with hand spans or blocks.', 'Sort objects from shortest to longest.'], inquiry: ['Which object is longer?', 'How can we compare fairly?'], competencies: ['Critical thinking', 'Collaboration'], values: ['Care', 'Accuracy'], assessment: ['Check direct comparisons.', 'Observe correct measurement sequence.'], question: 'Which is usually longer: a pencil or a classroom door?', options: ['A pencil', 'A classroom door', 'They are equal'], answer: 'A classroom door', explanation: 'A classroom door is longer than a pencil.', hint: 'Compare the size of each object.' }),
    createLesson({ id: 'g1m6', title: '2D Shapes', subStrand: 'Shapes and position', description: 'Identify and describe common flat shapes in the environment.', competency: 'Communication', outcome: 'The learner should be able to identify circles, triangles, squares and rectangles.', experiences: ['Find shapes around school.', 'Sort shape cut-outs.', 'Describe sides and corners.'], inquiry: ['What makes shapes different?', 'Where do we see these shapes?'], competencies: ['Communication', 'Observation'], values: ['Curiosity', 'Co-operation'], assessment: ['Check shape identification.', 'Ask learners to describe one feature.'], question: 'Which shape has three sides?', options: ['Circle', 'Triangle', 'Square'], answer: 'Triangle', explanation: 'A triangle has three sides.', hint: 'Count the sides of each shape.' }),
  ],
  g1e: [
    createLesson({ id: 'g1e3', title: 'Greetings and Introductions', subStrand: 'Greetings and conversations', description: 'Use polite greetings and introduce yourself in familiar situations.', competency: 'Communication', outcome: 'The learner should be able to greet others and say their name clearly.', experiences: ['Role-play greetings.', 'Practise name exchanges.', 'Use polite responses with partners.'], inquiry: ['How do we greet people respectfully?', 'When do we use different greetings?'], competencies: ['Communication', 'Self-efficacy'], values: ['Respect', 'Courtesy'], assessment: ['Observe clear greetings.', 'Check polite responses in role-play.'], question: 'Which is a polite greeting?', options: ['Good morning.', 'Go away.', 'Be quiet.'], answer: 'Good morning.', explanation: 'Good morning is a polite greeting.', hint: 'Choose the words you would use kindly when meeting someone.' }),
    createLesson({ id: 'g1e4', title: 'Rhyming Words', subStrand: 'Phonics and simple words', description: 'Listen for and identify words that end with the same sound.', competency: 'Communication', outcome: 'The learner should be able to identify simple pairs of rhyming words.', experiences: ['Say rhyming pairs aloud.', 'Match picture cards.', 'Complete simple rhyme patterns.'], inquiry: ['What sounds are the same?', 'Which word rhymes with this one?'], competencies: ['Communication', 'Critical thinking'], values: ['Joy', 'Confidence'], assessment: ['Listen for ending sounds.', 'Check picture matching.'], question: 'Which word rhymes with cat?', options: ['Sun', 'Hat', 'Dog'], answer: 'Hat', explanation: 'Cat and hat end with the /at/ sound.', hint: 'Say each word slowly.' }),
    createLesson({ id: 'g1e5', title: 'Naming Words', subStrand: 'Handwriting and sentences', description: 'Identify people, animals and things in simple sentences.', competency: 'Communication', outcome: 'The learner should be able to identify naming words in familiar sentences.', experiences: ['Name classroom objects.', 'Sort picture cards.', 'Circle naming words in sentences.'], inquiry: ['What can a word name?', 'Which word names the object?'], competencies: ['Communication', 'Observation'], values: ['Respect', 'Responsibility'], assessment: ['Check picture sorting.', 'Review circled words.'], question: 'Which word names a thing?', options: ['ball', 'run', 'quickly'], answer: 'ball', explanation: 'Ball names a thing.', hint: 'Look for a word that names an object.' }),
    createLesson({ id: 'g1e6', title: 'Writing Simple Sentences', subStrand: 'Handwriting and sentences', description: 'Build and write short sentences with correct spacing and punctuation.', competency: 'Creativity', outcome: 'The learner should be able to write a simple sentence beginning with a capital letter and ending with a full stop.', experiences: ['Arrange word cards.', 'Copy short model sentences.', 'Write a sentence about a picture.'], inquiry: ['What makes a sentence complete?', 'Where does the full stop go?'], competencies: ['Creativity', 'Communication'], values: ['Neatness', 'Confidence'], assessment: ['Check capital letters and full stops.', 'Observe spacing between words.'], question: 'Which sentence is written correctly?', options: ['the sun is hot', 'The sun is hot.', 'The sun is hot'], answer: 'The sun is hot.', explanation: 'A sentence begins with a capital letter and ends with a full stop.', hint: 'Check the first and last marks.' }),
  ],
  g2m: [
    createLesson({ id: 'g2m3', title: 'Addition and Subtraction', subStrand: 'Place value', description: 'Add and subtract two-digit numbers using place value strategies.', competency: 'Problem Solving', outcome: 'The learner should be able to add and subtract two-digit numbers without regrouping.', experiences: ['Use tens and ones blocks.', 'Solve number sentences.', 'Discuss strategies with a partner.'], inquiry: ['How do tens help us calculate?', 'Which strategy is efficient?'], competencies: ['Problem solving', 'Critical thinking'], values: ['Persistence', 'Accuracy'], assessment: ['Check place value representations.', 'Review calculation steps.'], question: 'What is 34 + 12?', options: ['46', '42', '56'], answer: '46', explanation: 'Add tens and ones separately to get 46.', hint: 'Add tens and ones separately.' }),
    createLesson({ id: 'g2m4', title: 'Sharing Equally', subStrand: 'Multiplication and division', description: 'Share objects into equal groups and connect sharing to division.', competency: 'Problem Solving', outcome: 'The learner should be able to share small quantities equally among groups.', experiences: ['Share counters fairly.', 'Draw equal groups.', 'Explain remainders in simple cases.'], inquiry: ['What does fair sharing mean?', 'Are the groups equal?'], competencies: ['Problem solving', 'Collaboration'], values: ['Fairness', 'Co-operation'], assessment: ['Observe equal sharing.', 'Ask learners to explain their method.'], question: 'Share 8 oranges equally between 2 children. How many does each get?', options: ['2', '4', '6'], answer: '4', explanation: '8 shared equally into 2 groups gives 4 in each group.', hint: 'Make two equal groups.' }),
    createLesson({ id: 'g2m5', title: 'Money and Coins', subStrand: 'Money and time', description: 'Recognise common Kenyan coins and use them in simple purchases.', competency: 'Critical Thinking', outcome: 'The learner should be able to identify coins and find totals in simple money situations.', experiences: ['Sort play coins.', 'Set up a classroom shop.', 'Make exact amounts.'], inquiry: ['Which coins make this amount?', 'How can we pay exactly?'], competencies: ['Critical thinking', 'Communication'], values: ['Responsibility', 'Honesty'], assessment: ['Check coin recognition.', 'Observe accurate totals.'], question: 'Which coins make 10 shillings?', options: ['5 + 5', '2 + 2', '1 + 1'], answer: '5 + 5', explanation: 'Two 5-shilling coins make 10 shillings.', hint: 'Add the values in each option.' }),
    createLesson({ id: 'g2m6', title: 'Reading Time', subStrand: 'Money and time', description: 'Read o’clock and half-past times using an analogue clock.', competency: 'Critical Thinking', outcome: 'The learner should be able to read and represent o’clock and half-past times.', experiences: ['Make clock faces.', 'Act out daily routines.', 'Match times to activities.'], inquiry: ['What does each hand show?', 'How does the time change?'], competencies: ['Critical thinking', 'Self-management'], values: ['Punctuality', 'Responsibility'], assessment: ['Check hand positions.', 'Match clock faces to written times.'], question: 'What time is shown by the long hand at 12 and short hand at 3?', options: ['3 o’clock', '12 o’clock', '6 o’clock'], answer: '3 o’clock', explanation: 'The short hand points to 3 while the long hand points to 12.', hint: 'The short hand tells the hour.' }),
  ],
  g2e: [
    createLesson({ id: 'g2e3', title: 'Reading Fluently', subStrand: 'Fluency and comprehension', description: 'Read familiar sentences smoothly and with meaning.', competency: 'Communication', outcome: 'The learner should be able to read a short text with appropriate pace and expression.', experiences: ['Echo-read a passage.', 'Practise with a partner.', 'Read aloud to a group.'], inquiry: ['How does expression help meaning?', 'What makes reading smooth?'], competencies: ['Communication', 'Self-efficacy'], values: ['Confidence', 'Respect'], assessment: ['Listen for accuracy and expression.', 'Ask simple questions about the text.'], question: 'What should a reader do at a full stop?', options: ['Pause briefly', 'Shout', 'Skip the sentence'], answer: 'Pause briefly', explanation: 'A full stop tells us that the sentence has ended.', hint: 'Think about punctuation when reading aloud.' }),
    createLesson({ id: 'g2e4', title: 'Using Describing Words', subStrand: 'Vocabulary', description: 'Use adjectives to describe people, animals and things.', competency: 'Creativity', outcome: 'The learner should be able to use simple adjectives in oral and written sentences.', experiences: ['Describe classroom objects.', 'Match adjectives to pictures.', 'Build descriptive sentences.'], inquiry: ['What words tell us more?', 'How can we make a description clearer?'], competencies: ['Creativity', 'Communication'], values: ['Appreciation', 'Confidence'], assessment: ['Check suitable adjective choices.', 'Review descriptive sentences.'], question: 'Which word describes a mango?', options: ['sweet', 'jump', 'quickly'], answer: 'sweet', explanation: 'Sweet describes how a mango tastes.', hint: 'Choose the word that tells us more about the mango.' }),
    createLesson({ id: 'g2e5', title: 'Present and Past Tense', subStrand: 'Tenses', description: 'Use present and past tense verbs in familiar sentences.', competency: 'Communication', outcome: 'The learner should be able to distinguish between actions happening now and actions that happened before.', experiences: ['Act out actions.', 'Sort sentences by time.', 'Complete tense sentences.'], inquiry: ['When did the action happen?', 'What changes in the verb?'], competencies: ['Communication', 'Critical thinking'], values: ['Accuracy', 'Responsibility'], assessment: ['Check verb choices.', 'Ask learners to explain time clues.'], question: 'Choose the past tense: “Yesterday, I ___ home.”', options: ['walk', 'walked', 'walking'], answer: 'walked', explanation: 'Yesterday shows that the action happened in the past.', hint: 'Look at the time word.' }),
    createLesson({ id: 'g2e6', title: 'Writing a Description', subStrand: 'Sentences and short paragraphs', description: 'Write connected sentences describing a familiar person, place or object.', competency: 'Creativity', outcome: 'The learner should be able to write a short descriptive paragraph with related sentences.', experiences: ['Plan ideas from a picture.', 'Write three connected sentences.', 'Share writing with a partner.'], inquiry: ['Which details help a reader picture the subject?', 'How do sentences connect?'], competencies: ['Creativity', 'Communication'], values: ['Neatness', 'Confidence'], assessment: ['Check related sentences.', 'Review punctuation and spelling.'], question: 'Which sentence gives a clear description?', options: ['The big red bus stopped.', 'Bus.', 'It.'], answer: 'The big red bus stopped.', explanation: 'It gives a complete idea and useful details.', hint: 'Choose a complete sentence with describing words.' }),
  ],
  g3m: [
    createLesson({ id: 'g3m3', title: 'Division Strategies', subStrand: 'Place value and operations', description: 'Use sharing, grouping and known facts to solve division problems.', competency: 'Problem Solving', outcome: 'The learner should be able to divide quantities into equal groups and explain the answer.', experiences: ['Build equal groups.', 'Use multiplication facts to check division.', 'Solve everyday sharing problems.'], inquiry: ['How are multiplication and division connected?', 'How can we check an answer?'], competencies: ['Problem solving', 'Critical thinking'], values: ['Persistence', 'Fairness'], assessment: ['Check equal grouping.', 'Ask learners to use multiplication to verify.'], question: '24 ÷ 6 = ?', options: ['3', '4', '5'], answer: '4', explanation: 'Six groups of 4 make 24.', hint: 'Think: 6 times what number makes 24?' }),
    createLesson({ id: 'g3m4', title: 'Fractions on a Number Line', subStrand: 'Fractions', description: 'Locate and compare unit fractions on simple number lines.', competency: 'Critical Thinking', outcome: 'The learner should be able to locate halves, thirds and quarters on a number line.', experiences: ['Fold strips into equal parts.', 'Mark fraction points.', 'Compare positions on a line.'], inquiry: ['What does each interval represent?', 'Which fraction is closer to one?'], competencies: ['Critical thinking', 'Accuracy'], values: ['Curiosity', 'Patience'], assessment: ['Check equal intervals.', 'Review fraction placement.'], question: 'Which fraction is halfway between 0 and 1?', options: ['1/4', '1/2', '1/3'], answer: '1/2', explanation: 'One-half marks the midpoint between 0 and 1.', hint: 'Half means two equal parts.' }),
    createLesson({ id: 'g3m5', title: 'Measuring Length', subStrand: 'Length, mass, time and money', description: 'Measure and compare length using centimetres and metres.', competency: 'Problem Solving', outcome: 'The learner should be able to measure and record length using standard units.', experiences: ['Estimate then measure objects.', 'Use a ruler correctly.', 'Compare measured lengths.'], inquiry: ['Which unit is suitable?', 'How accurate is our measurement?'], competencies: ['Problem solving', 'Critical thinking'], values: ['Accuracy', 'Care'], assessment: ['Observe ruler placement.', 'Check units in recorded answers.'], question: 'Which unit is best for measuring a pencil?', options: ['Centimetres', 'Metres', 'Kilometres'], answer: 'Centimetres', explanation: 'A pencil is a small object, so centimetres are suitable.', hint: 'Choose the small unit used for short objects.' }),
    createLesson({ id: 'g3m6', title: 'Reading Simple Data', subStrand: 'Shapes, patterns and data', description: 'Read and interpret information shown in tables and pictographs.', competency: 'Critical Thinking', outcome: 'The learner should be able to answer questions using data in a simple table or pictograph.', experiences: ['Collect class preferences.', 'Build a pictograph.', 'Ask and answer comparison questions.'], inquiry: ['What does each symbol represent?', 'What can the data tell us?'], competencies: ['Critical thinking', 'Communication'], values: ['Honesty', 'Co-operation'], assessment: ['Check accurate reading of symbols.', 'Review comparison statements.'], question: 'If one picture represents 2 learners, how many learners are shown by 3 pictures?', options: ['3', '5', '6'], answer: '6', explanation: 'Three groups of two make six learners.', hint: 'Multiply the number of pictures by 2.' }),
  ],
  g3e: [
    createLesson({ id: 'g3e3', title: 'Finding Main Ideas', subStrand: 'Comprehension and vocabulary', description: 'Identify the main idea and supporting details in a short passage.', competency: 'Critical Thinking', outcome: 'The learner should be able to state the main idea of a short text and identify supporting details.', experiences: ['Read short passages.', 'Choose suitable headings.', 'Highlight supporting details.'], inquiry: ['What is the text mostly about?', 'Which details support the main idea?'], competencies: ['Critical thinking', 'Communication'], values: ['Inquiry', 'Respect'], assessment: ['Check selected headings.', 'Ask learners to justify answers with evidence.'], question: 'What is the main idea of a paragraph about planting trees?', options: ['Trees help the environment.', 'A boy has shoes.', 'The sky is blue.'], answer: 'Trees help the environment.', explanation: 'The main idea summarises what the paragraph is mostly about.', hint: 'Choose the broad idea that includes the details.' }),
    createLesson({ id: 'g3e4', title: 'Using New Vocabulary', subStrand: 'Comprehension and vocabulary', description: 'Use context clues to understand and use unfamiliar words.', competency: 'Communication', outcome: 'The learner should be able to infer the meaning of unfamiliar words from context.', experiences: ['Underline unknown words.', 'Use surrounding clues.', 'Create sentences with new words.'], inquiry: ['What clues surround the word?', 'Can we replace it with a similar word?'], competencies: ['Communication', 'Critical thinking'], values: ['Curiosity', 'Persistence'], assessment: ['Review inferred meanings.', 'Check new words in sentences.'], question: 'In “The tiny ant was small,” what does tiny mean?', options: ['Very small', 'Very loud', 'Very fast'], answer: 'Very small', explanation: 'The sentence gives the clue that tiny means small.', hint: 'Look for a word with a similar meaning.' }),
    createLesson({ id: 'g3e5', title: 'Subject and Predicate', subStrand: 'Sentence structure and tenses', description: 'Identify who or what a sentence is about and what is said about it.', competency: 'Communication', outcome: 'The learner should be able to identify the subject and predicate in simple sentences.', experiences: ['Build sentences from cards.', 'Underline subjects and predicates.', 'Expand short sentences.'], inquiry: ['Who or what is the sentence about?', 'What does the subject do?'], competencies: ['Communication', 'Analysis'], values: ['Accuracy', 'Co-operation'], assessment: ['Check sentence divisions.', 'Ask learners to explain each part.'], question: 'What is the subject in “The dog barks.”?', options: ['The dog', 'barks', 'The'], answer: 'The dog', explanation: 'The subject tells who or what the sentence is about.', hint: 'Ask: who is doing the action?' }),
    createLesson({ id: 'g3e6', title: 'Writing a Story', subStrand: 'Paragraphs and creative writing', description: 'Plan and write a short story with a beginning, middle and ending.', competency: 'Creativity', outcome: 'The learner should be able to write a short story with a clear sequence of events.', experiences: ['Plan characters and setting.', 'Sequence story events.', 'Read and revise a draft.'], inquiry: ['What happens first, next and last?', 'How can we make the ending clear?'], competencies: ['Creativity', 'Communication'], values: ['Imagination', 'Perseverance'], assessment: ['Check logical sequence.', 'Review complete sentences and punctuation.'], question: 'Which event should usually come first in a story?', options: ['The introduction of the characters', 'The final solution', 'The ending sentence'], answer: 'The introduction of the characters', explanation: 'Stories usually introduce characters before later events.', hint: 'Think about how a story begins.' }),
  ],
};

export const curriculum: Record<Grade, Record<Subject, SubjectData>> = {
  1: {
    Mathematics: {
      strands: [
        {
          name: 'Numbers',
          subStrands: ['Counting and number recognition', 'Addition and subtraction'],
        },
        { name: 'Measurement', subStrands: ['Length and time'] },
        { name: 'Geometry', subStrands: ['Shapes and position'] },
      ],
      lessons: [
        {
          id: 'g1m1',
          title: 'Counting Objects',
          subStrand: 'Counting and number recognition',
          description: 'Count groups of familiar objects and connect quantities to numerals.',
          competency: 'Critical Thinking',
          learningOutcome: 'The learner should be able to count, read and write numbers 1–20 in different contexts.',
          learningExperiences: [
            'Count objects in the classroom and home environment.',
            'Match written numerals to concrete quantities.',
            'Order numbers from smallest to largest.',
          ],
          keyInquiryQuestions: [
            'How do we know how many objects there are?',
            'Which number comes next?',
          ],
          coreCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration'],
          values: ['Responsibility', 'Love for learning'],
          assessmentConsiderations: [
            'Observe if the learner counts accurately without skipping objects.',
            'Check recognition of numerals in different classroom activities.',
          ],
          questions: [
            {
              id: 'q1',
              text: 'How many stars are there? ★ ★ ★ ★ ★',
              options: ['4', '5', '6'],
              answer: '5',
              explanation: 'There are five stars.',
              hint: 'Count each star once.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'counting objects',
            },
            {
              id: 'q2',
              text: 'Which number comes after 7?',
              options: ['6', '8', '9'],
              answer: '8',
              explanation: 'After 7 comes 8.',
              hint: 'Say the numbers from 6 to 9.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'number sequence',
            },
          ],
        },
        {
          id: 'g1m2',
          title: 'Adding Small Numbers',
          subStrand: 'Addition and subtraction',
          description: 'Use pictures and number sentences to add small quantities.',
          competency: 'Problem Solving',
          learningOutcome: 'The learner should be able to add and subtract within 10 using concrete materials.',
          learningExperiences: [
            'Combine small sets of objects and count the total.',
            'Use number tracks and ten frames to solve addition stories.',
            'Represent adding and taking away with drawings.',
          ],
          keyInquiryQuestions: [
            'What happens when we put groups together?',
            'How can we show subtraction with objects?',
          ],
          coreCompetencies: ['Problem solving', 'Innovation and creativity'],
          values: ['Co-operation', 'Patience'],
          assessmentConsiderations: [
            'Use counters to see if the learner can combine sets.',
            'Listen for correct vocabulary such as add, take away, altogether.',
          ],
          questions: [
            {
              id: 'q3',
              text: '3 + 2 = ?',
              options: ['4', '5', '6'],
              answer: '5',
              explanation: 'Three plus two equals five.',
              hint: 'Start at 3 and count two more.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'addition',
            },
            {
              id: 'q4',
              text: 'Akinyi has 4 pencils and gets 1 more. How many pencils does she have?',
              options: ['3', '5', '6'],
              answer: '5',
              explanation: '4 + 1 = 5.',
              hint: 'Add one to four.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'word problem',
            },
          ],
        },
        ...additionalLessons.g1m,
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
          description: 'Recognise common letter sounds and connect them to simple words.',
          competency: 'Communication',
          learningOutcome: 'The learner should be able to identify and pronounce sounds and words in familiar contexts.',
          learningExperiences: [
            'Listen to and repeat common sounds in words.',
            'Match beginning sounds to pictures and objects.',
            'Read simple words with support from the teacher.',
          ],
          keyInquiryQuestions: [
            'What sound does the word begin with?',
            'How can we hear the first sound in a word?',
          ],
          coreCompetencies: ['Communication', 'Self-efficacy'],
          values: ['Respect', 'Responsibility'],
          assessmentConsiderations: [
            'Check if the learner can distinguish common initial sounds.',
            'Listen for accurate pronunciation in group reading activities.',
          ],
          questions: [
            {
              id: 'q5',
              text: 'Which word begins with the /m/ sound?',
              options: ['mat', 'sun', 'top'],
              answer: 'mat',
              explanation: 'Mat begins with the /m/ sound.',
              hint: 'Say each word slowly.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'phonics',
            },
            {
              id: 'q6',
              text: 'Which letter begins the word “cat”?',
              options: ['c', 't', 'a'],
              answer: 'c',
              explanation: 'Cat starts with c.',
              hint: 'Look at the first sound in cat.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'reading',
            },
          ],
        },
        {
          id: 'g1e2',
          title: 'Reading a Short Story',
          subStrand: 'Comprehension',
          description: 'Read a short passage and answer questions about it.',
          competency: 'Critical Thinking',
          learningOutcome: 'The learner should be able to answer simple questions about a short text using details from the story.',
          learningExperiences: [
            'Read a short story aloud with expression.',
            'Ask and answer who, what and where questions.',
            'Retell the story in order using pictures.',
          ],
          keyInquiryQuestions: [
            'What happened first in the story?',
            'What details help us answer the question?',
          ],
          coreCompetencies: ['Critical thinking', 'Communication'],
          values: ['Kindness', 'Appreciation'],
          assessmentConsiderations: [
            'Check the learner’s ability to locate answers directly in the text.',
            'Observe how the learner explains the story in their own words.',
          ],
          questions: [
            {
              id: 'q7',
              text: 'Amina has a red ball. What colour is the ball?',
              options: ['Blue', 'Red', 'Green'],
              answer: 'Red',
              explanation: 'The story says Amina has a red ball.',
              hint: 'Find the colour word.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'story comprehension',
            },
            {
              id: 'q8',
              text: 'Choose the correct sentence.',
              options: ['The boy run.', 'The boy runs.', 'The boy running.'],
              answer: 'The boy runs.',
              explanation: '“The boy runs” is the complete sentence.',
              hint: 'Look for a sentence that sounds complete.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'grammar',
            },
          ],
        },
        ...additionalLessons.g1e,
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
          learningOutcome: 'The learner should be able to identify place values in two-digit numbers and explain their meaning.',
          learningExperiences: [
            'Represent numbers with bundles of tens and ones.',
            'Read and write two-digit numbers from daily objects.',
            'Compare digits in tens and ones places.',
          ],
          keyInquiryQuestions: [
            'What does the tens digit tell us?',
            'How do we build a number using tens and ones?',
          ],
          coreCompetencies: ['Critical thinking', 'Problem solving'],
          values: ['Accuracy', 'Inquiry'],
          assessmentConsiderations: [
            'Observe whether the learner can separate tens and ones correctly.',
            'Use number cards to see whether the learner explains digit value clearly.',
          ],
          questions: [
            {
              id: 'q9',
              text: 'In 47, what is the value of 4?',
              options: ['4', '40', '7'],
              answer: '40',
              explanation: 'The 4 is in the tens place, so its value is 40.',
              hint: 'The first digit in a two-digit number shows tens.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'place value',
            },
            {
              id: 'q10',
              text: 'Which number has 6 tens and 3 ones?',
              options: ['36', '63', '69'],
              answer: '63',
              explanation: '6 tens = 60 and 3 ones = 3, making 63.',
              hint: 'Build the number from tens and ones.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'number representation',
            },
          ],
        },
        {
          id: 'g2m2',
          title: 'Multiplication as Groups',
          subStrand: 'Multiplication and division',
          description: 'Use equal groups to understand multiplication.',
          competency: 'Problem Solving',
          learningOutcome: 'The learner should be able to describe multiplication as repeated addition and equal groups.',
          learningExperiences: [
            'Arrange objects into equal groups.',
            'Count repeated groups to find totals.',
            'Connect repeated addition to multiplication.',
          ],
          keyInquiryQuestions: [
            'How many groups are there?',
            'What does each group represent?',
          ],
          coreCompetencies: ['Problem solving', 'Critical thinking'],
          values: ['Co-operation', 'Persistence'],
          assessmentConsiderations: [
            'Check whether the learner can form equal groups and count totals accurately.',
            'Look for use of repeated addition as a strategy.',
          ],
          questions: [
            {
              id: 'q11',
              text: 'There are 3 bags with 2 oranges each. How many oranges are there?',
              options: ['5', '6', '8'],
              answer: '6',
              explanation: '3 groups of 2 make 6.',
              hint: 'Think 2 + 2 + 2.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'equal groups',
            },
          ],
        },
        ...additionalLessons.g2m,
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
          description: 'Identify naming words and action words in simple sentences.',
          competency: 'Communication',
          learningOutcome: 'The learner should be able to identify nouns and verbs in a sentence and use them correctly.',
          learningExperiences: [
            'Sort words into naming words and action words.',
            'Underline nouns and verbs in simple sentences.',
            'Create oral sentences using a noun and a verb.',
          ],
          keyInquiryQuestions: [
            'Which word names a person, place or thing?',
            'Which word tells the action?',
          ],
          coreCompetencies: ['Communication', 'Critical thinking'],
          values: ['Respect', 'Orderliness'],
          assessmentConsiderations: [
            'Check classification of nouns and verbs during sentence work.',
            'Observe whether learners can explain the difference in their own words.',
          ],
          questions: [
            {
              id: 'q12',
              text: 'Which word is a verb in “The girl sings.”?',
              options: ['girl', 'the', 'sings'],
              answer: 'sings',
              explanation: 'Sings tells us what the girl does.',
              hint: 'Look for the action word.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'grammar',
            },
            {
              id: 'q13',
              text: 'Which word is a noun?',
              options: ['jump', 'teacher', 'quickly'],
              answer: 'teacher',
              explanation: 'Teacher names a person.',
              hint: 'A noun can name a person, place, animal or thing.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'identifying parts of speech',
            },
          ],
        },
        {
          id: 'g2e2',
          title: 'Short Paragraphs',
          subStrand: 'Sentences and short paragraphs',
          description: 'Read and build connected sentences about familiar experiences.',
          competency: 'Creativity',
          learningOutcome: 'The learner should be able to write a short paragraph with related sentences about a familiar topic.',
          learningExperiences: [
            'Sequence four simple sentences about a topic.',
            'Write a paragraph using a clear beginning idea.',
            'Read paragraphs aloud to a partner.',
          ],
          keyInquiryQuestions: [
            'How do sentences fit together in a paragraph?',
            'What idea connects the sentences?',
          ],
          coreCompetencies: ['Creativity and innovation', 'Communication'],
          values: ['Neatness', 'Confidence'],
          assessmentConsiderations: [
            'Check paragraph coherence and sentence order.',
            'Look for clear topic focus and capitalisation.',
          ],
          questions: [
            {
              id: 'q14',
              text: 'Which sentence starts with a capital letter?',
              options: ['we went home.', 'We went home.', 'we Went home.'],
              answer: 'We went home.',
              explanation: 'A sentence starts with a capital letter.',
              hint: 'Check the first letter.',
              type: 'multiple-choice',
              difficulty: 'easy',
              context: 'writing conventions',
            },
          ],
        },
        ...additionalLessons.g2e,
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
        { name: 'Geometry and Data', subStrands: ['Shapes, patterns and data'] },
      ],
      lessons: [
        {
          id: 'g3m1',
          title: 'Multiplication Facts',
          subStrand: 'Place value and operations',
          description: 'Use multiplication facts to solve everyday problems.',
          competency: 'Problem Solving',
          learningOutcome: 'The learner should be able to solve multiplication situations using known facts and repeated addition.',
          learningExperiences: [
            'Build arrays for multiplication facts.',
            'Use skip counting to find products.',
            'Solve story problems involving groups of objects.',
          ],
          keyInquiryQuestions: [
            'How can repeated addition help us multiply?',
            'What patterns do we notice in multiplication tables?',
          ],
          coreCompetencies: ['Problem solving', 'Critical thinking'],
          values: ['Perseverance', 'Logical reasoning'],
          assessmentConsiderations: [
            'Check whether the learner can explain multiplication as equal groups.',
            'Look for accurate use of multiplication facts in word problems.',
          ],
          questions: [
            {
              id: 'q15',
              text: '6 × 4 = ?',
              options: ['20', '24', '28'],
              answer: '24',
              explanation: 'Six groups of four make 24.',
              hint: 'Think of 4 added six times.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'multiplication',
            },
            {
              id: 'q16',
              text: 'A class has 5 rows of 7 chairs. How many chairs are there?',
              options: ['30', '35', '40'],
              answer: '35',
              explanation: '5 × 7 = 35.',
              hint: 'Multiply the number of rows by chairs in each row.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'applied math',
            },
          ],
        },
        {
          id: 'g3m2',
          title: 'Fractions of a Whole',
          subStrand: 'Fractions',
          description: 'Recognise and compare simple fractions using visual models.',
          competency: 'Critical Thinking',
          learningOutcome: 'The learner should be able to identify simple fractions as parts of a whole and compare them.',
          learningExperiences: [
            'Fold paper into parts to make equal fractions.',
            'Shade fraction models to match given fractions.',
            'Compare halves, quarters and thirds using shapes.',
          ],
          keyInquiryQuestions: [
            'How do we know the parts are equal?',
            'Which fraction is larger or smaller?',
          ],
          coreCompetencies: ['Critical thinking', 'Creativity'],
          values: ['Accuracy', 'Curiosity'],
          assessmentConsiderations: [
            'Ask the learner to explain what the denominator means.',
            'Use visual models to check fraction recognition and comparison.',
          ],
          questions: [
            {
              id: 'q17',
              text: 'Which fraction means one part out of four equal parts?',
              options: ['1/2', '1/3', '1/4'],
              answer: '1/4',
              explanation: 'One out of four equal parts is one-quarter.',
              hint: 'Look at the denominator.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'fractions',
            },
          ],
        },
        ...additionalLessons.g3m,
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
          description: 'Read a short passage and use evidence from it to answer questions.',
          competency: 'Critical Thinking',
          learningOutcome: 'The learner should be able to explain the meaning of a text by answering questions using evidence from the passage.',
          learningExperiences: [
            'Read a short informational or narrative passage.',
            'Underline words or phrases that support answers.',
            'Discuss cause and effect within the story.',
          ],
          keyInquiryQuestions: [
            'What clues in the passage help us answer?',
            'Why did the character act in that way?',
          ],
          coreCompetencies: ['Critical thinking', 'Communication'],
          values: ['Empathy', 'Inquiry'],
          assessmentConsiderations: [
            'Check whether the learner supports answers with details from the text.',
            'Listen for correct interpretation of characters and events.',
          ],
          questions: [
            {
              id: 'q18',
              text: 'If a story says “Kamau carried an umbrella because dark clouds appeared,” why did he carry it?',
              options: ['He wanted shade.', 'He expected rain.', 'He was going swimming.'],
              answer: 'He expected rain.',
              explanation: 'Dark clouds suggested that rain might come.',
              hint: 'Connect the dark clouds with what an umbrella is used for.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'reading comprehension',
            },
            {
              id: 'q19',
              text: 'Choose the best word: “The children ___ football yesterday.”',
              options: ['play', 'played', 'playing'],
              answer: 'played',
              explanation: '“Yesterday” signals past tense.',
              hint: 'Look at the time word.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'grammar and tenses',
            },
          ],
        },
        {
          id: 'g3e2',
          title: 'Building a Paragraph',
          subStrand: 'Paragraphs and creative writing',
          description: 'Choose clear sentences that can form a short paragraph.',
          competency: 'Creativity',
          learningOutcome: 'The learner should be able to write a short, coherent paragraph using sentences that belong to one idea.',
          learningExperiences: [
            'Arrange sentences into logical order.',
            'Write a paragraph about a class experience or place.',
            'Peer review for sentence flow and punctuation.',
          ],
          keyInquiryQuestions: [
            'What makes the sentences belong together?',
            'How can we make the writing clear and interesting?',
          ],
          coreCompetencies: ['Creativity', 'Communication'],
          values: ['Confidence', 'Neatness'],
          assessmentConsiderations: [
            'Check sentence ordering and paragraph focus.',
            'Look for complete ideas and correct punctuation.',
          ],
          questions: [
            {
              id: 'q20',
              text: 'Which sentence is a good opening for a paragraph about school?',
              options: ['My school is a happy place to learn.', 'Because.', 'And then.'],
              answer: 'My school is a happy place to learn.',
              explanation: 'It introduces the topic clearly.',
              hint: 'Choose a complete sentence that introduces school.',
              type: 'multiple-choice',
              difficulty: 'medium',
              context: 'creative writing',
            },
          ],
        },
        ...additionalLessons.g3e,
      ],
    },
  },
};

export const lessonBank = Object.entries(curriculum).flatMap(([grade, subjects]) =>
  Object.entries(subjects).flatMap(([subject, subjectData]) =>
    subjectData.lessons.map(lesson => ({
      grade: Number(grade) as Grade,
      subject: subject as Subject,
      lessonId: lesson.id,
      title: lesson.title,
      outcome: lesson.learningOutcome,
      competency: lesson.competency,
      value: lesson.values[0] ?? 'Learning',
    }))
  )
);

export const questionBank = lessonBank.flatMap(({ lessonId, grade, subject }) => {
  const lesson = curriculum[grade][subject].lessons.find(item => item.id === lessonId);
  if (!lesson) return [];

  return lesson.questions.map(question => ({
    ...question,
    lessonId,
    grade,
    subject,
  }));
});
