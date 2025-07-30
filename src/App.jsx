import { useState, useRef, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessages = [...messages, { role: 'user', content: input }];
  setMessages(newMessages);
  setInput('');
  setLoading(true);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
  'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': window.location.origin,
  'X-Title': 'AskAnsh'
}
,
      body: JSON.stringify({
  model: "deepseek/deepseek-r1-0528:free",
  messages: [
    {
      role: 'system',
      content: `You are a helpful assistant who knows Rathore Anshumansinh personally.

Anshuman is a self-taught front-end developer with a passion for UI/UX design and user-friendly digital experiences. He began his tech journey at 19 while studying at Gujarat University, starting as a Software Support Executive at Height8 Technologies. From there, he transitioned into frontend development roles at Augmetic Technosys and Add Pearlinfo Pvt. Ltd.

He has over 2 years of experience working with clients from the USA, Norway, and Ghana, and has developed projects using HTML, CSS, JavaScript, React, Redux, WordPress, Tailwind, Figma, and Canva. He also creates UI mockups, promotional content, and graphics.

Anshuman is currently exploring full-stack development with a focus on Node.js. He's known for his ownership, professionalism, and adaptability, having managed projects solo and represented his company at GCCI Gate 2024.

If someone asks about Anshuman, you should reply confidently and knowledgeably, as if you know him well.`
    },
    ...newMessages
  ]
})

    });

    const raw = await response.text();
    console.log('Raw API response:', raw);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${raw}`);
    }

    const data = JSON.parse(raw);
    const reply = data?.choices?.[0]?.message?.content || 'No response.';
    setMessages([...newMessages, { role: 'assistant', content: reply }]);
  } catch (err) {
    console.error('API Error:', err);
    setMessages([...newMessages, { role: 'assistant', content: 'Error fetching response.' }]);
  } finally {
    setLoading(false);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

console.log('Using API Key:', import.meta.env.VITE_OPENROUTER_API_KEY);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-2">AskAnsh</h1>
      <p className="text-sm text-gray-400 mb-6">Ask me about Anshumansinh Rathore</p>

      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto max-h-[70vh]">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-700">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="flex gap-2">
            <textarea
              rows="2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              className="flex-1 p-2 rounded bg-gray-700 text-white resize-none outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 px-4 py-2 rounded text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
