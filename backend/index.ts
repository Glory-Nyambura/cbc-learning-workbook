import { router, json, error, db } from '@appdeploy/sdk';

const table = 'learner_progress';

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success' })],
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
