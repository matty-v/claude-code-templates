import { Router, Request, Response, NextFunction } from 'express'
import { getAll, getById, create, update, remove } from '../services/firestore.js'

const router = Router()
const COLLECTION = 'items'

interface Item {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

// GET /items - List all items
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await getAll<Item>(COLLECTION)
    res.json(items)
  } catch (error) {
    next(error)
  }
})

// GET /items/:id - Get item by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getById<Item>(COLLECTION, req.params.id)
    if (!item) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    res.json(item)
  } catch (error) {
    next(error)
  }
})

// POST /items - Create item
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body
    if (!name) {
      res.status(400).json({ error: 'Name is required' })
      return
    }
    const item = await create<Item>(COLLECTION, { name, description })
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
})

// PUT /items/:id - Update item
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await getById<Item>(COLLECTION, req.params.id)
    if (!existing) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    const { name, description } = req.body
    await update(COLLECTION, req.params.id, { name, description })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

// DELETE /items/:id - Delete item
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await getById<Item>(COLLECTION, req.params.id)
    if (!existing) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    await remove(COLLECTION, req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export { router as itemsRouter }
