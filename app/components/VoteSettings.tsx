import { useState } from 'react';
import { VotingConfig } from './VotingDisplay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface VoteSettingsProps {
  config: VotingConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: VotingConfig) => void;
}

export const VoteSettings = ({ config, isOpen, onClose, onSave }: VoteSettingsProps) => {
  const [editConfig, setEditConfig] = useState<VotingConfig>(config);
  const [newTable, setNewTable] = useState('');

  const handleSave = () => {
    onSave(editConfig);
    onClose();
  };

  const addTable = () => {
    const tableNum = parseInt(newTable);
    if (tableNum && !editConfig.availableTables.includes(tableNum)) {
      setEditConfig(prev => ({
        ...prev,
        availableTables: [...prev.availableTables, tableNum].sort((a, b) => a - b)
      }));
      setNewTable('');
    }
  };

  const removeTable = (tableNum: number) => {
    setEditConfig(prev => ({
      ...prev,
      availableTables: prev.availableTables.filter(t => t !== tableNum)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voting Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Presentation Title</Label>
            <Input
              id="title"
              value={editConfig.presentationTitle}
              onChange={(e) => setEditConfig(prev => ({ ...prev, presentationTitle: e.target.value }))}
              placeholder="Enter presentation title"
            />
          </div>

          <div>
            <Label>Available Tables</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {editConfig.availableTables.map((table) => (
                <Badge key={table} variant="secondary" className="flex items-center gap-1">
                  Table {table}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeTable(table)}
                  />
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                type="number"
                value={newTable}
                onChange={(e) => setNewTable(e.target.value)}
                placeholder="Table number"
                className="flex-1"
              />
              <Button onClick={addTable} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};