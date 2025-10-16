// Minimal mock for createClient used in tests
export function createClient() {
  // naive in-memory stub with chainable .from().insert()
  const store = {
    from: () => ({
      insert: async (rows) => ({ data: rows, error: null }),
      select: async () => ({ data: [], error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
  };
  return store;
}
