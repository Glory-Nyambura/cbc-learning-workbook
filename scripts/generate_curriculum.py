#!/usr/bin/env python3
"""Generate a draft Grade 1-3 CBC workbook database and its documentation."""

from __future__ import annotations

import argparse
import json
import random
import sqlite3
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Topic:
    strand: str
    title: str
    outcome: str
    example: str
    key_idea: str
    wrong_ideas: tuple[str, str, str]


def load_topics() -> dict[tuple[int, str], list[Topic]]:
    catalog_path = Path(__file__).with_name("curriculum_topics.json")
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    wrong_ideas = (
        "ignore the important details in the example",
        "use an unrelated rule or operation",
        "skip checking the result against the task",
    )
    return {
        (int(grade), subject): [
            Topic(
                item["strand"], item["title"], item["outcome"],
                item["example"], item["key_idea"], wrong_ideas,
            )
            for item in topics
        ]
        for grade, subjects in catalog.items()
        for subject, topics in subjects.items()
    }


TOPICS = load_topics()


QUESTION_DIFFICULTIES = {
    "multiple_choice": ("easy", "easy", "medium", "challenge"),
    "true_false": ("easy", "easy", "medium", "challenge"),
    "fill_blank": ("easy", "medium", "medium", "challenge"),
    "scenario": ("easy", "easy", "medium", "challenge"),
    "challenge": ("medium", "medium", "challenge", "challenge"),
}

TABLES = ("curriculum_units", "lessons", "questions", "curriculum_coverage", "sources", "data_dictionary")
EXPECTED_TOPIC_COUNTS = {
    (1, "Mathematics"): 23,
    (2, "Mathematics"): 14,
    (3, "Mathematics"): 14,
    (1, "English"): 12,
    (2, "English"): 13,
    (3, "English"): 11,
}


def validate_catalog() -> None:
    expected = {(grade, subject) for grade in range(1, 4) for subject in ("Mathematics", "English")}
    if set(TOPICS) != expected:
        raise ValueError("Topic catalog must include Mathematics and English for Grades 1-3.")
    for key, expected_count in EXPECTED_TOPIC_COUNTS.items():
        actual_count = len(TOPICS[key])
        if actual_count != expected_count:
            raise ValueError(f"{key}: expected {expected_count} topics, found {actual_count}.")
    for key, group in TOPICS.items():
        if any(len(topic.wrong_ideas) != 3 for topic in group):
            raise ValueError(f"{key}: every topic must define exactly three distractors.")


def question_rows(lesson_id: str, grade: int, subject: str, topic: Topic) -> list[tuple]:
    rows = []
    wrong = list(topic.wrong_ideas)
    statements = [
        (f"A useful idea for {topic.title.lower()} is: {topic.key_idea}.", "True", topic.key_idea),
        (f"When practising {topic.title.lower()}, a learner should {wrong[0]}.", "False", topic.key_idea),
        (f"Example: {topic.example}", "True", topic.key_idea),
        (f"The best approach to {topic.title.lower()} is to {wrong[1]}.", "False", topic.key_idea),
    ]
    type_prompts = {
        "multiple_choice": [
            f"Which action is most useful for {topic.title.lower()}?",
            f"Choose the best answer: {topic.example} What key idea does this show?",
            f"Which statement best supports this outcome: {topic.outcome}",
            f"Select the correct key idea for {topic.title.lower()}.",
        ],
        "fill_blank": [
            f"Complete the key idea: For {topic.title.lower()}, remember to ______.",
            f"Fill in the missing action: {topic.title}: ______.",
            f"Complete this reminder: A learner should ______.",
            f"Write the key action for {topic.title.lower()}: ______.",
        ],
        "scenario": [
            f"A learner is practising {topic.title.lower()}. {topic.example} What should the learner remember?",
            f"During a {topic.title.lower()} activity, a learner is unsure what to do. Which key idea will help?",
            f"A class is working on this outcome: {topic.outcome} What should they focus on?",
            f"Use this example: {topic.example} Which action should the learner take?",
        ],
        "challenge": [
            f"Challenge: Explain why this idea helps with {topic.title.lower()}: {topic.key_idea}.",
            f"Challenge: Apply {topic.title.lower()} to this example: {topic.example} State the key action.",
            f"Challenge: Describe how you would meet this outcome: {topic.outcome}",
            f"Challenge: Give a reason to use this approach: {topic.key_idea}.",
        ],
    }

    for question_type, difficulties in QUESTION_DIFFICULTIES.items():
        for variant, difficulty in enumerate(difficulties, start=1):
            question_id = f"{lesson_id}-q-{question_type}-{variant:02d}"
            if question_type == "multiple_choice":
                prompt = type_prompts[question_type][variant - 1]
                options = [topic.key_idea, *wrong]
                answer = topic.key_idea
                explanation = f"{topic.key_idea}. {topic.example}"
            elif question_type == "true_false":
                prompt, answer, explanation = statements[variant - 1]
                options = ["True", "False"]
            elif question_type == "fill_blank":
                prompt = type_prompts[question_type][variant - 1]
                options = []
                answer = topic.key_idea
                explanation = f"{topic.key_idea}. {topic.example}"
            elif question_type == "scenario":
                prompt = type_prompts[question_type][variant - 1]
                options = [topic.key_idea, *wrong]
                answer = topic.key_idea
                explanation = f"{topic.key_idea}. {topic.example}"
            else:
                prompt = type_prompts[question_type][variant - 1]
                options = []
                answer = [
                    f"It helps because learners should {topic.key_idea.lower()}. {topic.example}",
                    f"For this example, learners should {topic.key_idea.lower()}.",
                    f"{topic.outcome} For example, {topic.example}",
                    f"This approach works because learners should {topic.key_idea.lower()}. {topic.example}",
                ][variant - 1]
                explanation = answer

            rng = random.Random(question_id)
            if options and question_type != "true_false":
                rng.shuffle(options)
            hint = f"Think about the example: {topic.example}"
            rows.append((
                question_id, lesson_id, grade, subject, difficulty, question_type,
                prompt, json.dumps(options, ensure_ascii=True), answer, explanation,
                hint, topic.strand,
            ))
    return rows


