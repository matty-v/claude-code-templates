# React Web App Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a fully functional React web app template with Vite, Tailwind, Radix/CVA components, TanStack Query, Vitest + Playwright testing, and Firebase Hosting.

**Architecture:** Vite-powered React app with TypeScript. Component library using Radix primitives with CVA variants. TanStack Query for data fetching with a generic REST API client. Dual testing approach with Vitest for unit tests and Playwright for E2E.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI, CVA, TanStack Query, Vitest, Playwright, Firebase Hosting

---

## Task 1: Create Template Directory Structure

**Files:**
- Create: `templates/react-web-app/` (directory structure)
- Create: `templates/react-web-app/.gitignore`
- Create: `templates/react-web-app/.env.example`

**Step 1: Create directory structure**

```bash
mkdir -p templates/react-web-app/{src/{components/{ui,layout},hooks,lib,pages},tests/{unit,e2e},public,.claude,.github/workflows,docs/plans}
```

**Step 2: Create .gitignore**

Create `templates/react-web-app/.gitignore`:
```
node_modules/
dist/
.env
*.log
.DS_Store
coverage/
.firebase/
playwright-report/
test-results/
```

**Step 3: Create .env.example**

Create `templates/react-web-app/.env.example`:
```
VITE_API_URL=http://localhost:3000
```

**Step 4: Create favicon**

Create `templates/react-web-app/public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0ea5e9"/>
  <text x="50" y="70" font-size="60" text-anchor="middle" fill="white">R</text>
</svg>
```

**Step 5: Commit**

```bash
git add templates/react-web-app/
git commit -m "feat: scaffold React web app template directory structure"
```

---

## Task 2: Create Package Configuration

**Files:**
- Create: `templates/react-web-app/package.json`
- Create: `templates/react-web-app/tsconfig.json`
- Create: `templates/react-web-app/tsconfig.node.json`
- Create: `templates/react-web-app/vite.config.ts`

**Step 1: Create package.json**

Create `templates/react-web-app/package.json`:
```json
{
  "name": "react-web-app-template",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint .",
    "deploy": "npm run build && firebase deploy"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@tanstack/react-query": "^5.62.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.16.0",
    "@playwright/test": "^1.49.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.16.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "globals": "^15.13.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "~5.6.2",
    "typescript-eslint": "^8.16.0",
    "vite": "^6.0.3",
    "vitest": "^2.1.8"
  }
}
```

**Step 2: Create tsconfig.json**

Create `templates/react-web-app/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 3: Create tsconfig.node.json**

Create `templates/react-web-app/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "playwright.config.ts"]
}
```

**Step 4: Create vite.config.ts**

Create `templates/react-web-app/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 5: Commit**

```bash
git add templates/react-web-app/
git commit -m "feat: add package.json, tsconfig, and vite config"
```

---

## Task 3: Create Tailwind Configuration

**Files:**
- Create: `templates/react-web-app/tailwind.config.js`
- Create: `templates/react-web-app/postcss.config.js`
- Create: `templates/react-web-app/src/index.css`

**Step 1: Create tailwind.config.js**

Create `templates/react-web-app/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

**Step 2: Create postcss.config.js**

Create `templates/react-web-app/postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 3: Create index.css with theme variables**

Create `templates/react-web-app/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 222 47% 11%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --card: 222 47% 13%;
    --card-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62% 30%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 212 100% 47%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

**Step 4: Commit**

```bash
git add templates/react-web-app/
git commit -m "feat: add Tailwind configuration with theme variables"
```

---

## Task 4: Create Utility Functions and Test Setup

**Files:**
- Create: `templates/react-web-app/src/lib/utils.ts`
- Create: `templates/react-web-app/vitest.config.ts`
- Create: `templates/react-web-app/tests/unit/setup.ts`
- Create: `templates/react-web-app/tests/unit/utils.test.ts`

**Step 1: Create utils.ts**

Create `templates/react-web-app/src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 2: Create vitest.config.ts**

Create `templates/react-web-app/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Create test setup**

Create `templates/react-web-app/tests/unit/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

**Step 4: Create utils test**

Create `templates/react-web-app/tests/unit/utils.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles tailwind conflicts by using last value', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base')
  })
})
```

**Step 5: Commit**

```bash
git add templates/react-web-app/
git commit -m "feat: add utils and Vitest configuration"
```

---

## Task 5: Create UI Components (Part 1 - Button, Input, Label)

**Files:**
- Create: `templates/react-web-app/src/components/ui/button.tsx`
- Create: `templates/react-web-app/src/components/ui/input.tsx`
- Create: `templates/react-web-app/src/components/ui/label.tsx`

**Step 1: Create Button component**

