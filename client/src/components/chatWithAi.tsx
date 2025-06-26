"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/app/store";
import { fetchAiHistory, chatAi } from "../redux/features/aiSlice";
import { AiOutlineSend } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getNewUserData } from "@/redux/features/authSlice";

const ChatWithAI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState<string>("");
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const aiHistory = useSelector((state: RootState) => state.aichat.aiHistory);
  const loading = useSelector((state: RootState) => state.aichat.loading);

  // Fetch ai history
  useEffect(() => {
    dispatch(fetchAiHistory());
    dispatch(getNewUserData());
  }, [dispatch]);

  // Scroll to the bottom whenever aiHistory updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [aiHistory, pendingQuestion]);

  const handleGenerate = () => {
    if (!input.trim() || loading) return;
    setPendingQuestion(input); // Save current input before sending
    dispatch(chatAi(input));
    setInput("");
  };

  return (
    <div className="w-[400px] mx-auto h-[600px] flex flex-col bg-white border-gray-300 border-[1px] rounded-md font-poppins">
      {/* Header */}
      <div className="p-3 border rounded-md bg-offWhite text-textColor  font-semibold flex items-center gap-1">
        <img src="/logo.png" alt="logo" className="w-14 h-14" />
        <div>
          <h1 className="text-[15px] text-textColor">ScrumX.ai</h1>
          <p className="text-[12px] text-placeholder">
            How can I help you today?
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-none"
      >
        {aiHistory.length === 0 && !pendingQuestion ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Hi, {user?.firstName}
            </p>
          </div>
        ) : (
          <>
            {aiHistory.map((chat, index) => (
              <div key={index} className="flex flex-col p-2 my-2">
                {/* User Message */}
                <div className="self-end bg-gray-200 text-[13px] text-black px-4 py-3 rounded-md max-w-sm shadow-md">
                  {chat.question}
                </div>

                {/* AI Response */}
                <div className="self-start bg-gray-50 text-[13px] text-black px-6 py-4 rounded-md w-full shadow-md border mt-3">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({
                        inline = false,
                        className,
                        children,
                        ...props
                      }: {
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                      }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={dracula}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {chat.answer}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Show "Thinking..." for the latest user input */}
            {loading && (
              <div className="flex flex-col">
                <div className="self-end bg-gray-200 text-[12px] text-black px-4 py-2 rounded-lg max-w-sm shadow-md">
                  {pendingQuestion}
                </div>
                <div className="self-start text-black px-6 py-3 rounded-lg w-full  mt-1">
                  <span className="animate-pulse text-[13px]">Thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 rounded-md bg-pureWhite flex items-center gap-2">
        {/* Input Box */}
        <div className="flex-1 flex items-center bg-gray-200 rounded-md px-4 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message ScrumX"
            className="flex-1 bg-transparent text-black resize-none outline-none focus:outline-none h-10 max-h-32 overflow-y-auto text-[13px]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <button
            onClick={handleGenerate}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={loading}
          >
            <AiOutlineSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithAI;
