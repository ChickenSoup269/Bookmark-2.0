import { db } from "./firebase"
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"

export async function addBookmark(
  uid: string,
  data: {
    title: string
    url: string
    description?: string
    favicon?: string
    favorite?: boolean
    folderId?: string
    tags?: string[]
  }
) {
  if (!uid) throw new Error("User chưa đăng nhập")

  const ref = collection(db, "users", uid, "bookmarks")
  const docRef = await addDoc(ref, {
    title: data.title,
    url: data.url,
    description: data.description || "",
    favicon:
      data.favicon ||
      `https://icons.duckduckgo.com/ip3/${new URL(data.url).hostname}.ico`,
    favorite: data.favorite || false,
    folderId: data.folderId || null,
    tags: data.tags || [],
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export async function deleteBookmark(uid: string, url: string) {
  if (!uid) throw new Error("User chưa đăng nhập")

  const ref = collection(db, "users", uid, "bookmarks")
  const q = query(ref, where("url", "==", url))
  const snapshot = await getDocs(q)

  const deleted: string[] = []
  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, "users", uid, "bookmarks", d.id))
    deleted.push(d.id)
  }
  return deleted
}
