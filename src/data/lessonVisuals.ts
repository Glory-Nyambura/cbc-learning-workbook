import type { Grade, LearningVisual, LessonExampleVisual, Question, Subject, VisualQuestionOption } from './curriculum';

const visual = (...groups: NonNullable<LessonExampleVisual['groups']>): LessonExampleVisual => {
  const alt = groups.map(currentGroup =>
    `${currentGroup.label}: ${currentGroup.items.map(item => {
      const qualifiers = [item.size, item.colour].filter(value => value && !item.label.toLowerCase().startsWith(`${value} `));
      const description = [...qualifiers, item.label].filter(Boolean).join(' ');
      const plural = item.label.endsWith('y') ? `${description.slice(0, -1)}ies` : `${description}s`;
      return item.count && item.count > 1
        ? `${item.count} ${item.label.endsWith('s') ? description : plural}`
        : description;
    }).join(', ')}`
  ).join('. ');
  return { alt, caption: alt, groups };
};

const group = (label: string, ...items: NonNullable<LessonExampleVisual['groups']>[number]['items']) => ({ label, items });

type ChoiceItem = NonNullable<LearningVisual['groups']>[number]['items'][number];

const choicePatterns: { pattern: RegExp; item: ChoiceItem }[] = [
  { pattern: /\b(bottle tops?)\b/gi, item: { symbol: '🔴', label: 'bottle top' } },
  { pattern: /(?<!bottle )\b(tops?)\b/gi, item: { symbol: '●', label: 'top' } },
  { pattern: /\b(rectangles?)\b/gi, item: { symbol: '', label: 'rectangle', shape: 'rectangle' } },
  { pattern: /\b(triangles?)\b/gi, item: { symbol: '', label: 'triangle', shape: 'triangle' } },
  { pattern: /\b(circles?)\b/gi, item: { symbol: '', label: 'circle', shape: 'circle' } },
  { pattern: /\b(squares?)\b/gi, item: { symbol: '', label: 'square', shape: 'square' } },
  { pattern: /\b(spheres?)\b/gi, item: { symbol: '⚽', label: 'sphere' } },
  { pattern: /\b(cubes?|dice)\b/gi, item: { symbol: '🧊', label: 'cube' } },
  { pattern: /\b(cylinders?|tins?)\b/gi, item: { symbol: '🥫', label: 'cylinder' } },
  { pattern: /\b(cuboids?)\b/gi, item: { symbol: '📦', label: 'cuboid' } },
  { pattern: /\b(bottles?)\b/gi, item: { symbol: '🍼', label: 'bottle' } },
  { pattern: /\b(boxes|box)\b/gi, item: { symbol: '📦', label: 'box' } },
  { pattern: /\b(leaves|leaf)\b/gi, item: { symbol: '🍃', label: 'leaf' } },
  { pattern: /\b(sticks?)\b/gi, item: { symbol: '🪵', label: 'stick' } },
  { pattern: /\b(crayons?)\b/gi, item: { symbol: '🖍️', label: 'crayon' } },
  { pattern: /\b(mats?)\b/gi, item: { symbol: '🟫', label: 'mat' } },
  { pattern: /\b(baskets?)\b/gi, item: { symbol: '🧺', label: 'basket' } },
  { pattern: /\b(desks?)\b/gi, item: { symbol: '🪑', label: 'desk' } },
  { pattern: /\b(jugs?)\b/gi, item: { symbol: '🫗', label: 'jug' } },
  { pattern: /\b(cups?)\b/gi, item: { symbol: '🥛', label: 'cup' } },
  { pattern: /\b(apples?)\b/gi, item: { symbol: '🍎', label: 'apple' } },
  { pattern: /\b(oranges?)\b/gi, item: { symbol: '🍊', label: 'orange' } },
  { pattern: /\b(mangoes|mangos|mango)\b/gi, item: { symbol: '🥭', label: 'mango' } },
  { pattern: /\b(bananas?)\b/gi, item: { symbol: '🍌', label: 'banana' } },
  { pattern: /\b(flowers?)\b/gi, item: { symbol: '🌼', label: 'flower' } },
  { pattern: /\b(pencils?)\b/gi, item: { symbol: '✏️', label: 'pencil' } },
  { pattern: /\b(spoons?)\b/gi, item: { symbol: '🥄', label: 'spoon' } },
  { pattern: /\b(plates?)\b/gi, item: { symbol: '🍽️', label: 'plate' } },
  { pattern: /\b(socks?)\b/gi, item: { symbol: '🧦', label: 'sock' } },
  { pattern: /\b(shoes?)\b/gi, item: { symbol: '👟', label: 'shoe' } },
  { pattern: /\b(books?)\b/gi, item: { symbol: '📘', label: 'book' } },
  { pattern: /\b(rulers?)\b/gi, item: { symbol: '📏', label: 'ruler' } },
  { pattern: /\b(counters?)\b/gi, item: { symbol: '●', label: 'counter' } },
  { pattern: /\b(stars?)\b/gi, item: { symbol: '⭐', label: 'star' } },
  { pattern: /\b(children|child|learners?)\b/gi, item: { symbol: '🧒', label: 'child' } },
  { pattern: /\b(hens?)\b/gi, item: { symbol: '🐔', label: 'hen' } },
  { pattern: /\b(goats?)\b/gi, item: { symbol: '🐐', label: 'goat' } },
  { pattern: /\b(dogs?)\b/gi, item: { symbol: '🐕', label: 'dog' } },
  { pattern: /\b(cats?)\b/gi, item: { symbol: '🐈', label: 'cat' } },
  { pattern: /\b(balls?)\b/gi, item: { symbol: '⚽', label: 'ball' } },
  { pattern: /\b(chairs?)\b/gi, item: { symbol: '🪑', label: 'chair' } },
  { pattern: /\b(schools?)\b/gi, item: { symbol: '🏫', label: 'school' } },
  { pattern: /\b(locks?)\b/gi, item: { symbol: '🔒', label: 'lock' } },
  { pattern: /\b(keys?)\b/gi, item: { symbol: '🔑', label: 'key' } },
  { pattern: /\b(runs?|running)\b/gi, item: { symbol: '🏃', label: 'run' } },
  { pattern: /\b(sleeps?|sleeping)\b/gi, item: { symbol: '😴', label: 'sleep' } },
  { pattern: /\b(eats?|eating)\b/gi, item: { symbol: '🍽️', label: 'eat' } },
  { pattern: /\b(jumps?|jumping)\b/gi, item: { symbol: '🤸', label: 'jump' } },
  { pattern: /\b(sits?|sitting)\b/gi, item: { symbol: '🪑', label: 'sit' } },
  { pattern: /\b(pecks?)\b/gi, item: { symbol: '🐔', label: 'peck' } },
  { pattern: /\b(sings?|singing)\b/gi, item: { symbol: '🎤', label: 'sing' } },
  { pattern: /\b(plays?|playing)\b/gi, item: { symbol: '⚽', label: 'play' } },
  { pattern: /\b(grass)\b/gi, item: { symbol: '🌿', label: 'grass' } },
  { pattern: /\b(suns?)\b/gi, item: { symbol: '☀️', label: 'sun' } },
  { pattern: /\b(funs?)\b/gi, item: { symbol: '🎉', label: 'fun' } },
  { pattern: /\b(words?)\b/gi, item: { symbol: '🔤', label: 'word' } },
  { pattern: /\b(blocks?)\b/gi, item: { symbol: '🧱', label: 'block' } },
  { pattern: /\b(erasers?)\b/gi, item: { symbol: '🧽', label: 'eraser' } },
  { pattern: /\b(birds?)\b/gi, item: { symbol: '🐦', label: 'bird' } },
  { pattern: /\b(clinic)\b/gi, item: { symbol: '🏥', label: 'clinic' } },
];

