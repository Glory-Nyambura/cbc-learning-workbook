import { router, json, error, db } from '@appdeploy/sdk';
import { type Grade, type Subject } from '../src/data/curriculum';
import { curriculum } from '../src/data/syllabusCurriculum';

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
    async ({ query }: any) => {
      const profileId = typeof query?.profileId === 'string' ? query.profileId.trim() : '';
      if (!profileId) return error('A learner profile ID is required.', 400);
      const { items } = await db.list(table, { limit: 100 });
      const record = items.find((item: any) => item.profileId === profileId);
      return json({ progress: record?.progress || {} });
    },
  ],
  'POST /api/progress': [
    async ({ body }) => {
      const payload = body as { profileId?: string; progress?: Record<string, number> };
      const profileId = payload?.profileId?.trim();
      if (!profileId) return error('A learner profile ID is required.', 400);
      if (!payload?.progress || typeof payload.progress !== 'object') {
        return error('Progress must be an object.', 400);
      }
      const { items } = await db.list(table, { limit: 100 });
      const current = items.find((item: any) => item.profileId === profileId);
      if (!current) {
        const [id] = await db.add(table, [
          { profileId, progress: payload.progress, updatedAt: new Date().toISOString() },
        ]);
        if (!id) return error('Could not save progress.', 500);
      } else {
        const ok = await db.update(table, [
          {
            id: current.id,
            record: {
              profileId,
              progress: payload.progress,
              updatedAt: new Date().toISOString(),
            },
          },
        ]);
        if (!ok[0]) return error('Could not save progress.', 500);
      }
      return json({ saved: true, profileId, progress: payload.progress });
    },
  ],
});
