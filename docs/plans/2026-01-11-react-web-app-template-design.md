# React Web App Template Design

## Overview

A template for building React web applications with TypeScript, Tailwind CSS, and modern tooling.

## Key Decisions

| Aspect | Decision |
|--------|----------|
| Build | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + CSS variables (light/dark mode) |
| Components | Radix UI + CVA (8 components) |
| Routing | React Router |
| Data Fetching | TanStack Query + REST API client |
| Unit Tests | Vitest + jsdom |
| E2E Tests | Playwright |
| Deployment | Firebase Hosting |
| CI/CD | GitHub Actions |

## Directory Structure

```
templates/react-web-app/
├── .claude/
│   └── settings.local.json
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Tests on PR
│       └── deploy.yml             # Deploy to Firebase on merge
├── docs/
│   └── plans/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/                    # Radix + CVA primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── label.tsx
│   │   └── layout/
│   │       └── root-layout.tsx
│   ├── hooks/
│   │   └── use-example.ts         # TanStack Query example
│   ├── lib/
│   │   ├── api.ts                 # REST API client
│   │   └── utils.ts               # cn() helper
│   ├── pages/
│   │   ├── home.tsx
│   │   └── example.tsx
│   ├── App.tsx                    # Router setup
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind + theme variables
├── tests/
│   ├── unit/
│   │   ├── setup.ts
│   │   └── utils.test.ts
│   └── e2e/
│       └── home.spec.ts
├── CLAUDE.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vitest.config.ts
├── playwright.config.ts
├── firebase.json
└── .firebaserc
```

## Styling & Theming

### Tailwind Config

HSL CSS variable-based colors following shadcn/ui conventions:
- background, foreground
- primary, primary-foreground
- secondary, secondary-foreground
- muted, muted-foreground
- accent, accent-foreground
- card, card-foreground
- border, input, ring

Dark mode via class strategy.

### CSS Variables (index.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --primary: 222 47% 11%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 222 47% 11%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    /* ... dark variants */
  }
}
```

## Component Library

8 UI components using Radix primitives + CVA:

| Component | Radix Primitive | Purpose |
|-----------|-----------------|---------|
| Button | Slot | Actions, form submission |
| Input | - | Form text inputs |
| Label | @radix-ui/react-label | Form labels |
| Card | - | Content containers |
| Dialog | @radix-ui/react-dialog | Modals |
| Select | @radix-ui/react-select | Dropdowns |
| Tabs | @radix-ui/react-tabs | Tabbed content |
| Toast | @radix-ui/react-toast | Notifications |

### Button Example (CVA pattern)

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)
```

## Data Fetching

### API Client (src/lib/api.ts)

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
```

### TanStack Query Hooks

```typescript
export function useItems() {
  return useQuery({ queryKey: ['items'], queryFn: () => api.get<Item[]>('/items') })
}

export function useCreateItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Item, 'id'>) => api.post<Item>('/items', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
}
```

## Testing

### Vitest (Unit Tests)

- Environment: jsdom
- Setup file for React testing
- Path alias support (@/)

```typescript
// tests/unit/utils.test.ts
describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })
})
```

### Playwright (E2E Tests)

- Configured webServer to run dev server
- Tests in tests/e2e/

```typescript
// tests/e2e/home.spec.ts
test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
```

## CI/CD

### CI Workflow

Triggers on PR and push to main:
1. Setup Node 20
2. Install dependencies
3. Lint
4. Run Vitest unit tests
5. Install Playwright browsers
6. Run Playwright E2E tests
7. Build check

### Deploy Workflow

Triggers on push to main:
1. Build production bundle
2. Deploy to Firebase Hosting

## Firebase Hosting

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

SPA rewrite rule ensures React Router works correctly.

## npm Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "lint": "eslint .",
  "deploy": "npm run build && firebase deploy"
}
```

## Path Alias

`@/` maps to `./src/` in:
- tsconfig.json
- vite.config.ts
- vitest.config.ts

## References

Based on patterns from existing projects:
- budget-app (Radix + CVA components, TanStack Query)
- travel-guide (React Router, Playwright testing)
- voget-io (Tailwind theming with CSS variables)
