import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const newMessages = [...messages, { role: "user", text: prompt }];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    // backend connection
    try {
      const response = await axios.post("https://chai-bot-xscn.onrender.com/", {
        text: prompt,
      });

      const reply = [...response.data];
      setMessages([...newMessages, { role: "assistant", text: reply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Something went wrong!" },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendPrompt();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Hitesh Sir Bot</h1>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 flex flex-col gap-3">
        <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user"
                  ? "bg-blue-100 self-end text-right"
                  : "bg-gray-200 self-start text-left"
                }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-200 p-3 rounded-lg self-start max-w-[80%]">
              Typing...
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 rounded-lg p-2"
            placeholder="Type your message..."
          />
          <button
            onClick={sendPrompt}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