def create_schema(connection: sqlite3.Connection) -> None:
    connection.executescript("""
        PRAGMA foreign_keys = ON;
        CREATE TABLE curriculum_units (
            id TEXT PRIMARY KEY,
            grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 3),
            subject TEXT NOT NULL CHECK (subject IN ('Mathematics', 'English')),
            strand TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            UNIQUE (grade, subject, title)
        );
        CREATE TABLE lessons (
            id TEXT PRIMARY KEY,
            unit_id TEXT NOT NULL UNIQUE REFERENCES curriculum_units(id),
            title TEXT NOT NULL,
            learning_outcome TEXT NOT NULL,
            explanation TEXT NOT NULL,
            example TEXT NOT NULL,
            guided_activity TEXT NOT NULL,
            independent_activity TEXT NOT NULL,
            summary TEXT NOT NULL
        );
        CREATE TABLE questions (
            id TEXT PRIMARY KEY,
            lesson_id TEXT NOT NULL REFERENCES lessons(id),
            grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 3),
            subject TEXT NOT NULL CHECK (subject IN ('Mathematics', 'English')),
            difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'challenge')),
            question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'scenario', 'challenge')),
            prompt TEXT NOT NULL,
            options_json TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT NOT NULL,
            hint TEXT NOT NULL,
            context TEXT NOT NULL
        );
        CREATE TABLE curriculum_coverage (
            grade INTEGER NOT NULL,
            subject TEXT NOT NULL,
            unit_count INTEGER NOT NULL,
            lesson_count INTEGER NOT NULL,
            question_count INTEGER NOT NULL,
            PRIMARY KEY (grade, subject)
        );
        CREATE TABLE sources (
            id TEXT PRIMARY KEY,
            source_name TEXT NOT NULL,
            source_type TEXT NOT NULL,
            source_url TEXT,
            notes TEXT NOT NULL
        );
        CREATE TABLE data_dictionary (
            table_name TEXT NOT NULL,
            field_name TEXT NOT NULL,
            data_type TEXT NOT NULL,
            description TEXT NOT NULL,
            PRIMARY KEY (table_name, field_name)
        );
        CREATE INDEX idx_units_grade_subject ON curriculum_units(grade, subject, strand);
        CREATE INDEX idx_lessons_unit ON lessons(unit_id);
        CREATE INDEX idx_questions_lesson_difficulty ON questions(lesson_id, difficulty);
        CREATE INDEX idx_questions_lesson_type ON questions(lesson_id, question_type);
    """)


