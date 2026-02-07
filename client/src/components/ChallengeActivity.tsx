import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Star } from "lucide-react";
import { useState } from "react";

interface ChallengeActivityProps {
  title: string;
  description: string;
  points: number;
  onComplete: () => void;
}

export default function ChallengeActivity({ title, description, points, onComplete }: ChallengeActivityProps) {
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!response.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <Card className="border-amber-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full">
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="text-sm font-bold">{points} pts</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!submitted ? (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">{description}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Response:</label>
              <Textarea
                placeholder="Type your answer here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!response.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              Submit Challenge
            </Button>
          </>
        ) : (
          <div className="p-6 bg-amber-500/10 text-amber-500 rounded-lg text-center space-y-2">
            <Trophy className="h-12 w-12 mx-auto" />
            <p className="font-semibold text-lg">Challenge Complete!</p>
            <p className="text-sm">You earned {points} points! 🌟</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