Create `templates/react-web-app/src/components/ui/button.tsx`:
```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Step 2: Create Input component**

Create `templates/react-web-app/src/components/ui/input.tsx`:
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

**Step 3: Create Label component**

Create `templates/react-web-app/src/components/ui/label.tsx`:
```typescript
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

**Step 4: Commit**

```bash
git add templates/react-web-app/src/components/ui/
git commit -m "feat: add Button, Input, and Label components"
```

---

## Task 6: Create UI Components (Part 2 - Card, Dialog)

**Files:**
- Create: `templates/react-web-app/src/components/ui/card.tsx`
- Create: `templates/react-web-app/src/components/ui/dialog.tsx`

**Step 1: Create Card component**

Create `templates/react-web-app/src/components/ui/card.tsx`:
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Step 2: Create Dialog component**

Create `templates/react-web-app/src/components/ui/dialog.tsx`:
```typescript
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

**Step 3: Commit**

```bash
git add templates/react-web-app/src/components/ui/
git commit -m "feat: add Card and Dialog components"
```

---

## Task 7: Create UI Components (Part 3 - Select, Tabs, Toast)

**Files:**
- Create: `templates/react-web-app/src/components/ui/select.tsx`
- Create: `templates/react-web-app/src/components/ui/tabs.tsx`
- Create: `templates/react-web-app/src/components/ui/toast.tsx`

**Step 1: Create Select component**

Create `templates/react-web-app/src/components/ui/select.tsx`:
```typescript
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-background text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
```

**Step 2: Create Tabs component**

Create `templates/react-web-app/src/components/ui/tabs.tsx`:
```typescript
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

**Step 3: Create Toast component**

Create `templates/react-web-app/src/components/ui/toast.tsx`:
```typescript
import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

**Step 4: Commit**

```bash
git add templates/react-web-app/src/components/ui/
git commit -m "feat: add Select, Tabs, and Toast components"
```

---

## Task 8: Create API Client and Data Fetching Hook

**Files:**
- Create: `templates/react-web-app/src/lib/api.ts`
- Create: `templates/react-web-app/src/hooks/use-example.ts`

**Step 1: Create API client**

Create `templates/react-web-app/src/lib/api.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    throw new ApiError(res.status, `API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'DELETE',
    }),
}

export { ApiError }
```

**Step 2: Create example hook**

Create `templates/react-web-app/src/hooks/use-example.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Example types - replace with your own
interface Item {
  id: string
  name: string
  description?: string
  createdAt: string
}

type CreateItemInput = Omit<Item, 'id' | 'createdAt'>
type UpdateItemInput = Partial<CreateItemInput>

// Query keys factory for type safety and consistency
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...itemKeys.lists(), filters] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
}

// Fetch all items
export function useItems() {
  return useQuery({
    queryKey: itemKeys.lists(),
    queryFn: () => api.get<Item[]>('/items'),
  })
}

// Fetch single item
export function useItem(id: string) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => api.get<Item>(`/items/${id}`),
    enabled: !!id,
  })
}

// Create item
export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateItemInput) => api.post<Item>('/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() })
    },
  })
}

// Update item
export function useUpdateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemInput }) =>
      api.patch<Item>(`/items/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() })
    },
  })
}

// Delete item
export function useDeleteItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() })
    },
  })
}
```

**Step 3: Commit**

```bash
git add templates/react-web-app/src/lib/api.ts templates/react-web-app/src/hooks/
git commit -m "feat: add API client and TanStack Query hooks"
```

---

## Task 9: Create Layout and Pages

**Files:**
- Create: `templates/react-web-app/src/components/layout/root-layout.tsx`
- Create: `templates/react-web-app/src/pages/home.tsx`
- Create: `templates/react-web-app/src/pages/example.tsx`

**Step 1: Create RootLayout**

Create `templates/react-web-app/src/components/layout/root-layout.tsx`:
```typescript
import { Link, Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            React App
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/example"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Example
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  )
}
```

**Step 2: Create Home page**

Create `templates/react-web-app/src/pages/home.tsx`:
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to React App</h1>
        <p className="text-xl text-muted-foreground">
          A modern React template with TypeScript, Tailwind CSS, and more.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>
              Pre-built UI components with Radix UI and CVA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Button, Input, Card, Dialog, Select, Tabs, Toast, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Fetching</CardTitle>
            <CardDescription>
              TanStack Query for server state management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Type-safe API client with query hooks pattern.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing</CardTitle>
            <CardDescription>
              Vitest for unit tests, Playwright for E2E
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comprehensive testing setup ready to go.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link to="/example">View Example</Link>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </Button>
      </div>
    </div>
  )
}
```

**Step 3: Create Example page**

