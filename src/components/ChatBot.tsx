import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [message, setMessage] = useState("");
  const [sessionMessages, setSessionMessages] = useState<{question: string, answer: string}[]>([]);
  const [optimisticUserMessage, setOptimisticUserMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const saveChatMessage = useMutation(api.chatbot.saveChatMessage);
  const chatHistory = useQuery(api.chatbot.getChatHistory);
  const farmer = useQuery(api.farmers.getCurrentFarmer);
  const recommendations = useQuery(api.recommendations.getLatestRecommendations);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, sessionMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const currentMessage = message.trim();
    setOptimisticUserMessage(currentMessage);
    setMessage(""); // Instantly clear input for better UX
    setIsLoading(true);
    setError(null);

    try {
      // Build context from REAL farmer profile data
      let farmerContext = "No farmer profile available.";
      if (farmer) {
        farmerContext = `Farmer: ${farmer.name}, Location: ${farmer.location}, Farm: ${farmer.farmSize} acres, Soil: ${farmer.soilType} (pH ${farmer.soilPh}), Rainfall: ${farmer.rainfall}mm/yr, Temp: ${farmer.temperature.min}-${farmer.temperature.max}°C`;
        if (farmer.crops?.length) {
          farmerContext += `, Growing: ${farmer.crops.join(", ")}`;
        }
      }

      let cropContext = "";
      if (recommendations?.crops?.length) {
        const topCrops = recommendations.crops.slice(0, 3).map(r =>
          `${r.crop?.name} (CSI:${r.csi}, ₹${r.crop?.marketPrice}/q)`
        ).join(", ");
        cropContext = `\nRecommended crops: ${topCrops}`;
      }

      const fullPrompt = `You are Krishi Sahayak. Answer in 1 to 2 short sentences ONLY. Maximum 40 words. Be direct.

${farmerContext}${cropContext}

Question: ${currentMessage}`;

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

      // Add to local session so it immediately displays regardless of DB
      setSessionMessages(prev => [...prev, { question: currentMessage, answer }]);

      // Save the response persistent via Convex
      if (farmer) {
        try {
          await saveChatMessage({
            farmerId: farmer._id,
            question: currentMessage,
            answer: answer,
          });
        } catch (dbError) {
          console.error("Failed to save message to Convex:", dbError);
          // Non-fatal, we still show the message locally
        }
      }

    } catch (error: any) {
      console.error("Failed to fetch from local Ollama:", error);
      setError(`Error connecting to AI: ${error.message || "Ensure 'ollama serve' is running and 'tinyllama' is pulled."}`);
    } finally {
      setIsLoading(false);
      setOptimisticUserMessage(null);
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

        {/* Chat History from Server */}
        {chatHistory && chatHistory.length > 0 && chatHistory.slice().reverse().map((chat, index) => (
          <div key={`db-${chat._id || index}`} className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">{chat.question}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🤖</span>
              <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-800">{chat.answer}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Local Session Messages (for guests or newly added) */}
        {sessionMessages.map((chat, index) => (
          <div key={`local-${index}`} className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">{chat.question}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🤖</span>
              <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-800">{chat.answer}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Optimistic User Message (While Waiting for Bot) */}
        {optimisticUserMessage && (
          <div className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">{optimisticUserMessage}</p>
              </div>
            </div>
          </div>
        )}

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
      {((!chatHistory || chatHistory.length === 0) && sessionMessages.length === 0) && (
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
