import React, { useState } from 'react';
import './Notes.css'; // Import the CSS file for styling
import Editor from './Editor'; // Import the Editor component

const Notes = () => {
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: 'First Note',
            content: 'This is the content of the first note.',
            tags: ['general', 'introduction'],
            date: new Date().toISOString().split('T')[0], // Default date format
        },
        {
            id: 2,
            title: 'Second Note',
            content: 'This is the content of the second note.',
            tags: ['update', 'news'],
            date: new Date().toISOString().split('T')[0], // Default date format
        },
    ]);

    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        tags: '',
        date: new Date().toISOString().split('T')[0], // Default date format
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [noteIdToEdit, setNoteIdToEdit] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showEditor, setShowEditor] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewNote({
            ...newNote,
            [name]: value,
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            const updatedNotes = notes.map((note) =>
                note.id === noteIdToEdit ? { ...note, ...newNote, tags: newNote.tags.split(','), date: newNote.date } : note
            );
            setNotes(updatedNotes);
            setEditMode(false);
            setNoteIdToEdit(null);
        } else {
            const newId = notes.length ? notes[notes.length - 1].id + 1 : 1;
            const noteToAdd = {
                id: newId,
                ...newNote,
                tags: newNote.tags.split(','),
            };
            setNotes([...notes, noteToAdd]);
        }
        setNewNote({ title: '', content: '', tags: '', date: new Date().toISOString().split('T')[0] });
        setShowForm(false); // Hide the form after submitting
    };

    const handleEdit = (noteId) => {
        const noteToEdit = notes.find((note) => note.id === noteId);
        setNewNote({
            title: noteToEdit.title,
            content: noteToEdit.content,
            tags: noteToEdit.tags.join(','),
            date: noteToEdit.date,
        });
        setEditMode(true);
        setNoteIdToEdit(noteId);
        setShowForm(true); // Show the form for editing
    };

    
    const handleDelete = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const apiUrl = `http://127.0.0.1:5000/notes/${noteId}`;

            fetch(apiUrl, {
                method: 'DELETE',
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete the note');
                }
                // Update the frontend state if the backend deletion was successful
                setNotes(notes.filter((note) => note.id !== noteId));
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Could not delete the note. Please try again later.'); // Notify the user
            });
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="blog">
            <h1>Notes</h1>
            <div className="button-group">
                <button onClick={() => setShowSearch(!showSearch)}>
                    {showSearch ? 'Hide Search' : 'Show Search'}
                </button>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? (editMode ? 'Cancel Edit' : 'Hide Form') : (editMode ? 'Edit Notes' : 'Add New Notes')}
                </button>
                <button onClick={() => setShowNotes(!showNotes)}>
                    {showNotes ? 'Hide Notes' : 'Show Notes'}
                </button>
                <button onClick={() => setShowEditor(!showEditor)}>
                    {showEditor ? 'Hide Editor' : 'Show Editor'}
                </button>
            </div>
            {showSearch && (
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            )}
            {showNotes && (
                <div className="blog-posts">
                    {filteredNotes.map((note) => (
                        <div key={note.id} className="blog-post">
                            <h2>{note.title}</h2>
                            <p>{note.content}</p>
                            <p><strong>Tags:</strong> {note.tags.join(', ')}</p>
                            <p><strong>Date:</strong> {new Date(note.date).toLocaleDateString()}</p>
                            <button className="edit" onClick={() => handleEdit(note.id)}>Edit</button>
                            <button className="delete" onClick={() => handleDelete(note.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
            {showForm && (
                <div>
                    <h2>{editMode ? 'Edit Note' : 'Add a New Note'}</h2>
                    <form className="blog-form" onSubmit={handleSubmit}>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newNote.title}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newNote.content}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                        <label htmlFor="tags">Tags (comma-separated):</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={newNote.tags}
                            onChange={handleChange}
                        />
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={newNote.date}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">{editMode ? 'Update Note' : 'Add Note'}</button>
                    </form>
                </div>
            )}
            {showEditor && <Editor />}
        </div>
    );
};

export default Notes;