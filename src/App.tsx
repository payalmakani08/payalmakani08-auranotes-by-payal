
import { useEffect, useMemo, useState } from 'react';
import './App.css';

const initialNotes = [
  {
    id: 1,
    title: 'Welcome to AuraNotes ✨',
    content: 'Your ideas deserve a beautiful space. Create notes, save your thoughts and organize your day!',
    category: 'Personal',
    color: 'purple',
    pinned: true,
    favorite: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'React + Bootstrap',
    content: 'Learn components, useState, useEffect, responsive grids and CRUD operations.',
    category: 'Study',
    color: 'blue',
    pinned: false,
    favorite: false,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Future project ideas',
    content: 'Build an AI-powered study planner, explore machine learning and create an amazing portfolio.',
    category: 'Ideas',
    color: 'pink',
    pinned: false,
    favorite: true,
    updatedAt: new Date().toISOString(),
  },
];

const categories = ['Study', 'Personal', 'Work', 'Ideas'];
const colors = ['purple', 'blue', 'pink', 'green', 'orange'];

function readNotes() {
  try {
    const data = localStorage.getItem('auranotes-payal');
    return data ? JSON.parse(data) : initialNotes;
  } catch {
    return initialNotes;
  }
}

function App() {
  const [notes, setNotes] = useState(readNotes);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Study');
  const [color, setColor] = useState('purple');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('All');
  const [editing, setEditing] = useState(null);
  const [dark, setDark] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('auranotes-payal', JSON.stringify(notes));
    } catch {
      setMessage('Browser storage is unavailable. Export your notes as a backup.');
    }
  }, [notes]);

  const visibleNotes = useMemo(() => {
    const term = search.toLowerCase().trim();

    return notes
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term);
        const matchesCategory =
          filter === 'All' || note.category === filter;
        const matchesView =
          view === 'All' ||
          (view === 'Pinned' && note.pinned) ||
          (view === 'Favorites' && note.favorite);

        return matchesSearch && matchesCategory && matchesView;
      })
      .sort((a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
  }, [notes, search, filter, view]);

  const totalWords = notes.reduce(
    (total, note) =>
      total + note.content.trim().split(/\s+/).filter(Boolean).length,
    0
  );

  const pinnedCount = notes.filter((note) => note.pinned).length;
  const favoriteCount = notes.filter((note) => note.favorite).length;
  const draftWords = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  function clearForm() {
    setTitle('');
    setContent('');
    setCategory('Study');
    setColor('purple');
    setEditing(null);
  }

  function saveNote(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage('Please enter both a title and some content.');
      return;
    }

    if (editing !== null) {
      setNotes((old) =>
        old.map((note) =>
          note.id === editing
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                category,
                color,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
      setMessage('Your note has been updated successfully!');
    } else {
      setNotes((old) => [
        {
          id: Date.now(),
          title: title.trim(),
          content: content.trim(),
          category,
          color,
          pinned: false,
          favorite: false,
          updatedAt: new Date().toISOString(),
        },
        ...old,
      ]);
      setMessage('Your new note has been created!');
    }

    clearForm();
  }

  function startEdit(note) {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setColor(note.color);
    setEditing(note.id);
    document.getElementById('note-editor')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  function deleteNote(id) {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setNotes((old) => old.filter((note) => note.id !== id));
    if (editing === id) clearForm();
    setMessage('Note deleted successfully.');
  }

  function toggleNote(id, property) {
    setNotes((old) =>
      old.map((note) =>
        note.id === id
          ? {
              ...note,
              [property]: !note[property],
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  }

  function exportNotes() {
    const blob = new Blob(
      [JSON.stringify(notes, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AuraNotes-Payal-Makani.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Your JSON backup has been downloaded.');
  }

  return (
    <div className={`aura-app ${dark ? 'dark-mode' : ''}`}>
      <div className="animated-background" aria-hidden="true">
        <span className="glow glow-one" />
        <span className="glow glow-two" />
        <span className="glow glow-three" />
        <span className="glow glow-four" />
        <div className="background-grid" />
      </div>

      <nav className="navbar navbar-expand-lg aura-navbar sticky-top">
        <div className="container">
          <a className="navbar-brand aura-brand" href="#home">
            <span className="brand-mark"><i className="bi bi-stars" /></span>
            Aura<span>Notes</span>
          </a>

          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-sm theme-button"
              onClick={() => setDark(!dark)}
              aria-label="Toggle color theme"
            >
              <i className={`bi ${dark ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} />
              <span className="d-none d-sm-inline ms-2">
                {dark ? 'Light mode' : 'Dark mode'}
              </span>
            </button>
            <button className="btn btn-sm btn-aura" onClick={exportNotes}>
              <i className="bi bi-download me-1" /> Export
            </button>
          </div>
        </div>
      </nav>

      <main id="home" className="container py-4 py-lg-5 position-relative">
        <section className="hero-panel mb-4 mb-lg-5">
          <div className="hero-content">
            <div className="hero-label">
              <span className="pulse-dot" /> YOUR PERSONAL CREATIVE SPACE
            </div>
            <h1>Dream it.<br /><span>Write it. Make it.</span></h1>
            <p>
              A beautiful home for your thoughts, goals, plans
              and those little ideas that could change everything.
            </p>
            <a className="btn btn-light hero-cta" href="#note-editor">
              <i className="bi bi-pencil-square me-2" />
              Create your first idea
              <i className="bi bi-arrow-up-right ms-2" />
            </a>
            <div className="developer-line">
              <span className="developer-avatar">P</span>
              <span>Designed & developed by <strong>Payal Makani</strong></span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orbit orbit-a" />
            <div className="hero-orbit orbit-b" />
            <div className="hero-glass-card">
              <div className="mini-window">
                <span /><span /><span />
              </div>
              <i className="bi bi-stars mini-star" />
              <div className="mini-line line-a" />
              <div className="mini-line line-b" />
              <div className="mini-line line-c" />
              <div className="mini-highlight">Your next big idea ✨</div>
            </div>
            <div className="floating-symbol symbol-a"><i className="bi bi-lightning-charge-fill" /></div>
            <div className="floating-symbol symbol-b"><i className="bi bi-heart-fill" /></div>
            <div className="floating-symbol symbol-c"><i className="bi bi-pencil-fill" /></div>
          </div>
        </section>

        <section className="row g-3 mb-4 mb-lg-5">
          <div className="col-6 col-lg-3">
            <div className="stat-panel">
              <span className="stat-icon stat-purple"><i className="bi bi-journal-richtext" /></span>
              <div><p>Total notes</p><h3>{notes.length}</h3></div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="stat-panel">
              <span className="stat-icon stat-blue"><i className="bi bi-pin-angle-fill" /></span>
              <div><p>Pinned</p><h3>{pinnedCount}</h3></div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="stat-panel">
              <span className="stat-icon stat-pink"><i className="bi bi-heart-fill" /></span>
              <div><p>Favorites</p><h3>{favoriteCount}</h3></div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="stat-panel">
              <span className="stat-icon stat-green"><i className="bi bi-fonts" /></span>
              <div><p>Words written</p><h3>{totalWords}</h3></div>
            </div>
          </div>
        </section>

        <section id="note-editor" className="glass-panel p-3 p-md-4 p-lg-5 mb-5">
          <div className="section-top mb-4">
            <div>
              <span className="eyebrow">YOUR NEXT MASTERPIECE</span>
              <h2>{editing !== null ? 'Edit your note' : 'Create something wonderful'} <span>✦</span></h2>
              <p>Small thoughts can become big things.</p>
            </div>
            {editing !== null && (
              <button className="btn btn-sm btn-outline-secondary" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={saveNote}>
            <div className="mb-3">
              <label htmlFor="note-title" className="form-label">Note title</label>
              <input
                id="note-title"
                className="form-control aura-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your idea a name..."
                maxLength={100}
                required
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label htmlFor="note-content" className="form-label">Your thoughts</label>
                <span className="small muted-text">{draftWords} words</span>
              </div>
              <textarea
                id="note-content"
                className="form-control aura-input"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something meaningful..."
                maxLength={5000}
                required
              />
            </div>

            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label htmlFor="note-category" className="form-label">Category</label>
                <select
                  id="note-category"
                  className="form-select aura-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label d-block">Choose a color</label>
                <div className="d-flex gap-3 align-items-center py-2">
                  {colors.map((item) => (
                    <button
                      type="button"
                      key={item}
                      aria-label={`Select ${item} note color`}
                      aria-pressed={color === item}
                      className={`color-choice ${item} ${color === item ? 'selected' : ''}`}
                      onClick={() => setColor(item)}
                    />
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-4">
                <button type="submit" className="btn btn-aura w-100 py-3">
                  <i className={`bi ${editing !== null ? 'bi-check2-circle' : 'bi-plus-circle'} me-2`} />
                  {editing !== null ? 'Update note' : 'Create note'}
                </button>
              </div>
            </div>
          </form>

          {message && (
            <div className="alert alert-info d-flex justify-content-between align-items-center mt-4 mb-0 py-2" role="status">
              <span>{message}</span>
              <button className="btn-close" onClick={() => setMessage('')} aria-label="Dismiss" />
            </div>
          )}
        </section>

        <section className="notes-section">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
            <div>
              <span className="eyebrow">THE IDEA GALLERY</span>
              <h2 className="gallery-title">Your collection <span className="count-badge">{visibleNotes.length}</span></h2>
              <p className="muted-text mb-0">Every thought deserves a place.</p>
            </div>
            <div className="filter-tabs" role="group" aria-label="Filter notes">
              {['All', 'Pinned', 'Favorites'].map((item) => (
                <button
                  key={item}
                  className={view === item ? 'active' : ''}
                  onClick={() => setView(item)}
                >
                  {item === 'Pinned' && <i className="bi bi-pin-angle me-1" />}
                  {item === 'Favorites' && <i className="bi bi-heart me-1" />}
                  {item === 'All' && <i className="bi bi-grid me-1" />}
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-7">
              <div className="search-wrap">
                <i className="bi bi-search" />
                <input
                  aria-label="Search notes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your thoughts..."
                />
                {search && (
                  <button onClick={() => setSearch('')} aria-label="Clear search">
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>
            <div className="col-12 col-md-5">
              <select
                aria-label="Filter by category"
                className="form-select aura-input h-100"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          {visibleNotes.length === 0 ? (
            <div className="empty-state glass-panel text-center p-5">
              <i className="bi bi-stars empty-icon" />
              <h3>No notes found</h3>
              <p>Try another search or create a brand-new note.</p>
              <button className="btn btn-aura" onClick={() => {
                setSearch('');
                setFilter('All');
                setView('All');
              }}>
                Show all notes
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {visibleNotes.map((note, index) => (
                <div className="col-12 col-md-6 col-xl-4" key={note.id}>
                  <article
                    className={`note-card note-${note.color} h-100`}
                    style={{ animationDelay: `${Math.min(index, 8) * 65}ms` }}
                  >
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                      <span className="category-chip">{note.category}</span>
                      <div className="d-flex align-items-center gap-2">
                        {note.pinned && <i className="bi bi-pin-angle-fill pin-mark" title="Pinned" />}
                        <button
                          className={`favorite-toggle ${note.favorite ? 'favorited' : ''}`}
                          onClick={() => toggleNote(note.id, 'favorite')}
                          aria-label={note.favorite ? 'Remove favorite' : 'Add favorite'}
                        >
                          <i className={`bi ${note.favorite ? 'bi-heart-fill' : 'bi-heart'}`} />
                        </button>
                      </div>
                    </div>

                    <h3>{note.title}</h3>
                    <p className="note-body">{note.content}</p>

                    <div className="note-bottom mt-auto pt-3">
                      <small>
                        <i className="bi bi-clock me-1" />
                        {new Date(note.updatedAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </small>
                      <div className="d-flex gap-2">
                        <button
                          className="note-action"
                          onClick={() => toggleNote(note.id, 'pinned')}
                          title={note.pinned ? 'Unpin note' : 'Pin note'}
                        >
                          <i className={`bi ${note.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}`} />
                        </button>
                        <button className="note-action" onClick={() => startEdit(note)} title="Edit note">
                          <i className="bi bi-pencil-square" />
                        </button>
                        <button className="note-action delete-action" onClick={() => deleteNote(note.id)} title="Delete note">
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="aura-footer mt-5 py-4 text-center">
          <div className="footer-logo"><i className="bi bi-stars" /> AuraNotes</div>
          <p className="mb-1">A little space for your biggest ideas.</p>
          <p className="developer-credit">
            Crafted with <span>♥</span> by <strong>Payal Makani</strong>
          </p>
          <small>React • Bootstrap 5 • Creativity</small>
        </footer>
      </main>
    </div>
  );
}

export default App;

