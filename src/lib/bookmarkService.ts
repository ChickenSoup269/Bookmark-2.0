import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore"
import { db } from "./firebase"

// 🟢 Thêm bookmark
export async function addBookmark(
  uid: string,
  bookmark: {
    title: string
    url: string
    description?: string
    folderId?: string | null
    tags?: string[]
  }
) {
  try {
    const bookmarkRef = collection(db, "users", uid, "bookmarks")

    const docRef = await addDoc(bookmarkRef, {
      ...bookmark,
      favorite: false,
      favicon: `https://icons.duckduckgo.com/ip3/${
        new URL(bookmark.url).hostname
      }.ico`,
      createdAt: serverTimestamp(),
    })

    return { id: docRef.id }
  } catch (err) {
    console.error("❌ Lỗi khi thêm bookmark:", err)
    throw err
  }
}

// 🔴 Xoá bookmark theo URL hoặc ID
export async function deleteBookmark(uid: string, identifier: string) {
  try {
    const bookmarkRef = collection(db, "users", uid, "bookmarks")

    let q
    if (identifier.startsWith("http")) {
      // xoá theo URL
      q = query(bookmarkRef, where("url", "==", identifier))
    } else {
      // xoá theo ID
      q = query(bookmarkRef, where("__name__", "==", identifier))
    }

    const snapshot = await getDocs(q)
    const deleted: string[] = []

    for (const b of snapshot.docs) {
      await deleteDoc(doc(db, "users", uid, "bookmarks", b.id))
      deleted.push(b.id)
    }

    return deleted // trả về danh sách ID đã xoá
  } catch (err) {
    console.error("❌ Lỗi khi xoá bookmark:", err)
    throw err
  }
}