Create `templates/react-web-app/src/pages/example.tsx`:
```typescript
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export function ExamplePage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Component Examples</h1>
        <p className="text-muted-foreground">
          Explore the available UI components.
        </p>
      </div>

      <Tabs defaultValue="buttons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="dialogs">Dialogs</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different button styles for different purposes.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Input fields and form controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="select">Select</Label>
                <Select>
                  <SelectTrigger id="select">
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="dialogs">
          <Card>
            <CardHeader>
              <CardTitle>Dialog Component</CardTitle>
              <CardDescription>Modal dialogs for important interactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Example Dialog</DialogTitle>
                    <DialogDescription>
                      This is an example dialog. You can put any content here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Dialog content goes here.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add templates/react-web-app/src/components/layout/ templates/react-web-app/src/pages/
git commit -m "feat: add layout and pages"
```

---

## Task 10: Create App Entry Points

**Files:**
- Create: `templates/react-web-app/src/App.tsx`
- Create: `templates/react-web-app/src/main.tsx`
- Create: `templates/react-web-app/index.html`

**Step 1: Create App.tsx with router**

Create `templates/react-web-app/src/App.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RootLayout } from '@/components/layout/root-layout'
import { HomePage } from '@/pages/home'
import { ExamplePage } from '@/pages/example'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="example" element={<ExamplePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
```

**Step 2: Create main.tsx**

Create `templates/react-web-app/src/main.tsx`:
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Step 3: Create index.html**

Create `templates/react-web-app/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 4: Commit**

```bash
git add templates/react-web-app/src/App.tsx templates/react-web-app/src/main.tsx templates/react-web-app/index.html
git commit -m "feat: add App entry points and router setup"
```

---

## Task 11: Create Test Configurations

**Files:**
- Create: `templates/react-web-app/playwright.config.ts`
- Create: `templates/react-web-app/tests/e2e/home.spec.ts`

**Step 1: Create Playwright config**

Create `templates/react-web-app/playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 2: Create E2E test**

Create `templates/react-web-app/tests/e2e/home.spec.ts`:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display the welcome heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome')
  })

  test('should navigate to example page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=View Example')
    await expect(page).toHaveURL('/example')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Component Examples')
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    await page.click('nav >> text=Example')
    await expect(page).toHaveURL('/example')
    await page.click('nav >> text=Home')
    await expect(page).toHaveURL('/')
  })
})
```

**Step 3: Commit**

```bash
git add templates/react-web-app/playwright.config.ts templates/react-web-app/tests/e2e/
git commit -m "feat: add Playwright E2E tests"
```

---

## Task 12: Create GitHub Actions Workflows

**Files:**
- Create: `templates/react-web-app/.github/workflows/ci.yml`
- Create: `templates/react-web-app/.github/workflows/deploy.yml`

**Step 1: Create CI workflow**

Create `templates/react-web-app/.github/workflows/ci.yml`:
```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run unit tests
        run: npm test

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Build
        run: npm run build

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

**Step 2: Create Deploy workflow**

Create `templates/react-web-app/.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

**Step 3: Commit**

```bash
git add templates/react-web-app/.github/
git commit -m "feat: add GitHub Actions CI and deploy workflows"
```

---

## Task 13: Create Firebase Configuration

**Files:**
- Create: `templates/react-web-app/firebase.json`
- Create: `templates/react-web-app/.firebaserc`

**Step 1: Create firebase.json**

Create `templates/react-web-app/firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Step 2: Create .firebaserc**

Create `templates/react-web-app/.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

**Step 3: Commit**

```bash
git add templates/react-web-app/firebase.json templates/react-web-app/.firebaserc
git commit -m "feat: add Firebase Hosting configuration"
```

---

## Task 14: Create CLAUDE.md and README

**Files:**
- Create: `templates/react-web-app/CLAUDE.md`
- Create: `templates/react-web-app/README.md`
- Create: `templates/react-web-app/.claude/settings.local.json`

**Step 1: Create CLAUDE.md**

Create `templates/react-web-app/CLAUDE.md`:
```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

