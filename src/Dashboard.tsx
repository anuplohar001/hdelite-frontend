import React, { useState } from "react";
import icon from './assets/icon.svg';
import trash from './assets/trash-2.svg';
interface DashboardProps {
    user: {
        name: string;
        email: string;
    };
    onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {

    const [notes, setNotes] = useState<string[]>(["Note 1", "Note 2"]);
    const [showTextarea, setShowTextarea] = useState(false);
    const [newNote, setNewNote] = useState("");

    // Add note handler
    const handleAddNote = () => {
        if (newNote.trim()) {
            setNotes([...notes, newNote]);
            setNewNote("");
            setShowTextarea(false); // hide textarea after adding
        }
    };

    // Delete note handler
    const handleDelete = (index: number) => {
        setNotes(notes.filter((_, i) => i !== index));
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
                        onClick={onSignOut}
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>

                {/* User Info */}
                <div className="mb-6 p-3 rounded-lg shadow-lg">
                    <h2 className="text-lg font-medium text-gray-800">
                        Welcome, {user.name} !
                    </h2>
                    <p className="text-sm text-gray-500">
                        Email: {user.email.replace(/(.{3})(.*)(?=@)/, "$1xxxx")}
                    </p>
                </div>

                

                {!showTextarea && (
                    <button
                        onClick={() => setShowTextarea(true)}
                        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700"
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
                        {notes.map((note, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm"
                            >
                                <span>{note}</span>
                                <button
                                    onClick={() => handleDelete(index)}
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
