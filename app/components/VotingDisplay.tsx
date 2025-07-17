"use client";
import { useState, useEffect } from "react";
import { VoteCard } from "./VoteCard";
import { VoteStats } from "./VoteStats";
import { VoteSettings } from "./VoteSettings";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";

export interface Vote {
    id: string;
    phoneNumber: string;
    tableNumber: number;
    timestamp: Date;
}

export interface VotingConfig {
    presentationTitle: string;
    availableTables: number[];
}

interface VotingDisplayProps {
    votes: Vote[];
    onNewVote: (vote: Omit<Vote, "id" | "timestamp">) => void;
}

export const VotingDisplay = ({ votes, onNewVote }: VotingDisplayProps) => {
    const [animatingVotes, setAnimatingVotes] = useState<string[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const [config, setConfig] = useState<VotingConfig>({
        presentationTitle: "Presentation Title",
        availableTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });

    useEffect(() => {
        const saved = localStorage.getItem("votingConfig");
        if (saved) {
            try {
                setConfig(JSON.parse(saved));
            } catch (e) {
                console.warn("Invalid config in localStorage");
            }
        }
    }, []);

    const saveConfig = (newConfig: VotingConfig) => {
        setConfig(newConfig);
        localStorage.setItem("votingConfig", JSON.stringify(newConfig));
    };

    useEffect(() => {
        if (votes.length > 0) {
            const latestVote = votes[votes.length - 1];
            setAnimatingVotes((prev) => [...prev, latestVote.id]);

            // Remove animation class after animation completes
            setTimeout(() => {
                setAnimatingVotes((prev) => prev.filter((id) => id !== latestVote.id));
            }, 600);

            // Trigger slide-up animation for existing votes
            if (votes.length > 1) {
                const existingVoteIds = votes.slice(0, -1).map((vote) => vote.id);
                existingVoteIds.forEach((id) => {
                    const element = document.getElementById(`vote-${id}`);
                    if (element) {
                        element.classList.add("animate-vote-slide-up");
                        setTimeout(() => {
                            element.classList.remove("animate-vote-slide-up");
                        }, 300);
                    }
                });
            }
        }
    }, [votes.length]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 relative">
                    <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>

                {/* Stats */}
                <VoteStats config={config} />

                {/* Voting Feed */}
                <Card className="bg-gradient-card border-border shadow-card p-6">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">
                        Live Vote Feed
                    </h2>

                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                        {votes.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <div className="animate-pulse-glow inline-block p-4 rounded-full bg-muted/50 mb-4">
                                    📊
                                </div>
                                <p>Waiting for votes to come in...</p>
                            </div>
                        ) : (
                            votes
                                .slice()
                                .reverse()
                                .map((vote) => (
                                    <VoteCard
                                        key={vote.id}
                                        vote={vote}
                                        isAnimating={animatingVotes.includes(vote.id)}
                                    />
                                ))
                        )}
                    </div>
                </Card>

                {/* Mock Vote Generator for Demo */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            const randomTable =
                                config.availableTables[
                                Math.floor(Math.random() * config.availableTables.length)
                                ];
                            const mockVote = {
                                phoneNumber: `+1${Math.floor(
                                    Math.random() * 9000000000 + 1000000000,
                                )}`,
                                tableNumber: randomTable,
                            };
                            onNewVote(mockVote);
                        }}
                        className="px-6 py-3 bg-gradient-primary rounded-lg shadow-vote hover:shadow-glow transition-all duration-300 text-primary-foreground font-semibold hover:scale-105"
                    >
                        Simulate Vote (Demo)
                    </button>
                </div>
            </div>

            {/* Settings Modal */}
            <VoteSettings
                config={config}
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onSave={saveConfig}
            />
        </div>
    );
};
