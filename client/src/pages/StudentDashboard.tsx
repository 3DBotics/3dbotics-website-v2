import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, MessageCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface Student {
  id: number;
  studentId: string;
  name: string;
  grade?: string;
}

interface MissionStage {
  id: string;
  title: string;
  duration: number;
  description: string;
  status: "pending" | "active" | "completed";
}

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [student, setStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedStudent = sessionStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    } else {
      setLocation("/laila/student/login");
    }
  }, [setLocation]);

  // Mock mission stages
  const [missionStages, setMissionStages] = useState<MissionStage[]>([
    {
      id: "intro",
      title: "Gamified Introduction",
      duration: 10,
      description: "Get ready for an exciting learning adventure!",
      status: "active",
    },
    {
      id: "core",
      title: "Core Skill Building",
      duration: 30,
      description: "Master 3D Modeling, AI, or Robotics concepts",
      status: "pending",
    },
    {
      id: "seatwork",
      title: "Evaluated Seatwork",
      duration: 20,
      description: "Show what you've learned!",
      status: "pending",
    },
  ]);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const totalTime = 60; // 60 minutes total

  const handleStartActivity = (stageId: string) => {
    toast({
      title: "Success",
      description: "Activity started!",
    });
  };

  const handleCompleteStage = (stageId: string) => {
    setMissionStages((prev) =>
      prev.map((stage, index) => {
        if (stage.id === stageId) {
          return { ...stage, status: "completed" };
        }
        // Activate next stage
        if (prev[index - 1]?.id === stageId && stage.status === "pending") {
          return { ...stage, status: "active" };
        }
        return stage;
      })
    );
    toast({
      title: "Success",
      description: "Stage completed! Great job!",
    });
  };

  const activeStage = missionStages.find((s) => s.status === "active");
  const completedStages = missionStages.filter((s) => s.status === "completed").length;
  const progressPercentage = (completedStages / missionStages.length) * 100;

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Welcome, {student.name}!</h1>
            <p className="text-muted-foreground">Your 60-minute learning journey</p>
          </div>
          <Button variant="outline" onClick={() => {
            sessionStorage.removeItem("student");
            setLocation("/laila/student/login");
          }}>
            Logout
          </Button>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Mission Progress</CardTitle>
            <CardDescription>
              {completedStages} of {missionStages.length} stages completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Mission Timeline */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Mission Timeline</h2>
            <div className="space-y-4">
              {missionStages.map((stage, index) => (
                <Card
                  key={stage.id}
                  className={`
                    ${stage.status === "active" ? "border-primary shadow-lg" : ""}
                    ${stage.status === "completed" ? "bg-muted/50" : ""}
                  `}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {stage.status === "completed" && (
                          <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                        )}
                        {stage.status === "active" && (
                          <Clock className="h-6 w-6 text-primary mt-1 animate-pulse" />
                        )}
                        {stage.status === "pending" && (
                          <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{stage.title}</CardTitle>
                          <CardDescription>{stage.description}</CardDescription>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {stage.duration} min
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Activity Area */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Learning Game</h2>
            {activeStage ? (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>{activeStage.title}</CardTitle>
                  <CardDescription>
                    Duration: {activeStage.duration} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Play className="h-16 w-16 mx-auto text-primary" />
                      <p className="text-lg font-medium">
                        {activeStage.id === "intro" && "Interactive 3D Model Explorer"}
                        {activeStage.id === "core" && "AI-Powered Design Challenge"}
                        {activeStage.id === "seatwork" && "Build Your Own Robot"}
                      </p>
                      <Button onClick={() => handleStartActivity(activeStage.id)}>
                        Start Activity
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleCompleteStage(activeStage.id)}
                    >
                      Complete Stage
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2">Mission Complete!</h3>
                  <p className="text-muted-foreground">
                    Great job! You've completed all stages of today's lesson.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
