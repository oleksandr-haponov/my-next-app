// app/notes/error.tsx
"use client";

export default function NotesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>Помилка завантаження: {error.message}</p>
      <button onClick={reset}>Спробувати ще раз</button>
    </div>
  );
}