import { Firestore } from '@google-cloud/firestore'

const db = new Firestore()

export interface WithId {
  id: string
}

export async function getAll<T extends WithId>(collection: string): Promise<T[]> {
  const snapshot = await db.collection(collection).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
}

export async function getById<T extends WithId>(collection: string, id: string): Promise<T | null> {
  const doc = await db.collection(collection).doc(id).get()
  return doc.exists ? { id: doc.id, ...doc.data() } as T : null
}

export async function create<T extends WithId>(collection: string, data: Omit<T, 'id'>): Promise<T> {
  const docRef = await db.collection(collection).add({
    ...data,
    createdAt: new Date().toISOString(),
  })
  return { id: docRef.id, ...data } as T
}

export async function update(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
  await db.collection(collection).doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export async function remove(collection: string, id: string): Promise<void> {
  await db.collection(collection).doc(id).delete()
}

export { db }
