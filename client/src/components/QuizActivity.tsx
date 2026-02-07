import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface QuizActivityProps {
  question: string;
  options: string[];
  correctIndex: number;
  onComplete: (correct: boolean) => void;
}

export default function QuizActivity({ question, options, correctIndex, onComplete }: QuizActivityProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    
    const correct = selectedIndex === correctIndex;
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  return (
    <Card className="border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Quiz Challenge
        </CardTitle>
        <CardDescription>Choose the correct answer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-lg font-medium">{question}</p>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedIndex(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedIndex === index
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-border hover:border-cyan-500/50"
              } ${
                showResult && index === correctIndex
                  ? "border-green-500 bg-green-500/10"
                  : showResult && index === selectedIndex && !isCorrect
                  ? "border-red-500 bg-red-500/10"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && index === correctIndex && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showResult && index === selectedIndex && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
          >
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div
            className={`p-4 rounded-lg text-center ${
              isCorrect ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
            }`}
          >
            {isCorrect ? (
              <p className="font-semibold">🎉 Correct! Great job!</p>
            ) : (
              <p className="font-semibold">💡 Not quite! Keep learning!</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