\`\`\`bash
npm run dev          # Start Vite dev server (port 5173)
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
npm run test         # Run Vitest unit tests
npm run test:watch   # Run Vitest in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright with UI
npm run lint         # ESLint check
npm run deploy       # Build and deploy to Firebase
\`\`\`

## Architecture Overview

React SPA with TypeScript, built with Vite. Uses Tailwind CSS for styling with CSS variables for theming.

### Directory Structure

\`\`\`
src/
  components/
    ui/              # Radix + CVA primitives (Button, Input, etc.)
    layout/          # Layout components (RootLayout)
  hooks/             # TanStack Query hooks
  lib/
    api.ts           # REST API client
    utils.ts         # Utilities (cn helper)
  pages/             # Route components
  App.tsx            # Router setup + QueryClient
  main.tsx           # Entry point
  index.css          # Tailwind + theme variables
\`\`\`

### Key Patterns

- **Components**: Radix UI primitives + CVA for variants
- **Styling**: Tailwind with HSL CSS variables for theming
- **Data Fetching**: TanStack Query with typed API client
- **Routing**: React Router v6 with layout routes

## Adding New Components

Follow the CVA pattern in \`src/components/ui/button.tsx\`:

\`\`\`typescript
import { cva, type VariantProps } from 'class-variance-authority'

const componentVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', secondary: '...' },
    size: { default: '...', sm: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
\`\`\`

## Adding New API Hooks

Follow the pattern in \`src/hooks/use-example.ts\`:

\`\`\`typescript
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => api.get<Item[]>('/items'),
  })
}
\`\`\`

## Development Workflow (TDD)

1. **Write failing test first** in \`tests/unit/\` or \`tests/e2e/\`
2. **Run test** to confirm it fails
3. **Implement minimal code** to make test pass
4. **Refactor** while keeping tests green
5. **Commit** with descriptive message

## Testing

- Unit tests: \`npm test\` (Vitest)
- E2E tests: \`npm run test:e2e\` (Playwright)

## Path Alias

\`@/\` maps to \`./src/\` in imports.

## Theming

CSS variables in \`src/index.css\`. Toggle dark mode by adding \`dark\` class to \`<html>\`.
\`\`\`

**Step 2: Create README**

Create `templates/react-web-app/README.md`:
```markdown
# React Web App Template

A modern React template with TypeScript, Tailwind CSS, and comprehensive tooling.

## Features

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** with CSS variable theming
- **Radix UI** + **CVA** component library
- **TanStack Query** for data fetching
- **React Router** for navigation
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Firebase Hosting** deployment
- **GitHub Actions** CI/CD

## Quick Start

1. **Clone and install**
   \`\`\`bash
   cp -r templates/react-web-app my-app
   cd my-app
   npm install
   \`\`\`

2. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Run tests**
   \`\`\`bash
   npm test              # Unit tests
   npm run test:e2e      # E2E tests
   \`\`\`

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Install Firebase CLI
   \`\`\`bash
   npm install -g firebase-tools
   firebase login
   \`\`\`

3. Update \`.firebaserc\` with your project ID

4. Deploy
   \`\`\`bash
   npm run deploy
   \`\`\`

## GitHub Actions Setup

Add these secrets to your repository:
- \`FIREBASE_SERVICE_ACCOUNT\`: Firebase service account JSON
- \`FIREBASE_PROJECT_ID\`: Your Firebase project ID

## Project Structure

\`\`\`
src/
├── components/
│   ├── ui/           # UI primitives (Button, Input, etc.)
│   └── layout/       # Layout components
├── hooks/            # React Query hooks
├── lib/              # Utilities and API client
├── pages/            # Route components
├── App.tsx           # Router and providers
├── main.tsx          # Entry point
└── index.css         # Tailwind and theme
\`\`\`

## Available Scripts

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start dev server |
| \`npm run build\` | Production build |
| \`npm run preview\` | Preview build |
| \`npm test\` | Run unit tests |
| \`npm run test:e2e\` | Run E2E tests |
| \`npm run lint\` | Lint code |
| \`npm run deploy\` | Deploy to Firebase |

## License

MIT
\`\`\`

**Step 3: Create Claude settings**

Create `templates/react-web-app/.claude/settings.local.json`:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test*)",
      "Bash(npx vitest*)",
      "Bash(npx playwright*)",
      "Bash(git *)"
    ]
  }
}
```

**Step 4: Commit**

```bash
git add templates/react-web-app/CLAUDE.md templates/react-web-app/README.md templates/react-web-app/.claude/
git commit -m "feat: add CLAUDE.md, README, and Claude settings"
```

---

## Task 15: Final Verification

**Step 1: Install dependencies**

```bash
cd templates/react-web-app
npm install
```

**Step 2: Run unit tests**

```bash
npm test
```

Expected: All tests pass

**Step 3: Run lint**

```bash
npm run lint
```

Expected: No errors

**Step 4: Build**

```bash
npm run build
```

Expected: Builds successfully

**Step 5: Final commit if needed**

```bash
git add -A
git commit -m "fix: address any issues from verification"
```

---

## Summary

After completing all tasks, the `templates/react-web-app/` directory contains:
- Vite + React + TypeScript setup
- Tailwind CSS with theme variables
- 8 UI components (Button, Input, Label, Card, Dialog, Select, Tabs, Toast)
- REST API client with TanStack Query hooks
- Layout and example pages
- Vitest unit tests + Playwright E2E tests
- GitHub Actions CI/CD
- Firebase Hosting configuration
- CLAUDE.md and README documentation
