import React, { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { BiBot } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

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
        { role: "assistant", text: "Something went wrong! Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-4xl flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BiBot className="text-4xl text-purple-500" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Chat with Hitesh sir
            </h1>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden bg-gray-800 rounded-t-xl shadow-xl">
          <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <p className="mb-2">👋 Welcome to Hitesh's AI Assistant</p>
                <p className="text-sm">
                  Ask me anything about web development, JavaScript, or career guidance!
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] md:max-w-[75%] ${msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-100"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 bg-gray-700 w-fit p-3 rounded-2xl">
                <BsThreeDots className="animate-bounce" />
                <span className="text-sm">Hitesh is typing</span>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 p-4 rounded-b-xl">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-700 text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              placeholder="Ask anything about coding..."
            />
            <button
              onClick={sendPrompt}
              disabled={loading || !prompt.trim()}
              className={`p-3 rounded-xl ${loading || !prompt.trim()
                  ? "bg-gray-700 text-gray-400"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
                } transition-colors duration-200`}
            >
              <FiSend className="text-xl" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