DICTIONARY = {
    "curriculum_units": [
        ("id", "TEXT", "Stable identifier for a curriculum unit."),
        ("grade", "INTEGER", "Learner grade, from 1 to 3."),
        ("subject", "TEXT", "Learning area: Mathematics or English."),
        ("strand", "TEXT", "Curriculum strand grouping related topics."),
        ("title", "TEXT", "Unit title."),
        ("description", "TEXT", "Short unit learning focus."),
    ],
    "lessons": [
        ("id", "TEXT", "Stable identifier for a lesson."),
        ("unit_id", "TEXT", "Parent curriculum unit identifier."),
        ("title", "TEXT", "Lesson title."),
        ("learning_outcome", "TEXT", "Expected learner outcome."),
        ("explanation", "TEXT", "Draft concept explanation."),
        ("example", "TEXT", "Worked or contextual example."),
        ("guided_activity", "TEXT", "Suggested supported practice."),
        ("independent_activity", "TEXT", "Suggested independent practice."),
        ("summary", "TEXT", "Lesson recap."),
    ],
    "questions": [
        ("id", "TEXT", "Stable question identifier."),
        ("lesson_id", "TEXT", "Lesson this question assesses."),
        ("grade", "INTEGER", "Learner grade."),
        ("subject", "TEXT", "Learning area."),
        ("difficulty", "TEXT", "easy, medium, or challenge."),
        ("question_type", "TEXT", "multiple_choice, true_false, fill_blank, scenario, or challenge."),
        ("prompt", "TEXT", "Question text."),
        ("options_json", "TEXT", "JSON array of answer choices; empty for open response."),
        ("correct_answer", "TEXT", "Expected answer."),
        ("explanation", "TEXT", "Answer explanation."),
        ("hint", "TEXT", "Learner-facing hint."),
        ("context", "TEXT", "Strand or lesson context."),
    ],
    "curriculum_coverage": [
        ("grade", "INTEGER", "Grade in the coverage summary."),
        ("subject", "TEXT", "Learning area in the coverage summary."),
        ("unit_count", "INTEGER", "Number of curriculum units."),
        ("lesson_count", "INTEGER", "Number of lessons."),
        ("question_count", "INTEGER", "Number of questions."),
    ],
    "sources": [
        ("id", "TEXT", "Stable source record identifier."),
        ("source_name", "TEXT", "Name of the content source or generation method."),
        ("source_type", "TEXT", "Reference category, such as generated or user_provided."),
        ("source_url", "TEXT", "Optional source URL."),
        ("notes", "TEXT", "Attribution and verification notes."),
    ],
    "data_dictionary": [
        ("table_name", "TEXT", "Database table documented by this row."),
        ("field_name", "TEXT", "Field documented by this row."),
        ("data_type", "TEXT", "SQLite storage type."),
        ("description", "TEXT", "Meaning of the field."),
    ],
}


def populate(connection: sqlite3.Connection) -> None:
    for (grade, subject), topics in TOPICS.items():
        for index, topic in enumerate(topics, start=1):
            prefix = f"g{grade}_{'math' if subject == 'Mathematics' else 'english'}"
            unit_id = f"{prefix}_u{index:02d}"
            lesson_id = f"{prefix}_l{index:02d}"
            outcome = topic.outcome
            connection.execute(
                "INSERT INTO curriculum_units VALUES (?, ?, ?, ?, ?, ?)",
                (unit_id, grade, subject, topic.strand, topic.title, outcome),
            )
            connection.execute(
                "INSERT INTO lessons VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    lesson_id, unit_id, topic.title, outcome,
                    f"{outcome} {topic.example}", topic.example,
                    f"Discuss this example together: {topic.example}",
                    f"Practise the key idea independently: {topic.key_idea}.",
                    f"Remember: {topic.key_idea}.",
                ),
            )
            connection.executemany(
                "INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                question_rows(lesson_id, grade, subject, topic),
            )
        connection.execute(
            "INSERT INTO curriculum_coverage VALUES (?, ?, ?, ?, ?)",
            (grade, subject, len(topics), len(topics), len(topics) * 20),
        )

    connection.executemany(
        "INSERT INTO sources VALUES (?, ?, ?, ?, ?)",
        [
            ("src-generated", "Workbook generator topic catalog", "generated", None,
               "Questions are generated from the supplied grade-by-grade topic catalog. Content is a draft and needs educator review."),
              ("src-user-syllabus", "User-provided Lower Primary CBC syllabus breakdown", "user_provided", None,
               "Topics, grade levels, strands, outcomes, and examples were structured from the syllabus breakdown supplied for this task; current official curriculum alignment has not been independently verified."),
        ],
    )
    connection.executemany(
        "INSERT INTO data_dictionary VALUES (?, ?, ?, ?)",
        [(table, field, data_type, description)
         for table, fields in DICTIONARY.items()
         for field, data_type, description in fields],
    )