const choiceVisual = (option: string): LearningVisual | undefined => {
  if (/^\d{1,4}$/.test(option)) {
    return visual(group(`Number ${option}`, { symbol: option, label: option }));
  }
  const matches = choicePatterns.flatMap(({ pattern, item }) =>
    [...option.matchAll(pattern)].map(match => ({ index: match.index ?? 0, item, match }))
  ).sort((first, second) => first.index - second.index || second.match[0].length - first.match[0].length)
    .filter((match, index, all) => !all.slice(0, index).some(previous =>
      match.index < previous.index + previous.match[0].length
      && previous.index < match.index + match.match[0].length
    ));
  if (!matches.length) return undefined;

  const items = matches.map(({ index, item, match }, itemIndex) => {
    const previousEnd = itemIndex > 0
      ? matches[itemIndex - 1].index + matches[itemIndex - 1].match[0].length
      : 0;
    const context = option.slice(previousEnd, index).split(/\band\b|,/i).at(-1) ?? option;
    const colour = context.match(/\b(red|blue|green|yellow|orange)\b/i)?.[1].toLowerCase() as ChoiceItem['colour'] | undefined;
    const size = /\b(small|tiny|shortest)\b/i.test(context)
      ? 'small'
      : /\b(medium|middle)\b/i.test(context)
        ? 'medium'
        : /\b(biggest|largest|large|big|longest)\b/i.test(context)
          ? 'large'
          : undefined;
    return {
      ...item,
      label: [size, colour, item.label].filter(Boolean).join(' '),
      ...(colour ? { colour } : {}),
      ...(size ? { size } : {}),
    };
  });
  const quantity = option.match(/\b(\d+|one|two|three|four|five)\s+\w+/i)?.[1].toLowerCase();
  const quantities: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };
  if (items.length === 1) {
    if (quantity) items[0].count = quantities[quantity] ?? Number(quantity);
    else if (matches[0].match[0].toLowerCase().endsWith('s')) items[0].count = 2;
  }
  return visual(group(option, ...items));
};

