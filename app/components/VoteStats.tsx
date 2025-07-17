import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VotingConfig } from "./VotingDisplay";

interface VoteStatsProps {
  config: VotingConfig;
}

export const VoteStats = ({ config }: VoteStatsProps) => {
  return (
    <div className="mb-8">
      {/* Presentation Title Card */}
      <Card className="p-6 bg-gradient-card border-border shadow-card mb-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {config.presentationTitle}
          </h2>
          <p className="text-muted-foreground">Vote for your preferred table</p>
        </div>
      </Card>

      {/* Available Tables */}
      <Card className="p-6 bg-gradient-card border-border shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Available Tables
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {config.availableTables.map((table) => (
            <div
              key={table}
              className="flex items-center justify-center rounded-lg  border border-border hover:shadow-vote transition-all duration-300 py-1"
            >
              Table {table}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
