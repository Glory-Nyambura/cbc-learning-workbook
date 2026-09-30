import type { Difficulty, Grade, Question } from './curriculum';

type QuestionSeed = {
  text: string;
  answer: string;
  distractors: [string, string];
  explanation: string;
  hint: string;
};

const difficulty: Difficulty[] = ['easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'hard'];

const makeQuestions = (title: string, seeds: QuestionSeed[]): Question[] => seeds.map((seed, index) => ({
  id: `math-${index + 1}`,
  ...seed,
  options: [seed.answer, ...seed.distractors],
  type: 'multiple-choice',
  difficulty: difficulty[index],
  context: title,
}));

const numericSeed = (text: string, answer: number, explanation: string, hint: string): QuestionSeed => ({
  text,
  answer: String(answer),
  distractors: [String(Math.max(0, answer - 1)), String(answer + 1)],
  explanation,
  hint,
});

const operationQuestions = (grade: Grade, title: string): QuestionSeed[] => {
  const addition = title === 'Addition' || title === 'Adding Numbers';
  const subtraction = title === 'Subtraction' || title === 'Taking Away';
  const multiplication = ['Multiplication', 'Multiplication Facts', 'Equal Groups'].includes(title);
  const division = ['Division', 'Division Facts', 'Sharing Equally'].includes(title);
  const values: [number, number][] = addition
    ? grade === 1
      ? [[3, 4], [6, 5], [8, 7], [9, 6], [12, 5], [14, 4], [7, 8], [11, 8], [13, 6], [15, 5]]
      : grade === 2
        ? [[18, 7], [26, 15], [38, 27], [46, 19], [54, 28], [37, 46], [63, 29], [75, 18], [48, 37], [66, 25]]
        : [[268, 157], [345, 276], [487, 195], [326, 248], [519, 283], [174, 638], [457, 369], [286, 497], [658, 174], [375, 486]]
    : subtraction
      ? grade === 1
        ? [[8, 3], [12, 5], [15, 7], [18, 9], [14, 6], [20, 8], [17, 4], [19, 7], [16, 8], [13, 5]]
        : grade === 2
          ? [[42, 18], [65, 27], [83, 39], [71, 26], [90, 45], [54, 18], [76, 37], [62, 29], [95, 48], [81, 36]]
          : [[423, 186], [750, 328], [604, 257], [831, 469], [900, 375], [562, 184], [713, 286], [645, 397], [802, 458], [531, 279]]
      : multiplication
        ? (grade === 2
          ? [[2, 3], [4, 5], [3, 4], [5, 2], [4, 4], [3, 5], [2, 5], [4, 3], [5, 5], [3, 3]]
          : [[4, 6], [7, 8], [9, 5], [6, 6], [8, 4], [7, 3], [9, 9], [6, 8], [5, 7], [10, 4]])
        : (grade === 2
          ? [[8, 2], [15, 3], [20, 5], [24, 4], [18, 3], [25, 5], [16, 4], [21, 3], [12, 2], [10, 5]]
          : [[56, 7], [72, 8], [81, 9], [64, 8], [45, 5], [90, 10], [42, 6], [36, 4], [63, 7], [54, 6]]);

  return values.map(([first, second]) => {
    const answer = addition ? first + second : subtraction ? first - second : multiplication ? first * second : first / second;
    const verb = addition ? 'add' : subtraction ? 'take away' : multiplication ? 'multiply' : 'share equally';
    const symbol = addition ? '+' : subtraction ? '−' : multiplication ? '×' : '÷';
    const explanation = addition
      ? `${first} plus ${second} is ${answer}.`
      : subtraction
        ? `${first} take away ${second} leaves ${answer}.`
        : multiplication
          ? `${first} groups of ${second} make ${answer}.`
          : `${first} shared into ${second} equal groups gives ${answer} in each group.`;
    return numericSeed(`What is ${first} ${symbol} ${second}?`, answer, explanation, `Use the lesson strategy to ${verb} the numbers.`);
  });
};

const numberQuestions = (grade: Grade, title: string): QuestionSeed[] => {
  if (title === 'Counting Forwards and Backwards' || title === 'Number Concept') {
    const start = grade === 1 ? 21 : grade === 2 ? 46 : 316;
    const step = grade === 1 ? 1 : grade === 2 ? 2 : 10;
    return Array.from({ length: 10 }, (_, index) => {
      const number = start + index * step;
      const answer = number + step;
      return numericSeed(
        `Count forwards by ${step}. What number comes after ${number}?`,
        answer,
        `${answer} comes after ${number} when counting forwards by ${step}.`,
        `Keep the counting pattern going by adding ${step}.`
      );
    });
  }

  const examples: [number, number][] = grade === 1
    ? [[14, 1], [18, 1], [20, 2], [13, 1], [17, 1], [11, 1], [16, 1], [19, 1], [12, 1], [15, 1]]
    : grade === 2
      ? [[246, 2], [381, 3], [507, 5], [624, 6], [719, 7], [835, 8], [492, 4], [160, 1], [958, 9], [273, 2]]
      : [[3472, 3], [5816, 5], [6049, 6], [7293, 7], [4185, 4], [9361, 9], [2507, 2], [8634, 8], [1942, 1], [5728, 5]];
  const place = grade === 1 ? 'ten' : grade === 2 ? 'hundred' : 'thousand';
  return examples.map(([number, digit]) => {
    const placeNumber = grade === 1 ? digit * 10 : grade === 2 ? digit * 100 : digit * 1000;
    const promptPlace = grade === 1 ? 'tens' : grade === 2 ? 'hundreds' : 'thousands';
    return numericSeed(
      `In ${number}, what is the value of the digit in the ${place} place?`,
      placeNumber,
      `The digit ${digit} in the ${promptPlace} place is worth ${placeNumber}.`,
      `Find the ${promptPlace} digit, then write its place value.`
    );
  });
};

const fractionQuestions = (grade: Grade): QuestionSeed[] => {
  const denominator = grade === 1 ? 2 : grade === 2 ? 4 : 8;
  const fraction = grade === 1 ? 'half' : grade === 2 ? 'quarter' : 'eighth';
  return Array.from({ length: 10 }, (_, index) => {
    const total = denominator * (index + 1);
    const answer = index + 1;
    return numericSeed(
      `A group of ${total} equal counters is split into ${denominator} equal parts. How many counters are in one part?`,
      answer,
      `One ${fraction} of ${total} is ${answer}.`,
      `Share ${total} counters fairly into ${denominator} equal groups.`
    );
  });
};

const classificationQuestions = (title: string): QuestionSeed[] => {
  const entries: [string, string, string, string][] = title.includes('Colour')
    ? [
        ['Which bottle tops belong in the red group?', 'Red tops', 'Blue tops', 'Pencils'],
        ['A red ball and a red cup should be grouped by what?', 'Colour', 'Length', 'Weight'],
        ['Which pair has the same colour?', 'Two green leaves', 'A red top and a blue top', 'A yellow cup and a blue cup'],
        ['Where should a blue counter go?', 'With the blue counters', 'With the red counters', 'With the pencils'],
        ['Which rule makes a colour group?', 'Put objects of one colour together', 'Put long objects together', 'Put heavy objects together'],
        ['What belongs with a yellow flower in a yellow group?', 'Another yellow flower', 'A blue shoe', 'A green leaf'],
        ['Which group is sorted by colour?', 'Red, red, red', 'Big, small, big', 'Circle, square, circle'],
        ['A green bottle top belongs with which group?', 'Green objects', 'Round objects only', 'Heavy objects'],
        ['Which two objects match by colour?', 'Two blue bottle tops', 'A red cup and a blue cup', 'A yellow leaf and a green leaf'],
        ['What should you check when sorting by colour?', 'The colour of each object', 'How heavy each object is', 'How long each object is'],
      ]
    : title.includes('Shape')
      ? [
          ['Which shapes belong together?', 'Two circles', 'A circle and a square', 'A triangle and a pencil'],
          ['How many sides does a triangle have?', '3', '4', '0'],
          ['Which shape has no straight sides?', 'Circle', 'Square', 'Triangle'],
          ['Which pair has the same shape?', 'Two squares', 'A circle and a triangle', 'A rectangle and a circle'],
          ['Which shape has four equal sides?', 'Square', 'Circle', 'Triangle'],
          ['Which shapes should go in the triangle group?', 'Shapes with three sides', 'Shapes with no corners', 'Shapes with four equal sides'],
          ['What feature can help you sort 2D shapes?', 'Sides and corners', 'Colour only', 'Weight'],
          ['Which shape has four corners and opposite sides equal?', 'Rectangle', 'Circle', 'Triangle'],
          ['A shape has three straight sides. What is it?', 'Triangle', 'Circle', 'Rectangle'],
          ['Which pair has four corners?', 'Square and rectangle', 'Circle and triangle', 'Circle and oval'],
        ]
      : title.includes('Size') || title.includes('Biggest') || title.includes('Ordering')
        ? [
            ['Which is the biggest: a small, medium, or large bottle?', 'Large bottle', 'Small bottle', 'Medium bottle'],
            ['When ordering from smallest to biggest, which comes first?', 'The smallest object', 'The biggest object', 'The middle object'],
            ['When ordering from biggest to smallest, which comes first?', 'The biggest object', 'The smallest object', 'The shortest object'],
            ['Which stick is longest: 2 blocks, 5 blocks, or 3 blocks?', '5 blocks', '2 blocks', '3 blocks'],
            ['Which leaf is smallest: 4 cm, 7 cm, or 2 cm?', '2 cm', '7 cm', '4 cm'],
            ['What comes after the shortest stick when ordering small to big?', 'The next longer stick', 'The longest stick first', 'A shorter stick'],
            ['Which object is smallest: a 6 cm crayon or a 9 cm crayon?', '6 cm crayon', '9 cm crayon', 'They are the same'],
            ['Which order goes from big to small?', '10 cm, 7 cm, 3 cm', '3 cm, 7 cm, 10 cm', '7 cm, 10 cm, 3 cm'],
            ['Which is the biggest number of handspans?', '8 handspans', '5 handspans', '3 handspans'],
            ['What should you compare to find the smallest object?', 'Their sizes', 'Their colours', 'Their names'],
          ]
        : title.includes('Comparing')
          ? [
              ['There are 5 red tops and 3 blue tops. Which group has more?', 'Red tops', 'Blue tops', 'The same number'],
              ['There are 4 cups and 4 spoons. How do the groups compare?', 'The same number', 'More cups', 'More spoons'],
              ['Match 6 mangoes with 4 baskets. How many mangoes are left over?', '2', '4', '10'],
              ['There are 7 children and 5 balls. Which has fewer?', 'Balls', 'Children', 'The same number'],
              ['Which group has more: 9 pencils or 6 books?', 'Pencils', 'Books', 'The same number'],
              ['There are 8 green counters and 8 yellow counters. Which is greater?', 'Neither; they are equal', 'Green counters', 'Yellow counters'],
              ['A group has 3 left over after matching. What does this show?', 'That group has more', 'That group has fewer', 'Both groups are empty'],
              ['Which is fewer: 2 oranges or 5 bananas?', 'Oranges', 'Bananas', 'The same number'],
              ['There are 10 learners and 8 chairs. How many more learners are there?', '2', '8', '18'],
              ['What can you do to compare two groups fairly?', 'Match one item from each group', 'Look only at the colours', 'Move the items farther apart'],
            ]
          : title.includes('Matching')
            ? [
                ['What can be matched with a cup?', 'A spoon', 'A leaf', 'A shoe'],
                ['Give each learner one book. What are you making?', 'Matching pairs', 'A colour pattern', 'A long line'],
                ['Which item matches a shoe?', 'Its other shoe', 'A cup', 'A pencil'],
                ['There are 4 cups. How many spoons make one pair for each cup?', '4', '2', '8'],
                ['Which pair belongs together?', 'A lock and a key', 'A leaf and a cup', 'A pencil and a mango'],
                ['What does one-to-one matching help you check?', 'That each item has a partner', 'Which item is heavier', 'Which item is red'],
                ['There are 5 plates and 3 cups. How many plates have no cup?', '2', '3', '8'],
                ['Which is a matching pair?', 'Two socks', 'A book and a mango', 'A chair and a pencil'],
                ['If every cup has one spoon, what should be true?', 'The number of cups and spoons is equal', 'There are twice as many cups', 'There are no spoons'],
                ['Which action makes equal pairs?', 'Give each child one partner', 'Put all objects in one pile', 'Sort by size only'],
              ]
            : [
                ['Which things belong together by type?', 'Two pencils', 'A pencil and a leaf', 'A bottle top and a shoe'],
                ['Where should all the bottle tops go?', 'In the bottle-top group', 'With the spoons', 'With the leaves'],
                ['Which group contains only classroom items?', 'Book, pencil, ruler', 'Mango, shoe, leaf', 'Cup, goat, ball'],
                ['Which objects are the same kind?', 'Two oranges', 'An orange and a cup', 'A pencil and a shoe'],
                ['What is a good rule for grouping the same things?', 'Put alike objects together', 'Mix all objects randomly', 'Choose by size only'],
                ['Which items belong in an animal group?', 'Goat and hen', 'Book and ruler', 'Cup and plate'],
                ['Which objects are both used for writing?', 'Pencil and crayon', 'Cup and spoon', 'Shoe and sock'],
                ['Which group has only fruits?', 'Mango, banana, orange', 'Mango, shoe, cup', 'Book, leaf, banana'],
                ['A learner groups all the books together. What is the sorting rule?', 'Same kind of object', 'Same length', 'Same weight'],
                ['What should you notice before grouping objects?', 'How they are alike', 'How far apart they are', 'Who found them'],
              ];
  return entries.map(([text, answer, wrongOne, wrongTwo]) => ({
    text,
    answer,
    distractors: [wrongOne, wrongTwo],
    explanation: `The correct choice matches the lesson on ${title.toLowerCase()}.`,
    hint: `Think about the rule used in ${title.toLowerCase()}.`,
  }));
};

const patternQuestions = (title: string): QuestionSeed[] => {
  const colour = title.includes('Colour');
  const sequences = colour
    ? [
        ['red, blue, red, blue', 'red', 'green', 'yellow'],
        ['yellow, green, yellow, green', 'yellow', 'blue', 'red'],
        ['red, red, blue, red, red', 'blue', 'green', 'yellow'],
        ['green, yellow, blue, green, yellow', 'blue', 'red', 'green'],
        ['blue, red, yellow, blue, red', 'yellow', 'green', 'red'],
        ['red, blue, green, red, blue', 'green', 'yellow', 'blue'],
        ['yellow, yellow, red, yellow, yellow', 'red', 'blue', 'green'],
        ['blue, green, blue, green, blue', 'green', 'red', 'yellow'],
        ['green, red, red, green, red', 'red', 'blue', 'yellow'],
        ['red, yellow, blue, red, yellow', 'blue', 'green', 'red'],
      ]
    : [
        ['pencil, eraser, pencil, eraser', 'pencil', 'book', 'ruler'],
        ['cup, spoon, cup, spoon', 'cup', 'plate', 'fork'],
        ['circle, square, circle, square', 'circle', 'triangle', 'rectangle'],
        ['triangle, triangle, circle, triangle, triangle', 'circle', 'square', 'triangle'],
        ['1, 2, 1, 2', '1', '3', '4'],
        ['2, 4, 2, 4', '2', '3', '6'],
        ['clap, tap, tap, clap, tap', 'tap', 'clap', 'stamp'],
        ['leaf, stone, leaf, stone', 'leaf', 'stick', 'flower'],
        ['red top, blue top, blue top, red top', 'blue top', 'green top', 'red top'],
        ['1, 2, 3, 1, 2', '3', '1', '4'],
      ];
  return sequences.map(([sequence, answer, wrongOne, wrongTwo]) => ({
    text: `What comes next in this pattern: ${sequence}, ...?`,
    answer,
    distractors: [wrongOne, wrongTwo],
    explanation: `${answer} continues the repeating pattern.`,
    hint: `Look for the part of the ${title.toLowerCase()} pattern that repeats.`,
  }));
};

const measurementQuestions = (grade: Grade, title: string): QuestionSeed[] => {
  if (title === 'Length') {
    const unit = grade === 1 ? 'handspans' : 'metres';
    const pairs: [number, number][] = [[8, 5], [12, 7], [9, 4], [15, 6], [11, 3], [18, 9], [14, 8], [20, 12], [16, 7], [13, 5]];
    return pairs.map(([longer, shorter]) => numericSeed(
      `A mat is ${longer} ${unit} long. A desk is ${shorter} ${unit} long. How much longer is the mat?`,
      longer - shorter,
      `The difference is ${longer - shorter} ${unit}.`,
      `Subtract the shorter measurement from the longer one.`
    ));
  }
  if (title === 'Mass') {
    const unit = grade === 1 ? 'blocks' : 'kilograms';
    const pairs: [number, number][] = [[6, 3], [8, 5], [9, 4], [12, 7], [10, 6], [15, 8], [14, 9], [18, 11], [16, 7], [20, 12]];
    return pairs.map(([first, second], index) => {
      const answer = first > second ? 'The first object' : 'The second object';
      const firstLabel = `${first} ${unit}`;
      const secondLabel = `${second} ${unit}`;
      const heavier = first > second ? firstLabel : secondLabel;
      const lighter = first > second ? secondLabel : firstLabel;
      return {
        text: `A balance compares objects of ${firstLabel} and ${secondLabel}. Which object is heavier?`,
        answer,
        distractors: [first === second ? 'They weigh the same' : 'They weigh the same', 'It cannot be compared'],
        explanation: `The object measuring ${heavier} is heavier than the one measuring ${lighter}.`,
        hint: 'On a balance, the heavier side goes down.',
      };
    });
  }
  if (title === 'Capacity') {
    const unit = grade === 1 ? 'cups' : 'litres';
    const pairs: [number, number][] = [[3, 2], [5, 4], [7, 3], [8, 6], [9, 5], [10, 7], [12, 8], [6, 4], [15, 9], [14, 11]];
    return pairs.map(([first, second]) => numericSeed(
      `A jug holds ${first} ${unit}. A cup holds ${second} ${unit}. How much more does the jug hold?`,
      first - second,
      `The jug holds ${first - second} ${unit} more.`,
      `Subtract the cup's capacity from the jug's capacity.`
    ));
  }
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return Array.from({ length: 10 }, (_, index) => {
    const startIndex = index % days.length;
    const offset = index < days.length ? 1 : 2;
    const answer = days[(startIndex + offset) % days.length];
    return {
      text: `What day is ${offset} day${offset === 1 ? '' : 's'} after ${days[startIndex]}?`,
      answer,
      distractors: [days[(startIndex + offset - 1) % days.length], days[(startIndex + offset + 1) % days.length]],
      explanation: `${answer} is ${offset} day${offset === 1 ? '' : 's'} after ${days[startIndex]}.`,
      hint: 'Say the days of the week in order.',
    };
  });
};

const moneyQuestions = (grade: Grade): QuestionSeed[] => {
  const transactions: [number, number][] = grade === 1
    ? [[20, 5], [50, 10], [10, 3], [20, 8], [50, 25], [100, 40], [20, 12], [50, 15], [100, 65], [10, 6]]
    : grade === 2
      ? [[150, 120], [100, 65], [200, 145], [80, 35], [120, 75], [200, 128], [90, 42], [160, 85], [180, 95], [200, 155]]
      : [[500, 275], [1000, 625], [750, 385], [900, 468], [650, 275], [1000, 735], [825, 460], [950, 585], [700, 348], [1000, 590]];
  return transactions.map(([paid, cost]) => numericSeed(
    `An item costs KES ${cost}. You pay KES ${paid}. How much change should you get?`,
    paid - cost,
    `KES ${paid} − KES ${cost} = KES ${paid - cost} change.`,
    'Subtract the cost from the amount paid.'
  ));
};

const geometryQuestions = (title: string): QuestionSeed[] => {
  const solids = title.includes('3D');
  const lines = title === 'Lines';
  const entries: [string, string, string, string][] = solids
    ? [
        ['Which solid has six equal square faces?', 'Cube', 'Sphere', 'Cylinder'],
        ['Which object is shaped like a cylinder?', 'Tin', 'Ball', 'Dice'],
        ['Which solid has one curved surface and two flat circular faces?', 'Cylinder', 'Cube', 'Cuboid'],
        ['Which solid has no flat faces or corners?', 'Sphere', 'Cuboid', 'Cube'],
        ['Which object is shaped like a cuboid?', 'Box', 'Orange', 'Tin'],
        ['How many faces does a cube have?', '6', '4', '8'],
        ['Which solid can roll in every direction?', 'Sphere', 'Cube', 'Cuboid'],
        ['Which solid has rectangular faces?', 'Cuboid', 'Sphere', 'Cone'],
        ['Which solid has a circular curved surface?', 'Cylinder', 'Cube', 'Cuboid'],
        ['A ball is an example of which 3D shape?', 'Sphere', 'Cube', 'Cylinder'],
      ]
    : lines
      ? [
          ['Which line stands up and down?', 'Vertical', 'Horizontal', 'Curved'],
          ['Which line goes from side to side?', 'Horizontal', 'Vertical', 'Curved'],
          ['Which line bends?', 'Curved', 'Straight', 'Parallel'],
          ['The opposite edges of a ruler do not meet. What are they?', 'Parallel', 'Intersecting', 'Curved'],
          ['Two lines cross each other. They are:', 'Intersecting', 'Parallel', 'Curved'],
          ['Which lines meet at a right angle?', 'Perpendicular', 'Parallel', 'Curved'],
          ['A flagpole is usually which direction?', 'Vertical', 'Horizontal', 'Slanted'],
          ['The top edge of a table is usually:', 'Horizontal', 'Vertical', 'Curved'],
          ['Which pair of lines never meets?', 'Parallel lines', 'Intersecting lines', 'Perpendicular lines'],
          ['Which line slopes diagonally?', 'Slanted', 'Vertical', 'Horizontal'],
        ]
      : [
          ['Which shape has three sides?', 'Triangle', 'Square', 'Circle'],
          ['Which shape has four equal sides?', 'Square', 'Rectangle', 'Triangle'],
          ['Which shape has no corners?', 'Circle', 'Triangle', 'Square'],
          ['Which shape has four sides and four corners?', 'Rectangle', 'Circle', 'Triangle'],
          ['Which shape has the most sides: triangle, square, or rectangle?', 'Rectangle', 'Triangle', 'They have the same number'],
          ['How many corners does a square have?', '4', '3', '0'],
          ['Which shape has one curved boundary?', 'Circle', 'Square', 'Triangle'],
          ['Which shape has three corners?', 'Triangle', 'Rectangle', 'Circle'],
          ['A window has four equal sides. Which shape is it?', 'Square', 'Circle', 'Triangle'],
          ['Which shape has two long sides and two short sides?', 'Rectangle', 'Square', 'Circle'],
        ];
  return entries.map(([text, answer, wrongOne, wrongTwo]) => ({
    text,
    answer,
    distractors: [wrongOne, wrongTwo],
    explanation: `${answer} is the correct answer for this ${title.toLowerCase()} question.`,
    hint: `Recall the features of ${title.toLowerCase()} from the lesson.`,
  }));
};

export function getMathPracticeQuestions(grade: Grade, title: string): Question[] {
  if (['Addition', 'Adding Numbers', 'Subtraction', 'Taking Away', 'Multiplication', 'Multiplication Facts', 'Equal Groups', 'Division', 'Division Facts', 'Sharing Equally'].includes(title)) {
    return makeQuestions(title, operationQuestions(grade, title));
  }
  if (['Counting Forwards and Backwards', 'Number Concept', 'Whole Numbers'].includes(title)) {
    return makeQuestions(title, numberQuestions(grade, title));
  }
  if (title.includes('Fraction')) return makeQuestions(title, fractionQuestions(grade));
  if (title.includes('Pattern')) return makeQuestions(title, patternQuestions(title));
  if (['Length', 'Mass', 'Capacity', 'Time'].includes(title)) return makeQuestions(title, measurementQuestions(grade, title));
  if (title === 'Money' || title === 'Using Kenyan Money') return makeQuestions(title, moneyQuestions(grade));
  if (['Lines', '2D Shapes', '3D Shapes and Models'].includes(title)) return makeQuestions(title, geometryQuestions(title));
  return makeQuestions(title, classificationQuestions(title));
}