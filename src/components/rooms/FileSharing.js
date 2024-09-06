import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { uploadFile, getFiles, deleteFile } from '../../services/RoomService';
import { auth } from '../../firebase-config';

function FileSharing() {
    const { roomId } = useParams();
    const [files, setFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);  // Track upload state

    useEffect(() => {
        // Subscribe to files in real-time
        const unsubscribe = getFiles(roomId, setFiles, (err) => {
            setError(err.message || 'An error occurred');
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, [roomId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log("File selected:", e.target.files[0]);  // Log the selected file
    };

    const handleUploadFile = async (e) => {
        e.preventDefault();
        try {
            if (file) {
                setUploading(true);  // Set uploading state to true
                console.log("Uploading file:", file);  // Log the file being uploaded
                await uploadFile(roomId, file);
                setFile(null);  // Clear the input field after uploading the file
                setUploading(false);  // Reset uploading state after completion
                console.log("File uploaded successfully!");
            } else {
                console.log("No file selected");
            }
        } catch (error) {
            setError('Failed to upload file: ' + (error.message || 'An error occurred'));
            console.error("Error during file upload:", error);
            setUploading(false);  // Reset uploading state if there's an error
        }
    };

    const handleDeleteFile = async (fileId, fileName) => {
        try {
            await deleteFile(roomId, fileId, fileName);
        } catch (error) {
            setError('Failed to delete file: ' + (error.message || 'An error occurred'));
        }
    };

    return (
        <div>
            <h3>File Sharing</h3>
            <form onSubmit={handleUploadFile}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={uploading}>Upload</button>
            </form>
            {error && <p style={{ color: 'red' }}>{String(error)}</p>} {/* Convert error to string */}
            {uploading && <p>Uploading...</p>}  {/* Show uploading status */}
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                            {file.fileName}
                        </a>
                        {file.uploaderId === auth.currentUser?.uid && (
                            <button onClick={() => handleDeleteFile(file.id, file.fileName)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FileSharing;