const operationVisual = (text: string): LearningVisual | undefined => {
  const match = text.match(/(\d+)\s*([+−×÷])\s*(\d+)/);
  if (!match) return undefined;
  const first = Number(match[1]);
  const operator = match[2];
  const second = Number(match[3]);
  const total = operator === '+' ? first + second : operator === '−' ? first - second : operator === '×' ? first * second : first / second;
  if (first > 20 || second > 20 || total > 20 || !Number.isInteger(total)) return undefined;

  if (operator === '×' || operator === '÷') {
    const groupCount = operator === '×' ? first : second;
    const itemCount = operator === '×' ? second : total;
    return visual(...Array.from({ length: groupCount }, (_, index) =>
      group(`Group ${index + 1}`, { symbol: '●', label: 'counter', count: itemCount, colour: 'blue' })
    ));
  }

  const groups = [group('Start', { symbol: '●', label: 'counter', count: first, colour: 'blue' })];
  if (operator === '+') {
    groups.push(group('Add', { symbol: '+', label: 'add' }, { symbol: '●', label: 'counter', count: second, colour: 'orange' }));
    groups.push(group('Altogether', { symbol: '●', label: 'counter', count: total, colour: 'green' }));
  } else {
    groups.push(group('Take away', { symbol: '−', label: 'remove' }, { symbol: '●', label: 'counter', count: second, colour: 'red', removed: true }));
    groups.push(group('Left over', { symbol: '●', label: 'counter', count: first - second, colour: 'green' }));
  }
  return visual(...groups);
};

