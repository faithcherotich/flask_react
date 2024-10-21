import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ setIsLoggedIn }) => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:5000/notes', {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setNotes(data);
            } else {
                alert(data.message || 'Failed to fetch notes. Please log in or try again later.');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            alert('An error occurred while fetching notes. Please try again later.');
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const noteData = {
                title,
                content,
                tags: tags.split(',').map(tag => tag.trim()),
            };

            const response = await fetch('http://localhost:5000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(noteData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add note. Please try again.');
            }

            const data = await response.json();
            setNotes(prevNotes => [...prevNotes, { id: data.note.id, title, content, tags: noteData.tags }]);
            setTitle('');
            setContent('');
            setTags('');
        } catch (error) {
            console.error('Error adding note:', error);
            alert('An error occurred while adding the note. Please try again later.');
        } finally {
            fetchNotes(); // Fetch notes to ensure the list is up to date
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <form onSubmit={handleAddNote} className="add-note-form">
                <h2>Add a Note</h2>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Content:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Tags:
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </label>
                <button type="submit">Add Note</button>
            </form>
            <div className="dashboard-buttons">
                <Link to="/notes">
                    <button className="dashboard-button">My Notes</button>
                </Link>
                <button className="dashboard-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className="notes-list">
                <h2>Your Notes:</h2>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id}>
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            <p>
                                <strong>Tags:</strong> {Array.isArray(note.tags) ? note.tags.join(', ') : note.tags}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No notes found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;