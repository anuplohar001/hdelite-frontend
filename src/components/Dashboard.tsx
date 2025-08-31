import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.svg";
import trash from "../assets/trash-2.svg";

const serverUrl = "https://hdelite-backend.vercel.app/"

interface Note {
    _id: string;
    note: string;
}

const Dashboard: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [showTextarea, setShowTextarea] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [user, setUser] = useState({ name: "", email: "" });

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const navigate = useNavigate();

    // Save token + user if redirected from Google OAuth
    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify({ name, email }));
            setUser({ name: name || "", email: email || "" });
        }
    }, [token]);
    

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Fetch notes from backend
    const fetchNotes = async () => {
        if (!user.email) return;
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${serverUrl}/api/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) setNotes(data.notes);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };

    // Run once user loads
    useEffect(() => {
        if (user.email) {
            fetchNotes();

        }
    }, [user.email]);

    // Sign out
    const signOut = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser({ name: "", email: "" });
        setNotes([]);
        navigate("/");
    };

    // Fetch notes


    // Create note
    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${serverUrl}/api/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ note: newNote }),
            });
            const data = await res.json();
            if (data.success) {
                setNewNote("");
                setShowTextarea(false);
                fetchNotes();
            }
        } catch (err) {
            console.error("Error creating note:", err);
        }
    };

    // Delete note
    const handleDelete = async (noteId: string) => {
        try {
            if (confirm("Are you sure you want to delete this note?")) {

                const token = localStorage.getItem("authToken");
                const res = await fetch(`${serverUrl}/api/notes/${noteId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.success) fetchNotes();
            }
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <img src={icon} alt="logo" />
                        Dashboard
                    </h1>
                    <button
                        onClick={signOut}
                        className="text-blue-600 hover:underline text-sm font-medium cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>

                {/* {console.log(notes)} */}

                {/* User Info */}
                <div className="mb-6 p-3 rounded-lg shadow-lg">
                    <h2 className="text-lg font-medium text-gray-800">
                        Welcome, {user.name} !
                    </h2>
                    <p className="text-sm text-gray-500">Email: {user.email}</p>
                </div>

                {!showTextarea && (
                    <button
                        title="Create Note"
                        onClick={() => setShowTextarea(true)}
                        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700 cursor-pointer"
                    >
                        Create Note
                    </button>
                )}

                {/* Textarea for New Note */}
                {showTextarea && (
                    <div className="w-full max-w-md mb-6">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Type your note..."
                            className="w-full p-3 border rounded-lg mb-3 resize-none"
                            rows={4}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddNote}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowTextarea(false);
                                    setNewNote("");
                                }}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Notes List */}
                <div>
                    <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
                    <div className="space-y-2">

                        {
                            notes.length === 0 && (
                                <p className="text-center text-sm text-gray-500">No notes yet. Create one!</p>
                            )
                        }

                        {notes.map((note) => (
                            <div
                                key={note._id}
                                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm"
                            >
                                <span>{note.note}</span>
                                <button
                                    onClick={() => handleDelete(note._id)} // currently deleting by note text
                                    title="Delete Note"
                                    className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                                >
                                    <img src={trash} alt="Delete" className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
