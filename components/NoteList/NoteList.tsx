import Link from "next/link";
import styles from "./NoteList.module.css";
import type { Note } from "@/lib/api";

export default function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ul className={styles.list}>
      {notes.map((n) => (
        <li key={n.id} className={styles.item}>
          <Link
            href={`/notes/${encodeURIComponent(n.id)}`}
            className={styles.link}
          >
            {n.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}