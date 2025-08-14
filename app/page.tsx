// app/notes/page.tsx
import { getNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type SearchParams = { categoryId?: string };

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  // фильтрация по query всё ещё работает (?categoryId=...)
  const data = await getNotes(searchParams?.categoryId);

  return (
    <section>
      <header style={{ display: "flex", alignItems: "center", gap: 16, margin: "12px 0 24px" }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Notes List</h1>
      </header>

      <NoteList notes={data.notes} />
    </section>
  );
}