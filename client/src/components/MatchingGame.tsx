import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shuffle } from "lucide-react";
import { useState, useEffect } from "react";

interface MatchingGameProps {
  pairs: [string, string][]; // [term, definition]
  onComplete: () => void;
}

export default function MatchingGame({ pairs, onComplete }: MatchingGameProps) {
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedDef, setSelectedDef] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [correctMatches, setCorrectMatches] = useState(0);

  useEffect(() => {
    // Shuffle definitions
    const defs = pairs.map(p => p[1]);
    setShuffledDefinitions(defs.sort(() => Math.random() - 0.5));
  }, [pairs]);

  const handleTermClick = (index: number) => {
    if (matched.has(index)) return;
    setSelectedTerm(index);
    
    if (selectedDef !== null) {
      checkMatch(index, selectedDef);
    }
  };

  const handleDefClick = (index: number) => {
    if (matched.has(index)) return;
    setSelectedDef(index);
    
    if (selectedTerm !== null) {
      checkMatch(selectedTerm, index);
    }
  };

  const checkMatch = (termIdx: number, defIdx: number) => {
    const term = pairs[termIdx][0];
    const def = shuffledDefinitions[defIdx];
    
    // Check if this definition belongs to this term
    const isMatch = pairs[termIdx][1] === def;
    
    if (isMatch) {
      setMatched(prev => new Set([...prev, termIdx, defIdx]));
      setCorrectMatches(prev => prev + 1);
      
      if (correctMatches + 1 === pairs.length) {
        setTimeout(() => onComplete(), 1000);
      }
    }
    
    setSelectedTerm(null);
    setSelectedDef(null);
  };

  const resetGame = () => {
    setMatched(new Set());
    setCorrectMatches(0);
    setSelectedTerm(null);
    setSelectedDef(null);
    const defs = pairs.map(p => p[1]);
    setShuffledDefinitions(defs.sort(() => Math.random() - 0.5));
  };

  return (
    <Card className="border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              🎮 Matching Game
            </CardTitle>
            <CardDescription>Match the terms with their definitions</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            Matched: {correctMatches} / {pairs.length}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Terms Column */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-center mb-2">Terms</p>
            {pairs.map((pair, index) => (
              <button
                key={`term-${index}`}
                onClick={() => handleTermClick(index)}
                disabled={matched.has(index)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  matched.has(index)
                    ? "border-green-500 bg-green-500/10 opacity-50"
                    : selectedTerm === index
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-border hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{pair[0]}</span>
                  {matched.has(index) && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </button>
            ))}
          </div>

          {/* Definitions Column */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-center mb-2">Definitions</p>
            {shuffledDefinitions.map((def, index) => (
              <button
                key={`def-${index}`}
                onClick={() => handleDefClick(index)}
                disabled={matched.has(index)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  matched.has(index)
                    ? "border-green-500 bg-green-500/10 opacity-50"
                    : selectedDef === index
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-border hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{def}</span>
                  {matched.has(index) && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {correctMatches === pairs.length && (
          <div className="mt-4 p-4 bg-green-500/10 text-green-500 rounded-lg text-center">
            <p className="font-semibold">🎉 Perfect! All matched correctly!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
