import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sendMessage, getMessages } from '../../services/RoomService';
import { auth } from '../../firebase-config';

function Chat() {
    const { roomId } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Subscribe to messages in real-time
        const unsubscribe = getMessages(roomId, setMessages, (err) => {
            setError(err.message || 'An error occurred');
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, [roomId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            if (message.trim()) {
                await sendMessage(roomId, message);
                setMessage(''); // Clear the input field after sending the message
            }
        } catch (error) {
            setError('Failed to send message: ' + (error.message || 'An error occurred'));
        }
    };

    return (
        <div>
            <h3>Chat</h3>
            <div className="chat-box">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.senderId === auth.currentUser?.uid ? 'self' : ''}`}>
                        <strong>{msg.senderName}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
            {error && <p style={{ color: 'red' }}>{String(error)}</p>} {/* Convert error to string */}
        </div>
    );
}

export default Chat;
