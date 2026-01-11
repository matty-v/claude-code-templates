import { vi } from 'vitest'

// Set test environment variables
process.env.API_KEY = 'test-api-key'
process.env.NODE_ENV = 'test'

// Mock Firestore
vi.mock('@google-cloud/firestore', () => {
  const mockData: Record<string, Record<string, unknown>[]> = {
    items: [],
  }

  return {
    Firestore: vi.fn().mockImplementation(() => ({
      collection: vi.fn().mockImplementation((name: string) => ({
        get: vi.fn().mockResolvedValue({
          docs: mockData[name]?.map((item, index) => ({
            id: `item-${index}`,
            data: () => item,
            exists: true,
          })) || [],
        }),
        doc: vi.fn().mockImplementation((id: string) => ({
          get: vi.fn().mockResolvedValue({
            id,
            exists: mockData[name]?.some((_, i) => `item-${i}` === id) || false,
            data: () => mockData[name]?.find((_, i) => `item-${i}` === id) || null,
          }),
          update: vi.fn().mockResolvedValue(undefined),
          delete: vi.fn().mockResolvedValue(undefined),
        })),
        add: vi.fn().mockResolvedValue({ id: 'new-item-id' }),
      })),
    })),
  }
})
