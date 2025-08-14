// app/notes/page.tsx
import { getNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type SearchParams = { categoryId?: string };

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const categoryId = searchParams?.categoryId;
  const data = await getNotes(categoryId);

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16, margin: "12px 0 24px" }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Notes List</h1>
      </header>

      {data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>Нотаток немає</p>
      )}
    </section>
  );
}