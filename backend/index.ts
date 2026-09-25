import { router, json, error, db } from '@appdeploy/sdk';
import { curriculum, type Grade, type Subject } from '../src/data/curriculum';

const table = 'learner_progress';

const normalizeGrade = (value: string | number | undefined): Grade | null => {
  const grade = Number(value);
  return [1, 2, 3].includes(grade) ? (grade as Grade) : null;
};

const normalizeSubject = (value: string | undefined): Subject | null => {
  return value === 'Mathematics' || value === 'English' ? value : null;
};

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success' })],
  'GET /api/curriculum': [
    async ({ query }: any) => {
      const grade = normalizeGrade(query?.grade ?? query?.gradeId);
      const subject = normalizeSubject(query?.subject);

      if (grade && subject) {
        return json({ grade, subject, data: curriculum[grade][subject] });
      }

      if (grade) {
        return json({ grade, data: curriculum[grade] });
      }

      return json({ data: curriculum });
    },
  ],
  'GET /api/progress': [
    async () => {
      const { items } = await db.list(table, { limit: 1 });
      return json({ progress: items[0]?.progress || {} });
    },
  ],
  'POST /api/progress': [
    async ({ body }) => {
      const payload = body as { progress?: Record<string, number> };
      if (!payload?.progress || typeof payload.progress !== 'object') {
        return error('Progress must be an object.', 400);
      }
      const { items } = await db.list(table, { limit: 1 });
      if (!items.length) {
        const [id] = await db.add(table, [
          { progress: payload.progress, updatedAt: new Date().toISOString() },
        ]);
        if (!id) return error('Could not save progress.', 500);
      } else {
        const current = items[0];
        const ok = await db.update(table, [
          {
            id: current.id,
            record: {
              progress: payload.progress,
              updatedAt: new Date().toISOString(),
            },
          },
        ]);
        if (!ok[0]) return error('Could not save progress.', 500);
      }
      return json({ saved: true, progress: payload.progress });
    },
  ],
});
