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
            const response = await fetch('http://localhost:5000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title, content, tags: tags.split(',').map(tag => tag.trim()) }), // Format tags
            });
    
            const data = await response.json();
            if (response.ok) {
                setNotes([...notes, { id: data.note.id, title, content, tags: tags.split(',').map(tag => tag.trim()) }]);
                setTitle('');
                setContent('');
                setTags('');
            } else {
                alert(data.message || 'Failed to add note. Please try again.');
            }
        } catch (error) {
            console.error('Error adding note:', error);
            alert('An error occurred while adding the note. Please try again later.');
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