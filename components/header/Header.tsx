import css from './Header.module.css';

const Header = () => {
  return (
    <header className={css.header}>
      <h2>NoteHub</h2>
      <nav>
        <ul className={css.navigation}>
          <li>Home</li>
          <li>Notes</li>
          <li>Profile</li>
          <li>About</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;