import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Vote } from "./VotingDisplay";
import { Phone, Calendar, Hash } from "lucide-react";

interface VoteCardProps {
    vote: Vote;
    isAnimating: boolean;
}

const maskPhoneNumber = (phone: string): string => {
    if (phone.length < 4) return phone;
    const visiblePart = phone.slice(-4);
    const hiddenPart = "*".repeat(phone.length - 4);
    return hiddenPart + visiblePart;
};

const getTableColor = (tableNumber: number): string => {
    const colors = [
        "bg-primary text-primary-foreground",
        "bg-accent text-accent-foreground",
        "bg-vote-success text-white",
        "bg-vote-info text-white",
        "bg-vote-warning text-black",
        "bg-destructive text-destructive-foreground"
    ];
    return colors[tableNumber % colors.length];
};

export const VoteCard = ({ vote, isAnimating }: VoteCardProps) => {
    return (
        <Card
            id={`vote-${vote.id}`}
            className={`
        p-4 border border-border/50 bg-gradient-card shadow-card
        hover:shadow-vote transition-all duration-300
        ${isAnimating ? "animate-vote-pop-in" : ""}
      `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Phone Number */}
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-mono">
                            {maskPhoneNumber(vote.phoneNumber)}
                        </span>
                    </div>

                    {/* Table Number */}
                    <Badge
                        className={`
              ${getTableColor(vote.tableNumber)} 
              shadow-sm hover:scale-105 transition-transform duration-200
            `}
                    >
                        <Hash className="h-3 w-3 mr-1" />
                        Table {vote.tableNumber}
                    </Badge>
                </div>

                {/* Timestamp */}
                <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                        {vote.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        })}
                    </span>
                </div>
            </div>

            {/* Voting indicator */}
            <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    Vote submitted successfully
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-vote-success rounded-full animate-pulse"></div>
                    <span className="text-xs text-vote-success font-medium">
                        Live
                    </span>
                </div>
            </div>
        </Card>
    );
};
