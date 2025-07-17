"use client";
import "./App.css";
import "./index.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { VotingDisplay, Vote } from "./components/VotingDisplay";
import { useToast } from "./hooks/use-toast";
import confetti from "canvas-confetti";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
    };

    ws.onmessage = (event) => {
      if (event.data == "") return;
      const vote: Vote = JSON.parse(event.data);
      handleNewVote({
        phoneNumber: vote.phoneNumber,
        tableNumber: vote.tableNumber,
      });
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
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(newMessage);
      setNewMessage("");
    }
  };

  const [votes, setVotes] = useState<Vote[]>([]);
  const { toast } = useToast();

  const handleNewVote = useCallback(
    (voteData: Omit<Vote, "id" | "timestamp">) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(newMessage);
      }
      confetti({
        particleCount: 70,
        spread: 120,
        origin: { y: 1 },
      });
      const newVote: Vote = {
        ...voteData,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
      };

      setVotes((prev) => [...prev, newVote]);

      toast({
        title: "New Vote Received!",
        description: `Table ${voteData.tableNumber
          } vote from ${voteData.phoneNumber.slice(-4)}`,
      });
    },
    [toast],
  );

  // Simulate receiving votes via POST request
  // In a real app, this would be handled by your backend
  const simulateIncomingVote = () => {
    const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randomTable = tables[Math.floor(Math.random() * tables.length)];
    const randomPhone = `+1${Math.floor(
      Math.random() * 9000000000 + 1000000000,
    )}`;

    handleNewVote({
      phoneNumber: randomPhone,
      tableNumber: randomTable,
    });
  };

  return (
    <>
      <VotingDisplay votes={votes} onNewVote={handleNewVote} />
      {connectionStatus}
    </>
  );
}
