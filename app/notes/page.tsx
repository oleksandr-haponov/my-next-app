import React from "react";

const notes = [
    { id: 1, title: "First Note", content: "This is your first note." },
    { id: 2, title: "Second Note", content: "This is your second note." },
];

export default function NotesPage() {
    return (
        <main>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>
                        <h2>{note.title}</h2>
                        <p>{note.content}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}