import React, { useState, useEffect } from 'react';
import './Notes.css';

const Notes = ({ isLoggedIn }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        tags: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [noteIdToEdit, setNoteIdToEdit] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            if (!isLoggedIn) {
                alert('Please log in to view your notes.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:5000/notes', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to fetch notes');
                const data = await response.json();
                setNotes(data || []);
            } catch (error) {
                console.error('Error fetching notes:', error);
                setError('Failed to fetch notes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [isLoggedIn]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewNote((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = 'http://localhost:5000/notes';
    
        const noteToAdd = {
            ...newNote,
            tags: newNote.tags.split(',').map(tag => tag.trim()),
        };
    
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `${apiUrl}/${noteIdToEdit}` : apiUrl;
    
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(noteToAdd),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit the note');
            }
    
            const data = await response.json();
            if (editMode) {
                setNotes((prev) =>
                    prev.map(note => note.id === noteIdToEdit ? { ...note, ...noteToAdd } : note)
                );
            } else {
                setNotes((prev) => [...prev, { ...noteToAdd, id: data.note.id }]);
            }
    
            // Reset form fields
            setNewNote({ title: '', content: '', tags: '', date: new Date().toISOString().split('T')[0] });
            setEditMode(false);
            setNoteIdToEdit(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            setError('Could not submit the note. Please try again later.');
        } finally {
            setLoading(false);
        }
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
        setShowForm(true);
    };

    const handleDelete = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const apiUrl = `http://localhost:5000/notes/${noteId}`;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete the note');
                }

                setNotes((prev) => prev.filter((note) => note.id !== noteId));
            } catch (error) {
                console.error('Error:', error);
                setError('Could not delete the note. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="notes-container">
            <h1>Your Notes</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <div className="button-group">
                <button onClick={() => setShowSearch(!showSearch)}>
                    {showSearch ? 'Hide Search' : 'Show Search'}
                </button>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? (editMode ? 'Cancel Edit' : 'Hide Form') : (editMode ? 'Edit Notes' : 'Add New Notes')}
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
            <div className="notes-list">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                        <div key={note.id} className="note">
                            <h2>{note.title}</h2>
                            <p>{note.content}</p>
                            <p><strong>Tags:</strong> {note.tags.join(', ')}</p>
                            <p><strong>Date:</strong> {new Date(note.date).toLocaleDateString()}</p>
                            <button onClick={() => handleEdit(note.id)}>Edit</button>
                            <button onClick={() => handleDelete(note.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No notes found.</p>
                )}
            </div>
            {showForm && (
                <div>
                    <h2>{editMode ? 'Edit Note' : 'Add a New Note'}</h2>
                    <form className="note-form" onSubmit={handleSubmit}>
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
                            required
                        />
                        <label htmlFor="tags">Tags:</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={newNote.tags}
                            onChange={handleChange}
                        />
                        <button type="submit">{editMode ? 'Update Note' : 'Add Note'}</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Notes;