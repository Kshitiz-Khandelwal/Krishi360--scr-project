import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const saveChatMessage = useMutation(api.chatbot.saveChatMessage);
  const chatHistory = useQuery(api.chatbot.getChatHistory);
  const farmer = useQuery(api.farmers.getCurrentFarmer);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Structure the prompt exactly as requested for TinyLlama
      const systemPrompt = `You are "Krishi Sahayak", an AI assistant designed to help farmers.
Your job is to explain agricultural data in a simple and practical way.
The system already calculates crop recommendations and plant health metrics.
You MUST NOT change or recalculate these values.
You only explain what the results mean and give practical suggestions.

Rules:
1. Never change the crop recommendations provided.
2. Never invent new crops.
3. Explain the meaning of Leaf Area Index (LAI) and crop health clearly.
4. Give practical advice a farmer can follow.
5. Use simple language that farmers can understand.
6. Keep answers short and structured.

If data is missing, say that more information is required instead of guessing.

Output format:
Crop Health Analysis
Leaf Area Index: [Explanation]
Crop Health: [Explanation]
Possible Causes: [List]
Recommended Actions: [List]

Answer in less than 150 words.`;

      // Mock some data, but use real farmer data if available
      const agrData = `Agricultural Data:
Crop: Wheat (Estimated)
Leaf Area Index: 3.5
Health Score: 78
Soil: ${farmer ? farmer.soilType : "Unknown"}
Rainfall: ${farmer ? farmer.rainfall + " mm" : "Unknown"}
Growth Stage: Tillering

Context/Question: ${message}

Explain the crop health.`;

      const fullPrompt = `${systemPrompt}\n\n${agrData}`;

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tinyllama",
          prompt: fullPrompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
      }

      const data = await response.json();
      const answer = data.response;

      // Save the response persistent via Convex
      if (farmer) {
        await saveChatMessage({
          farmerId: farmer._id,
          question: message,
          answer: answer,
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to fetch from local Ollama:", error);
      setError("Failed to connect to Krishi Sahayak (TinyLlama). Ensure 'ollama serve' is running with CORS enabled (OLLAMA_ORIGINS=\"*\").");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  const quickQuestions = [
    "How to test soil pH?",
    "Best time for irrigation?",
    "Crop disease treatment",
    "Market price information"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <h3 className="font-semibold text-gray-800">Krishi Sahayak</h3>
            <p className="text-xs text-gray-600">AI-powered farming help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Welcome Message */}
        <div className="flex items-start gap-2">
          <span className="text-lg">🤖</span>
          <div className="bg-green-50 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-green-800">
              Hello! I'm your farming assistant. Ask me about soil health, crop selection, irrigation, or pest control.
            </p>
          </div>
        </div>

        {/* Chat History */}
        {chatHistory && chatHistory.length > 0 && chatHistory.slice().reverse().map((chat, index) => (
          <div key={chat._id || index} className="space-y-2">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">{chat.question}</p>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex items-start gap-2">
              <span className="text-lg">🤖</span>
              <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-800">{chat.answer}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <span className="text-lg">🤖</span>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {(!chatHistory || chatHistory.length === 0) && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your farming question..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
