"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./CategoriesMenu.module.css";

export type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  label?: string;
};

export default function CategoryMenu({ categories, label = "" }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const active = sp.get("categoryId") ?? "";

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        !listRef.current ||
        !btnRef.current ||
        listRef.current.contains(e.target as Node) ||
        btnRef.current.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const selectCategory = (id: string) => {
    const params = new URLSearchParams(sp.toString());
    params.set("categoryId", id);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className={styles.wrap}>
      <button
        ref={btnRef}
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {categories.find(c => c.id === active)?.name || label}
        <span className={styles.chevron} aria-hidden>▾</span>
      </button>

      {open && (
        <ul ref={listRef} className={styles.menu} role="menu">
          {categories.map((c) => (
            <li key={c.id} role="menuitem">
              <button
                className={`${styles.item} ${active === c.id ? styles.active : ""}`}
                onClick={() => selectCategory(c.id)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}