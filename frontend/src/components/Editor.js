import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill for the rich-text editor
import 'react-quill/dist/quill.snow.css'; // Import the Quill CSS for styling
import './Editor.css'; // Import custom CSS for styling

const Editor = () => {
    const [content, setContent] = useState('');

    // Handle content change in the editor
    const handleContentChange = (value) => {
        setContent(value);
    };

    // Save content to local storage and refresh the page
    const handleSave = () => {
        localStorage.setItem('editorContent', content);
        alert('Content saved!'); // Display notification
        window.location.reload(); // Refresh the page
    };

    // Load saved content from local storage
    React.useEffect(() => {
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
            setContent(savedContent);
        }
    }, []);

    return (
        <div className="editor-container">
            <h2>Editor</h2>
            <ReactQuill 
                value={content} 
                onChange={handleContentChange} 
                modules={Editor.modules} 
                formats={Editor.formats} 
            />
            <button className="save-button" onClick={handleSave}>Save</button>
        </div>
    );
};

// Define modules and formats for ReactQuill editor
Editor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{ 'align': [] }],
        ['clean']
    ],
};

Editor.formats = [
    'header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'image', 'align'
];

export default Editor;
