interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
}

const initialChats: Chat[] = [
  { id: 1, title: 'Landing page design', messages: [] },
  { id: 2, title: 'React component ideas', messages: [] },
];

function Component() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [showModelMenu, setShowModelMenu] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId)!;

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Update chat
    const updatedChats = chats.map(c =>
      c.id === activeChatId ? { ...c, messages: newMessages } : c
    );
    setChats(updatedChats);

    setInput('');

    // Fake assistant reply
    setTimeout(() => {
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sounds like a great project. Let's build it with glassmorphism and clean React state.",
      };
      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      const finalChats = chats.map(c =>
        c.id === activeChatId ? { ...c, messages: finalMessages } : c
      );
      setChats(finalChats);
    }, 800);
  };

  const switchChat = (id: number) => {
    setActiveChatId(id);
    const chat = chats.find(c => c.id === id)!;
    setMessages(chat.messages);
  };

  const newChat = () => {
    const newId = Math.max(0, ...chats.map(c => c.id)) + 1;
    const newChatItem: Chat = { id: newId, title: 'New conversation', messages: [] };
    setChats([...chats, newChatItem]);
    setActiveChatId(newId);
    setMessages([]);
  };

  const models = ['gpt-4o', 'claude-3.5', 'o1-preview'];

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white/5 border-r border-white/10 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-white/10">
          <button
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 transition-all py-2.5 rounded-2xl text-sm font-medium border border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => switchChat(chat.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center gap-3 ${
                activeChatId === chat.id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-white/5 backdrop-blur-xl">
          <div className="font-semibold tracking-tight">ChatGPT</div>

          <div className="relative">
            <button
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
            >
              {model}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showModelMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-xl py-1 z-50">
                {models.map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setModel(m);
                      setShowModelMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-semibold tracking-tighter mb-3">What are you building?</div>
                <p className="text-white/60">Start a new conversation below</p>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-5 py-3 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-white/5 border border-white/10 backdrop-blur-xl'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex gap-3 items-end max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Message ChatGPT…"
                className="w-full resize-none bg-white/5 border border-white/10 rounded-3xl px-5 py-3.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/20 min-h-[52px] max-h-40"
                rows={1}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="h-[52px] w-[52px] flex items-center justify-center bg-white text-black rounded-3xl disabled:opacity-40 transition-all hover:bg-white/90 active:scale-[0.985]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