def verify(connection: sqlite3.Connection) -> None:
    lesson_count = sum(EXPECTED_TOPIC_COUNTS.values())
    expected_counts = {
        "curriculum_units": lesson_count,
        "lessons": lesson_count,
        "questions": lesson_count * 20,
        "curriculum_coverage": 6,
        "sources": 2,
    }
    for table, expected in expected_counts.items():
        actual = connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        if actual != expected:
            raise RuntimeError(f"{table}: expected {expected} rows, found {actual}.")
    invalid_lessons = connection.execute(
        "SELECT lesson_id, COUNT(*) FROM questions GROUP BY lesson_id HAVING COUNT(*) != 20"
    ).fetchall()
    if invalid_lessons:
        raise RuntimeError(f"Every lesson must have 20 questions; invalid groups: {invalid_lessons}")
    invalid_coverage = connection.execute(
        "SELECT grade, subject FROM curriculum_coverage WHERE unit_count != lesson_count OR question_count != lesson_count * 20"
    ).fetchall()
    if invalid_coverage:
        raise RuntimeError(f"Coverage totals do not balance: {invalid_coverage}")
    coverage_counts = connection.execute(
        "SELECT grade, subject, unit_count FROM curriculum_coverage"
    ).fetchall()
    actual_coverage = {(grade, subject): count for grade, subject, count in coverage_counts}
    if actual_coverage != EXPECTED_TOPIC_COUNTS:
        raise RuntimeError(f"Grade and subject coverage does not match the supplied syllabus: {actual_coverage}")
    foreign_key_errors = connection.execute("PRAGMA foreign_key_check").fetchall()
    if foreign_key_errors:
        raise RuntimeError(f"Foreign key check failed: {foreign_key_errors}")


def write_docs(output_dir: Path) -> None:
    readme = """# Generated CBC Learning Workbook Database

This directory contains `curriculum.db`, a SQLite database for a draft Grade 1-3 workbook.
It has separate curriculum units and lessons, with 20 linked questions per lesson.
The source syllabus catalog is `scripts/curriculum_topics.json`; each supplied topic
becomes one unit and one lesson.

## Generate

From the project root, run:

```bash
python3 scripts/generate_curriculum.py
```

The default output directory is `generated_curriculum/`. Use `--output-dir PATH` to
choose another location. Use `--force` only when you intend to replace an existing
`curriculum.db` and generated documentation in that output directory.

## Content flow

Filter `curriculum_units` by `grade`, `subject`, and `strand`; load its lesson from
`lessons`; then select a random subset from `questions` for that lesson. For example:

```sql
SELECT q.*
FROM questions AS q
WHERE q.lesson_id = ?
ORDER BY RANDOM()
LIMIT ?;
```

Question difficulty and type are separate fields, so an API can filter either or both.
The database is an importable content source; this generator does not change the app's
current TypeScript-backed `/api/curriculum` route.

## Tables and totals

- `curriculum_units`: 76 rows
- `lessons`: 76 rows
- `questions`: 1,520 rows, exactly 20 per lesson
- `curriculum_coverage`: one row per grade and subject
- `sources`: generation and curriculum-reference notes
- `data_dictionary`: field descriptions; see also `DATA_DICTIONARY.md`

Each lesson has 7 easy, 7 medium, and 6 challenge questions across five question
types: multiple choice, true/false, fill in the blank, scenario, and challenge.

## Content quality

This is a generated draft based on the user-provided syllabus breakdown, not an official
curriculum publication. Review learning outcomes, examples, answer keys, difficulty,
language level, and alignment with current official curriculum designs before using it
with learners.
"""
    dictionary_lines = [
        "# Data Dictionary", "", "Generated SQLite schema fields and their meanings.",
        "", "| Table | Field | SQLite type | Description |", "|---|---|---|---|",
    ]
    for table, fields in DICTIONARY.items():
        for field, data_type, description in fields:
            safe_description = description.replace("|", "\\|")
            dictionary_lines.append(f"| `{table}` | `{field}` | `{data_type}` | {safe_description} |")
    (output_dir / "README.md").write_text(readme, encoding="utf-8")
    (output_dir / "DATA_DICTIONARY.md").write_text("\n".join(dictionary_lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir", type=Path,
        default=Path(__file__).resolve().parents[1] / "generated_curriculum",
        help="Directory for curriculum.db, README.md, and DATA_DICTIONARY.md.",
    )
    parser.add_argument("--force", action="store_true", help="Replace generated output files if they already exist.")
    args = parser.parse_args()

    validate_catalog()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    database_path = args.output_dir / "curriculum.db"
    if database_path.exists() and not args.force:
        parser.error(f"{database_path} already exists; pass --force to replace generated output.")
    if args.force:
        database_path.unlink(missing_ok=True)

    connection = sqlite3.connect(database_path)
    try:
        create_schema(connection)
        with connection:
            populate(connection)
            verify(connection)
    finally:
        connection.close()

    write_docs(args.output_dir)
    lesson_count = sum(len(topics) for topics in TOPICS.values())
    print(f"Generated {database_path}")
    print(f"Verified {lesson_count} units, {lesson_count} lessons, and {lesson_count * 20} questions (20 per lesson).")


if __name__ == "__main__":
    main()