import type { Grade, LessonExampleVisual, Subject } from './curriculum';

const visual = (...groups: LessonExampleVisual['groups']): LessonExampleVisual => ({
  caption: 'Look at the picture. It shows the example.',
  groups,
});

const group = (label: string, ...items: { symbol: string; label: string; length?: 'short' | 'long' }[]) => ({ label, items });

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
    first = visual(
      group('Big', { symbol: '🍃', label: 'big leaf' }, { symbol: '📦', label: 'big box' }),
      group('Small', { symbol: '🍃', label: 'small leaf' }, { symbol: '📦', label: 'small box' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('3d') || topic.includes('solid'))) {
    first = visual(group('Solid shapes', { symbol: '📦', label: 'box' }, { symbol: '🥫', label: 'tin' }, { symbol: '⚽', label: 'ball' }));
  } else if (subject === 'Mathematics' && topic.includes('shape')) {
    first = visual(
      group('Circles', { symbol: '●', label: 'circle' }, { symbol: '●', label: 'circle' }),
      group('Squares', { symbol: '■', label: 'square' }, { symbol: '■', label: 'square' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('pattern') || topic.includes('repeat'))) {
    first = visual(group('Pattern',
      { symbol: '🔴', label: 'red' }, { symbol: '🔵', label: 'blue' },
      { symbol: '🔴', label: 'red' }, { symbol: '🔵', label: 'blue' }, { symbol: '🔴', label: 'next' }
    ));
  } else if (subject === 'Mathematics' && (topic.includes('fraction') || topic.includes('half') || topic.includes('quarter'))) {
    first = visual(
      group('One whole', { symbol: '🟩', label: 'one whole' }),
      group('Two equal halves', { symbol: '🟩', label: 'half' }, { symbol: '🟩', label: 'half' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('addition') || topic.includes('adding'))) {
    first = visual(
      group('First group', { symbol: '🍎', label: '3 apples' }),
      group('Add', { symbol: '+', label: '2 more' }),
      group('All together', { symbol: '🍎', label: '5 apples' })
    );
  } else if (subject === 'Mathematics' && (topic.includes('subtraction') || topic.includes('taking away'))) {
    first = visual(
      group('Start with', { symbol: '🍊', label: '5 oranges' }),
      group('Take away', { symbol: '−', label: '2 oranges' }),
      group('Left over', { symbol: '🍊', label: '3 oranges' })
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
      { symbol: '▲', label: '3 sides' },
      { symbol: '▲', label: '3 sides' },
      { symbol: '▲', label: '3 sides' }
    ));
  } else if (exampleCount > 1 && topic.includes('size')) {
    second = visual(
      group('Big', { symbol: '🍃', label: 'big leaf' }),
      group('Small', { symbol: '🍃', label: 'small leaf' })
    );
  }
  return exampleCount > 1 ? [first, second] : [first];
}