const promptVisual = (title: string, question: Question): LearningVisual | undefined => {
  const text = question.text;
  const stickLengths = text.match(/which stick is longest: (\d+) blocks?, (\d+) blocks?, or (\d+) blocks?/i);
  if (stickLengths) {
    const lengths = stickLengths.slice(1).map(Number);
    const sizeFor = (length: number): NonNullable<ChoiceItem['size']> =>
      length === Math.min(...lengths) ? 'small' : length === Math.max(...lengths) ? 'large' : 'medium';
    return visual(group('Compare sticks by block length', ...lengths.map(length => ({
      symbol: '🪵',
      label: `${length} blocks`,
      size: sizeFor(length),
    }))));
  }

  const crayonLengths = text.match(/(\d+) cm crayon or a (\d+) cm crayon/i);
  if (crayonLengths) {
    const [short, long] = [Number(crayonLengths[1]), Number(crayonLengths[2])];
    return visual(group('Compare the same crayon',
      { symbol: '🖍️', label: `${short} cm`, length: 'short' },
      { symbol: '🖍️', label: `${long} cm`, length: 'long' }
    ));
  }

  if (/\b(biggest|smallest|largest|small|medium|middle|large|longest|shortest)\b/i.test(text)) {
    const matchedObject = choicePatterns.find(({ pattern }) => new RegExp(pattern.source, 'i').test(text));
    const normalizedTitle = title.toLowerCase();
    const titleObject = normalizedTitle.includes('biggest and smallest')
      ? 'bottle'
      : normalizedTitle.includes('small') && normalizedTitle.includes('big')
        ? 'stick'
        : normalizedTitle.includes('big') && normalizedTitle.includes('small')
          ? 'leaf'
          : undefined;
    const object = matchedObject?.item ?? choicePatterns.find(({ item }) => item.label === titleObject)?.item;
    if (object) {
      return visual(group(`Compare the same ${object.label}`, 
        { ...object, label: `small ${object.label}`, size: 'small' },
        { ...object, label: `medium ${object.label}`, size: 'medium' },
        { ...object, label: `large ${object.label}`, size: 'large' }
      ));
    }
  }

  if (/\b(3d|solid|cube|cuboid|cylinder|sphere)\b/i.test(text)) {
    return visual(group('Solid shapes to compare',
      { symbol: '🧊', label: 'cube with six equal square faces' },
      { symbol: '📦', label: 'cuboid' },
      { symbol: '🥫', label: 'cylinder' },
      { symbol: '⚽', label: 'sphere' }
    ));
  }

  const cupSpoonMatch = text.match(/there are (\d+) cups?.*how many spoons?.*each cup/i);
  if (cupSpoonMatch) {
    const count = Number(cupSpoonMatch[1]);
    return visual(
      group('One cup for each spoon', { symbol: '🥛', label: 'cup', count }),
      group('Match one to each', { symbol: '🥄', label: 'spoon', count })
    );
  }

  if (/\b(grouped by|naming words|below the chair)\b/i.test(text)) {
    const nouns = choicePatterns.flatMap(({ pattern, item }) =>
      [...text.matchAll(pattern)].map(match => ({ index: match.index ?? 0, item, match }))
    ).sort((first, second) => first.index - second.index)
      .filter((match, index, all) => !all.slice(0, index).some(previous =>
        match.index < previous.index + previous.match[0].length
        && previous.index < match.index + match.match[0].length
      ));
    const colour = text.match(/\b(red|blue|green|yellow|orange)\b/i)?.[1].toLowerCase() as ChoiceItem['colour'] | undefined;
    if (nouns.length) {
      if (/below the chair/i.test(text)) {
        return visual(
          group('Above', { symbol: '🪑', label: 'chair' }),
          group('Below', { symbol: '⬇️', label: 'ball below the chair' }, { symbol: '⚽', label: 'ball' })
        );
      }
      return visual(group('Objects in the question', ...nouns.map(({ item }) => ({
        ...item,
        ...(colour ? { colour } : {}),
      }))));
    }
  }

  if (/\bball\b/i.test(text)) {
    return visual(group('Object in the question', { symbol: '⚽', label: 'ball' }));
  }

  const unmatchedPlates = text.match(/there are (\d+) plates? and (\d+) cups?.*how many plates have no cup/i);
  if (unmatchedPlates) {
    const [plates, cups] = [Number(unmatchedPlates[1]), Number(unmatchedPlates[2])];
    return visual(
      group('Plates', { symbol: '🍽️', label: 'plate', count: plates }),
      group('Cups', { symbol: '🥛', label: 'cup', count: cups }),
      group('No cup', { symbol: '🍽️', label: 'unmatched plate', count: Math.max(0, plates - cups), colour: 'orange' })
    );
  }

  const measurementValues = [...text.matchAll(/\b(mat|desk|jug|cup) (?:is|holds?) (\d+) ([a-z]+)/gi)];
  if (measurementValues.length > 1) {
    return visual(...measurementValues.map(([, objectName, amount, unit]) => {
      const object = choicePatterns.find(({ item }) => item.label === objectName.toLowerCase())?.item;
      return group(objectName[0].toUpperCase() + objectName.slice(1), {
        ...(object ?? { symbol: '●', label: objectName }),
        label: `${amount} ${unit}`,
      });
    }));
  }

  if (/\b(shape|triangle|circle|square|rectangle|sides|corners)\b/i.test(text)) {
    return visual(group('Shapes to compare',
      { symbol: '', label: 'circle', shape: 'circle', colour: 'blue' },
      { symbol: '', label: 'square', shape: 'square', colour: 'orange' },
      { symbol: '', label: 'triangle', shape: 'triangle', colour: 'green' },
      { symbol: '', label: 'rectangle', shape: 'rectangle', colour: 'red' }
    ));
  }

  const countedObjects = [...text.matchAll(/\b(\d+)\s+(red|blue|green|yellow)?\s*(bottle tops?|tops?|apples?|oranges?|mangoes?|bananas?|cups?|spoons?|pencils?|books?|balls?|counters?|stars?|leaves|boxes|sticks?)\b/gi)];
  if (countedObjects.length) {
    return visual(...countedObjects.map((match, index) => {
      const object = choicePatterns.find(({ pattern }) => new RegExp(pattern.source, 'i').test(match[3]));
      const colour = match[2]?.toLowerCase() as ChoiceItem['colour'] | undefined;
      return group(`Group ${index + 1}`, object
        ? { ...object.item, count: Number(match[1]), ...(colour ? { colour } : {}) }
        : { symbol: '●', label: match[3], count: Number(match[1]) }
      );
    }));
  }

  const fraction = text.match(/group of (\d+) equal counters? (?:is|are) split into (\d+)/i);
  if (fraction) {
    const total = Number(fraction[1]);
    const partCount = Number(fraction[2]);
    if (total <= 20 && partCount > 0 && total % partCount === 0) {
      return visual(...Array.from({ length: partCount }, (_, index) =>
        group(`Part ${index + 1}`, { symbol: '●', label: 'counter', count: total / partCount, colour: index === 0 ? 'green' : 'blue' })
      ));
    }
  }

  const pattern = text.match(/pattern:\s*([^?]+?)(?:,?\s*\.\.\.|\?)/i)?.[1];
  if (pattern) {
    const items = pattern.split(/,\s*/).map(token => {
      const object = choicePatterns.find(({ pattern: candidate }) => new RegExp(candidate.source, 'i').test(token));
      const colour = token.match(/\b(red|blue|green|yellow|orange)\b/i)?.[1].toLowerCase() as ChoiceItem['colour'] | undefined;
      if (object) return { ...object.item, label: token, ...(colour ? { colour } : {}) };
      if (colour) return { symbol: '●', label: token, colour };
      return undefined;
    });
    if (items.every((item): item is ChoiceItem => Boolean(item))) {
      return visual(group('Continue the pattern', ...items));
    }
  }

  const visibleStars = (text.match(/★|⭐/g) ?? []).length;
  if (visibleStars) return visual(group('Count the stars', { symbol: '⭐', label: 'star', count: visibleStars }));

  return operationVisual(text);
};

