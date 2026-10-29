
import { useEffect, useState } from "react";
import "./App.css";

type Note = {
  id: number;
  title: string;
  subject: string;
  content: string;
  date: string;
};

const defaultNotes: Note[] = [
  {
    id: 1,
    title: "Introduction to Data Science",
    subject: "Data Science",
    content:
      "Data Science is a field that uses data, statistics and programming to find useful information and solve problems.",
    date: "October 12, 2026",
  },
  {
    id: 2,
    title: "Python Basics",
    subject: "Programming",
    content:
      "Python is a simple and beginner-friendly programming language. Important topics include variables, loops, functions and lists.",
    date: "October 10, 2026",
  },
  {
    id: 3,
    title: "Database Management",
    subject: "DBMS",
    content:
      "A database is an organized collection of data. SQL is used to create, manage and retrieve data from relational databases.",
    date: "October 8, 2026",
  },
];

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem("auranotes-notes");
      return savedNotes ? JSON.parse(savedNotes) : defaultNotes;
    } catch {
      return defaultNotes;
    }
  });

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Data Science");
  const [content, setContent] = useState("");

  useEffect(() => {
    localStorage.setItem("auranotes-notes", JSON.stringify(notes));
  }, [notes]);

  const subjects = [
    "All Subjects",
    "Data Science",
    "Programming",
    "DBMS",
    "Mathematics",
    "Other",
  ];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      subject === "All Subjects" || note.subject === subject;

    return matchesSearch && matchesSubject;
  });

  function addNote() {
    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and note content.");
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      subject: newSubject,
      content: content.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setNotes((previousNotes) => [newNote, ...previousNotes]);

    setTitle("");
    setContent("");
    setNewSubject("Data Science");
    setShowForm(false);
  }

  function deleteNote(id: number) {
    const confirmed = window.confirm("Do you want to delete this note?");

    if (confirmed) {
      setNotes((previousNotes) =>
        previousNotes.filter((note) => note.id !== id)
      );
    }
  }

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="site-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand brand-name" href="#">
              <span className="brand-icon">A</span>
              AuraNotes
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item">
                  <a className="nav-link active" href="#home">
                    Home
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#notes">
                    My Notes
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#about">
                    About
                  </a>
                </li>

                <li className="nav-item ms-lg-3">
                  <button
                    className="btn add-note-nav"
                    onClick={() => setShowForm(!showForm)}
                  >
                    + Add Note
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-section" id="home">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <p className="small-label">YOUR STUDY SPACE</p>

                <h1>
                  Keep your notes.
                  <br />
                  <span>Keep learning.</span>
                </h1>

                <p className="hero-description">
                  A simple place to save your class notes, organize subjects
                  and keep track of what you learn every day.
                </p>

                <a href="#notes" className="btn primary-button">
                  Explore my notes
                </a>
              </div>

              <div className="col-lg-5">
                <div className="hero-image-box">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80"
                    alt="Notebook and pen on a study table"
                    className="hero-image"
                  />

                  <div className="image-caption">
                    <span>☁</span>
                    A little space to learn something new
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="notes-section container" id="notes">
          <div className="section-heading">
            <div>
              <p className="small-label">STUDY COLLECTION</p>
              <h2>My Notes</h2>
              <p className="section-description">
                All your important topics, in one place.
              </p>
            </div>

            <button
              className="btn primary-button"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close Form" : "+ Add a Note"}
            </button>
          </div>

          {/* Add note form */}
          {showForm && (
            <div className="add-note-form card">
              <h3>Add a new note</h3>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Note title</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  >
                    {subjects
                      .filter((item) => item !== "All Subjects")
                      .map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Note content</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Write your notes here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-12">
                  <button className="btn primary-button" onClick={addNote}>
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and filter */}
          <div className="notes-tools">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search your notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-select subject-filter"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Note cards */}
          <div className="row g-4">
            {filteredNotes.map((note) => (
              <div className="col-md-6 col-lg-4" key={note.id}>
                <article className="note-card card h-100">
                  <div className="note-card-top">
                    <span className="subject-badge">{note.subject}</span>

                    <button
                      className="delete-note"
                      title="Delete note"
                      onClick={() => deleteNote(note.id)}
                    >
                      ×
                    </button>
                  </div>

                  <h3>{note.title}</h3>

                  <p className="note-content">{note.content}</p>

                  <div className="note-card-footer">
                    <span>🗓 {note.date}</span>
                    <span className="note-type">Study note</span>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="empty-message">
              <h3>No notes found</h3>
              <p>Try another search or add a new note.</p>
            </div>
          )}
        </section>

        {/* About */}
        <section className="about-section" id="about">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <img
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80"
                  alt="Books and study materials"
                  className="about-image"
                />
              </div>

              <div className="col-lg-6">
                <p className="small-label">ABOUT THIS PROJECT</p>
                <h2>A simple way to organize learning.</h2>

                <p>
                  AuraNotes is a small notes website created to make studying
                  and organizing class notes easier. Notes can be added,
                  searched and filtered according to subjects.
                </p>

                <p>
                  This project is built using React, TypeScript, Bootstrap
                  and CSS.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-content">
          <div>
            <h3>AuraNotes</h3>
            <p>My little corner for study notes.</p>
          </div>

          <div className="footer-right">
            <p>Made by Payal Makani</p>
            <p>© {new Date().getFullYear()} AuraNotes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
                                           
