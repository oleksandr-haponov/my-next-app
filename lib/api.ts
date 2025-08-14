// lib/api.ts
import axios, { AxiosError } from "axios";

/* ===== Types ===== */
export type Note = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteListResponse = {
  notes: Note[];
  total: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type ApiError = Error & { status?: number };

/* ===== Axios instance ===== */
const api = axios.create({
  baseURL: "https://next-docs-api.onrender.com",
  timeout: 8000,
  headers: { Accept: "application/json" },
});

/* ===== Utils ===== */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const maybeDelay = async (ms: number) => {
  if (process.env.NODE_ENV === "development") await delay(ms);
};

function wrapAxiosError(e: unknown, fallbackMsg: string): ApiError {
  const err = e as AxiosError<any>;
  console.error("[API ERROR]", {
    url: err.config?.url,
    method: err.config?.method,
    params: err.config?.params,
    status: err.response?.status,
    data: err.response?.data,
  });
  const msg = err.response?.data?.message || err.message || fallbackMsg;
  const wrapped = new Error(msg) as ApiError;
  wrapped.status = err.response?.status;
  return wrapped;
}

async function retryOnceOn5xx<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const status = (e as AxiosError).response?.status ?? 0;
    if (status >= 500) {
      await delay(1000);
      return await fn();
    }
    throw e;
  }
}

/* ===== API ===== */
export const getNotes = async (categoryId?: string) => {
  await maybeDelay(400); // dev-only loader demo
  try {
    return await retryOnceOn5xx(async () => {
      const res = await api.get<NoteListResponse>("/notes", {
        params: categoryId ? { categoryId } : undefined,
      });
      return res.data;
    });
  } catch (e) {
    throw wrapAxiosError(e, "Failed to load notes");
  }
};

export const getSingleNote = async (rawId: string) => {
  const id = decodeURIComponent(rawId).trim();

  try {
    // Основна спроба + 1 ретрай на 5xx
    return await retryOnceOn5xx(async () => {
      const res = await api.get<Note>(`/notes/${id}`);
      return res.data;
    });
  } catch (e) {
    const status = (e as AxiosError).response?.status ?? 0;

    // Fallback для стабільних 5xx: тягнемо список і шукаємо нотатку локально
    if (status >= 500) {
      try {
        const list = await api.get<NoteListResponse>("/notes");
        const found = list.data.notes.find((n) => n.id === id);
        if (found) return found;

        const err404 = new Error("Note not found") as ApiError;
        err404.status = 404;
        throw err404;
      } catch (e2) {
        throw wrapAxiosError(e2, "Failed to load note (fallback)");
      }
    }

    // 4xx та інші
    throw wrapAxiosError(e, "Failed to load note");
  }
};

export const getCategories = async () => {
  try {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  } catch (e) {
    throw wrapAxiosError(e, "Failed to load categories");
  }
};