export function getQuestionVisuals(
  grade: Grade,
  subject: Subject,
  title: string,
  question: Question,
  questionIndex: number
): { visual?: LearningVisual; visualOptions?: VisualQuestionOption[] } {
  const visualOptions = question.options.map(option => {
    const optionVisual = choiceVisual(option);
    return optionVisual ? { option, visual: optionVisual } : undefined;
  });
  const completeVisualOptions = visualOptions.every(Boolean)
    ? visualOptions as VisualQuestionOption[]
    : undefined;
  return {
    visual: promptVisual(title, question),
    visualOptions: completeVisualOptions,
  };
}

export function getLessonExampleVisuals(
  grade: Grade,
  subject: Subject,
  title: string,
  exampleCount: number
): LessonExampleVisual[] {
  const topic = title.toLowerCase();
  let first: LessonExampleVisual;

  if (subject === 'Mathematics' && topic.includes('colour')) {
    first = visual(
      group('Red group', { symbol: '🔴', label: 'red top' }, { symbol: '🔴', label: 'red top' }, { symbol: '🔴', label: 'red top' }),
      group('Blue group', { symbol: '🔵', label: 'blue top' }, { symbol: '🔵', label: 'blue top' })
    );
  } else if (subject === 'Mathematics' && topic.includes('size')) {
    const object = topic.includes('ordering small')
      ? { symbol: '🪵', label: 'stick' }
      : topic.includes('ordering big')
        ? { symbol: '🍃', label: 'leaf' }
        : topic.includes('biggest')
          ? { symbol: '🍼', label: 'bottle' }
          : { symbol: '🍃', label: 'leaf' };
    first = visual(group('Compare the same object',
      { ...object, label: `small ${object.label}`, size: 'small' },
      { ...object, label: `medium ${object.label}`, size: 'medium' },
      { ...object, label: `large ${object.label}`, size: 'large' }
    ));
  } else if (subject === 'Mathematics' && (topic.includes('3d') || topic.includes('solid'))) {
    first = visual(group('Solid shapes', { symbol: '📦', label: 'box' }, { symbol: '🥫', label: 'tin' }, { symbol: '⚽', label: 'ball' }));
  } else if (subject === 'Mathematics' && topic.includes('shape')) {
    first = visual(
      group('Circles', { symbol: '●', label: 'circle', shape: 'circle', colour: 'blue' }, { symbol: '●', label: 'circle', shape: 'circle', colour: 'blue' }),
      group('Squares', { symbol: '■', label: 'square', shape: 'square', colour: 'orange' }, { symbol: '■', label: 'square', shape: 'square', colour: 'orange' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('pattern') || topic.includes('repeat'))) {
    first = topic.includes('colour')
      ? visual(group('Pattern',
          { symbol: '🔴', label: 'red' }, { symbol: '🔵', label: 'blue' },
          { symbol: '🔴', label: 'red' }, { symbol: '🔵', label: 'blue' }, { symbol: '🔴', label: 'next' }
        ))
      : visual(group('Pattern',
          { symbol: '✏️', label: 'pencil' }, { symbol: '🧽', label: 'eraser' },
          { symbol: '✏️', label: 'pencil' }, { symbol: '🧽', label: 'eraser' }, { symbol: '✏️', label: 'next pencil' }
        ));
  } else if (subject === 'Mathematics' && (topic.includes('fraction') || topic.includes('half') || topic.includes('quarter'))) {
    first = visual(
      group('One whole', { symbol: '🟩', label: 'one whole' }),
      group('Two equal halves', { symbol: '🟩', label: 'half' }, { symbol: '🟩', label: 'half' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('addition') || topic.includes('adding'))) {
    first = visual(
      group('First group', { symbol: '🍎', label: 'apple', count: 3 }),
      group('Add', { symbol: '+', label: '2 more' }, { symbol: '🍎', label: 'apple', count: 2 }),
      group('All together', { symbol: '🍎', label: 'apple', count: 5 })
    );
  } else if (subject === 'Mathematics' && (topic.includes('subtraction') || topic.includes('taking away'))) {
    first = visual(
      group('Start with', { symbol: '🍊', label: 'orange', count: 5 }),
      group('Take away', { symbol: '−', label: 'orange', count: 2 }),
      group('Left over', { symbol: '🍊', label: 'orange', count: 3 })
    );
  } else if (subject === 'Mathematics' && (topic.includes('length') || topic.includes('measur'))) {
    first = visual(
      group('Compare lengths',
        { symbol: '✏️', label: 'short pencil', length: 'short' },
        { symbol: '✏️', label: 'long pencil', length: 'long' }
      )
    );
  } else if (subject === 'Mathematics' && (topic.includes('group') || topic.includes('pair'))) {
    first = visual(group('Things that go together',
      { symbol: '✏️', label: 'pencil' }, { symbol: '✏️', label: 'pencil' },
      { symbol: '🍃', label: 'leaf' }, { symbol: '🍃', label: 'leaf' }
    ));
  } else if (subject === 'Mathematics' && topic.includes('matching')) {
    first = visual(group('Make pairs',
      { symbol: '🥄', label: 'spoon' }, { symbol: '🥛', label: 'cup' },
      { symbol: '🥄', label: 'spoon' }, { symbol: '🥛', label: 'cup' }
    ));
  } else if (subject === 'Mathematics' && (topic.includes('compar') || topic.includes('more'))) {
    first = visual(
      group('Red tops', { symbol: '🔴', label: 'top' }, { symbol: '🔴', label: 'top' }, { symbol: '🔴', label: 'top' }),
      group('Blue tops', { symbol: '🔵', label: 'top' }, { symbol: '🔵', label: 'top' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('biggest') || topic.includes('smallest') || topic.includes('ordering'))) {
    first = visual(group('Put in order',
      { symbol: '🧸', label: 'small' }, { symbol: '🧸', label: 'middle' }, { symbol: '🧸', label: 'big' }
    ));
  } else if (subject === 'Mathematics' && topic.includes('money')) {
    first = visual(
      group('Kenyan coins', { symbol: '🪙', label: '5 shillings' }, { symbol: '🪙', label: '5 shillings' }),
      group('Total', { symbol: '🪙', label: '10 shillings' })
    );
  } else if (subject === 'Mathematics' && topic.includes('time')) {
    first = visual(
      group('Clock', { symbol: '🕒', label: grade === 1 ? 'time for school' : '3 o’clock' }),
      group('Day', { symbol: '🌅', label: 'morning' }, { symbol: '🌙', label: 'night' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('mass') || topic.includes('heavy'))) {
    first = visual(group('Balance', { symbol: '⚖️', label: 'compare two things' }, { symbol: '🥭', label: 'mango' }, { symbol: '🍊', label: 'orange' }));
  } else if (subject === 'Mathematics' && (topic.includes('capacity') || topic.includes('liquid'))) {
    first = visual(group('Compare cups', { symbol: '🥛', label: 'less water' }, { symbol: '🥛', label: 'more water' }));
  } else if (subject === 'Mathematics' && (topic.includes('line') || topic.includes('geometry'))) {
    first = visual(group('Lines and shapes', { symbol: '↔️', label: 'straight' }, { symbol: '〰️', label: 'curved' }, { symbol: '△', label: 'triangle' }));
  } else if (subject === 'Mathematics' && topic.includes('multiplication')) {
    first = visual(group('3 groups of 4',
      { symbol: '● ● ● ●', label: 'group 1' },
      { symbol: '● ● ● ●', label: 'group 2' },
      { symbol: '● ● ● ●', label: 'group 3' }
    ));
  } else if (subject === 'Mathematics' && topic.includes('division')) {
    first = visual(group('Share 6 apples between 2 children',
      { symbol: '👧 🍎🍎🍎', label: '3 apples' },
      { symbol: '👦 🍎🍎🍎', label: '3 apples' }
    ));
  } else if (subject === 'Mathematics' && (topic.includes('whole number') || topic.includes('place value') || topic.includes('tens and ones'))) {
    first = grade === 1
      ? visual(
          group('One ten', { symbol: '▦', label: '10 ones' }),
          group('Four ones', ...[1, 2, 3, 4].map(number => ({ symbol: '●', label: String(number) })))
        )
      : visual(group(grade === 2 ? 'Hundreds, tens, ones' : 'Thousands, hundreds, tens, ones',
          { symbol: grade === 2 ? '2' : '3', label: grade === 2 ? 'hundreds' : 'thousands' },
          { symbol: '4', label: 'tens' }, { symbol: '6', label: 'ones' }
        ));
  } else if (subject === 'Mathematics' && topic.includes('count')) {
    first = visual(
      group('Count forwards', { symbol: '21', label: 'then 22, 23' }),
      group('Count backwards', { symbol: '25', label: 'then 24, 23' })
    );
  } else if (subject === 'Mathematics') {
    const start = grade === 1 ? 1 : grade === 2 ? 21 : 101;
    first = visual(group('Count in order',
      ...[0, 1, 2, 3, 4].map(offset => ({ symbol: String(start + offset), label: `number ${start + offset}` }))
    ));
  } else if (topic.includes('greeting') || topic.includes('salutation')) {
    first = visual(group('Kind words', { symbol: '👋', label: 'Hello!' }, { symbol: '🙂', label: 'Please.' }, { symbol: '🙏', label: 'Thank you.' }));
  } else if (topic.includes('debate') || topic.includes('discussion')) {
    first = visual(group('Talk and listen', { symbol: '👧', label: 'I think…' }, { symbol: '👦', label: 'Why?' }, { symbol: '👂', label: 'listen' }));
  } else if (topic.includes('speaking') || topic.includes('expression')) {
    first = visual(group('Tell about your day', { symbol: '👧', label: 'I went to school.' }, { symbol: '💬', label: 'Say a full sentence' }));
  } else if (topic.includes('sound') || topic.includes('phon') || topic.includes('word')) {
    first = visual(
      group('Say each sound', { symbol: 'c', label: 'sound' }, { symbol: 'a', label: 'sound' }, { symbol: 't', label: 'sound' }),
      group('Blend', { symbol: '🐈', label: 'cat' })
    );
  } else if (topic.includes('verb') || topic.includes('action')) {
    first = visual(group('Action words', { symbol: '🏃', label: 'run' }, { symbol: '🦘', label: 'jump' }, { symbol: '🍽️', label: 'eat' }));
  } else if (topic.includes('pronoun')) {
    first = visual(group('Say the name once', { symbol: '👧', label: 'Amina' }, { symbol: '➡️', label: 'she' }));
  } else if (topic.includes('noun') || topic.includes('naming')) {
    first = visual(group('Naming words', { symbol: '👧', label: 'girl' }, { symbol: '🐈', label: 'cat' }, { symbol: '📘', label: 'book' }));
  } else if (topic.includes('possessive')) {
    first = visual(group('Who owns the book?', { symbol: '👧', label: 'her book' }, { symbol: '👦', label: 'his book' }));
  } else if (topic.includes('adjective')) {
    first = visual(group('Describing words', { symbol: '🔴', label: 'red' }, { symbol: '⚽', label: 'ball' }, { symbol: '🔴⚽', label: 'red ball' }));
  } else if (topic.includes('conjunction')) {
    first = visual(group('Join the ideas', { symbol: '🌧️', label: 'It is raining' }, { symbol: 'because', label: 'joining word' }, { symbol: '☔', label: 'I have an umbrella' }));
  } else if (topic.includes('paragraph')) {
    first = visual(group('Ideas about school', { symbol: '🏫', label: 'My school is big.' }, { symbol: '📚', label: 'I read books.' }, { symbol: '⚽', label: 'I play at break.' }));
  } else if (topic.includes('instruction')) {
    first = visual(group('Do the steps in order', { symbol: '1', label: 'Pick up a book' }, { symbol: '2', label: 'Put it on the desk' }));
  } else if (topic.includes('pre-writing') || topic.includes('handwriting')) {
    first = visual(group('Pencil practice', { symbol: '〰️', label: 'trace a line' }, { symbol: '✏️', label: 'hold a pencil' }, { symbol: 'Aa', label: 'write a letter' }));
  } else if (topic.includes('functional writing')) {
    first = visual(group('Write a message', { symbol: '📝', label: 'Dear Amina,' }, { symbol: '🎉', label: 'Come to my party!' }, { symbol: '📅', label: 'Saturday' }));
  } else if (topic.includes('preposition')) {
    first = visual(group('Where is the ball?', { symbol: '🪑', label: 'chair' }, { symbol: '⚽', label: 'under it' }));
  } else if (topic.includes('articles')) {
    first = visual(group('Choose a or an', { symbol: '🥭', label: 'a mango' }, { symbol: '🥚', label: 'an egg' }));
  } else if (topic.includes('plural')) {
    first = visual(
      group('One', { symbol: '🥭', label: 'a mango' }),
      group('More than one', { symbol: '🥭🥭', label: 'mangoes' })
    );
  } else if (topic.includes('present continuous')) {
    first = visual(group('Happening now', { symbol: '👧', label: 'is walking' }, { symbol: '👦', label: 'are playing' }));
  } else if (topic.includes('past tense') || topic.includes('simple past')) {
    first = visual(
      group('Yesterday', { symbol: '🚶', label: 'walked' }),
      group('Today', { symbol: '🚶', label: 'walks' })
    );
  } else if (topic.includes('creative writing')) {
    first = visual(group('A story', { symbol: '👧', label: 'Who?' }, { symbol: '🏫', label: 'Where?' }, { symbol: '📖', label: 'What happens?' }));
  } else if (topic.includes('punctuation') || topic.includes('sentence') || topic.includes('writing')) {
    first = visual(group('A sentence', { symbol: '✏️', label: 'The cat is here.' }, { symbol: '.', label: 'full stop' }));
  } else if (topic.includes('pre-reading') || topic.includes('reading') || topic.includes('fluency')) {
    first = visual(group('Read from left to right', { symbol: '📖', label: 'Look at the words' }, { symbol: '➡️', label: 'keep going' }));
  } else if (topic.includes('instruction')) {
    first = visual(group('Do the steps in order', { symbol: '1', label: 'Pick up a book' }, { symbol: '2', label: 'Put it on the desk' }));
  } else if (topic.includes('vocabulary')) {
    first = visual(group('New words', { symbol: '🏠', label: 'home' }, { symbol: '🏥', label: 'clinic' }, { symbol: '🏫', label: 'school' }));
  } else if (topic.includes('comprehension') || topic.includes('story')) {
    first = visual(group('Story clues', { symbol: '📖', label: 'read the words' }, { symbol: '👧', label: 'find who' }, { symbol: '🐕', label: 'find what' }));
  } else {
    first = visual(group('Story time', { symbol: '📖', label: 'story' }, { symbol: '👧', label: 'person' }, { symbol: '🐕', label: 'animal' }));
  }

  let second = visual(...first.groups.map(currentGroup => ({
    ...currentGroup,
    items: [...currentGroup.items].reverse(),
  })));
  if (exampleCount > 1 && topic.includes('colour')) {
    second = visual(group('Red group',
      { symbol: '🔴', label: 'red ball' },
      { symbol: '🔴', label: 'red cup' }
    ));
  } else if (exampleCount > 1 && topic.includes('shape')) {
    second = visual(group('Triangles',
      { symbol: '▲', label: 'triangle', shape: 'triangle', colour: 'green' },
      { symbol: '▲', label: 'triangle', shape: 'triangle', colour: 'green' },
      { symbol: '▲', label: 'triangle', shape: 'triangle', colour: 'green' }
    ));
  } else if (exampleCount > 1 && topic.includes('size')) {
    const object = topic.includes('ordering small')
      ? { symbol: '🪵', label: 'stick' }
      : topic.includes('ordering big')
        ? { symbol: '🍃', label: 'leaf' }
        : topic.includes('biggest')
          ? { symbol: '🍼', label: 'bottle' }
          : { symbol: '🍃', label: 'leaf' };
    second = visual(group('Same object, different size',
      { ...object, label: `small ${object.label}`, size: 'small' },
      { ...object, label: `large ${object.label}`, size: 'large' }
    ));
  }
  return exampleCount > 1 ? [first, second] : [first];
}