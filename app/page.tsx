"use client"
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
    wsRef.current = ws;


    ws.onopen = () => {
      setConnectionStatus('connected');
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(`{"event":"ping"}`);
      }
    }, 29000);

    return () => {
      clearInterval(pingInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [])  

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(newMessage);
      setNewMessage('');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-lg flex flex-col h-[80vh] border border-gray-200">
        <div className={`px-6 py-3 text-sm font-medium rounded-t-xl ${
          connectionStatus === 'connected' ? 'bg-green-50 text-green-700 border-b border-green-100' :
          connectionStatus === 'disconnected' ? 'bg-red-50 text-red-700 border-b border-red-100' :
          'bg-yellow-50 text-yellow-700 border-b border-yellow-100'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'disconnected' ? 'bg-red-500' :
              'bg-yellow-500'
            }`}></div>
            Status: {connectionStatus}
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
        >
          {messages.map((message, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
            >
              <p className="text-gray-800 font-medium">{message}</p>
            </div>
          ))}
        </div>

        <form 
          onSubmit={sendMessage}
          className="border-t border-gray-100 p-6 bg-white rounded-b-xl"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={connectionStatus !== 'connected'}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                connectionStatus === 'connected'
                  ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm hover:shadow'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
    // <div>
    //   <div className="font-bold">Status: {connectionStatus}</div>
      
    //   <div>
    //     {messages.map((message, index) => (
    //       <div key={index}>{message}</div>
    //     ))}
    //   </div>

    //   <form onSubmit={sendMessage}>
    //     <input
    //       type="text"
    //       value={newMessage}
    //       onChange={(e) => setNewMessage(e.target.value)}
    //       placeholder="Type your message..."
    //       className="border border-gray-400 rounded p-2"
    //     />
    //     <button type="submit" disabled={connectionStatus !== 'connected'}>
    //       Send
    //     </button>
    //   </form>
    // </div>
  );
}
