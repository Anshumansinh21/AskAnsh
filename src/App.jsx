import { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import logo from './assets/My_Logo.jpeg';
motion;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
        },
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

      // Handle rate limit
      if (response.status === 429) {
        const resetTimestamp = response.headers.get('X-RateLimit-Reset');
        const resetDate = resetTimestamp
          ? new Date(Number(resetTimestamp)).toLocaleString()
          : 'Unknown time';
        const errorMessage = `⚠️ You've hit the daily free usage limit.\n\n⏳ It will reset at: **${resetDate}**.\n\nConsider upgrading for more access.`;
        setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
        return;
      }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col">
      {/* Glass Morphism Header */}
      <header className="w-full py-4 px-6 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800/50 fixed top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-700/50 shadow-lg"
            >
              <img 
                src={logo} 
                alt="Anshuman's Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              AskAnsh
            </h1>
          </div>
          <motion.a 
            href="https://anshumansinh-pf.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-medium text-gray-300 hover:text-white flex items-center space-x-2 transition-all"
          >
            <span>View Portfolio</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 pt-20 pb-28 px-4 max-w-3xl w-full mx-auto">
        {/* Messages Area */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-28 h-28 mb-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full flex items-center justify-center shadow-lg"
              >
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-full animate-pulse">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-2"
              >
                Ask About Anshuman
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 max-w-md"
              >
                Get to know about his professional journey, skills, and experiences.
              </motion.p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 mt-1 rounded-full flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600 ml-3' : 'bg-gradient-to-br from-indigo-500 to-purple-600 mr-3'}`}>
                      {msg.role === 'user' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div
                      className={`rounded-2xl p-4 shadow-lg ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-800/90 text-gray-100 rounded-bl-none border border-gray-700/50'}`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="flex-shrink-0 w-9 h-9 mt-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mr-3 flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="bg-gray-800/90 rounded-2xl rounded-bl-none p-4 border border-gray-700/50 shadow-lg">
                      <div className="flex space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse delay-75"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950/80 to-transparent pt-10 pb-6 px-4 z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <TextareaAutosize
              ref={inputRef}
              className="w-full p-4 pr-16 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 focus:border-blue-500/70 outline-none resize-none text-white placeholder-gray-500 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Anshuman..."
              minRows={1}
              maxRows={6}
              disabled={loading}
            />
            <motion.button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              whileHover={(!loading && input.trim()) ? { scale: 1.1 } : {}}
              whileTap={(!loading && input.trim()) ? { scale: 0.9 } : {}}
              className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-200 ${loading || !input.trim()
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;