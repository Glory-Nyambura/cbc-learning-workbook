const api = {
  async get(path: string) {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`GET ${path} failed: ${response.status}`);
    }

    return response.json();
  },

  async post(path: string, data: unknown) {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`POST ${path} failed: ${response.status}`);
    }

    return response.json();
  },
};

export { api };
