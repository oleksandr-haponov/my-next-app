"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Закриття по кліку поза меню
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current || !btnRef.current) return;
      if (!menuRef.current.contains(e.target as Node) && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Клавіатура: Escape закриває, стрілки—навігація
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("a,button,[tabindex]") ?? []);
      const idx = items.indexOf(document.activeElement as HTMLAnchorElement);

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = items[(idx + 1 + items.length) % items.length];
        next?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = items[(idx - 1 + items.length) % items.length];
        prev?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Коли відкриваємо — сфокусувати перший елемент меню
  useEffect(() => {
    if (open) {
      const first = menuRef.current?.querySelector<HTMLElement>("a,button,[tabindex]");
      first?.focus();
    }
  }, [open]);

  // Закривати меню при зміні маршруту (натискання пункту)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const menuId = "notes-menu";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>NoteHub</Link>

        <nav aria-label="Main" className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>
                Home
              </Link>
            </li>

            <li className={styles.dropdownWrap}>
              <button
                ref={btnRef}
                className={styles.linkBtn}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen(v => !v)}
              >
                Notes ▾
              </button>

              {open && (
                <ul
                  id={menuId}
                  ref={menuRef}
                  className={styles.menu}
                  role="menu"
                >
                  <li role="none">
                    <Link href="/notes" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}>
                      All notes
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/notes?categoryId=work" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}>
                      Work
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/notes?categoryId=home" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}>
                      Home
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link href="/profile" className={`${styles.link} ${pathname === "/profile" ? styles.active : ""}`}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/about" className={`${styles.link} ${pathname === "/about" ? styles.active : ""}`}>
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.rule} />
    </header>
  );
}