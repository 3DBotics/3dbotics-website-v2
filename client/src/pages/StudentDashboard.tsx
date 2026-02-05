import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Circle, Clock, MessageCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import LAILAChat from "@/components/LAILAChat";

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
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  useEffect(() => {
    const storedStudent = sessionStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    } else {
      setLocation("/student/login");
    }
  }, [setLocation]);

  // Mock mission stages - in production, these would come from the lesson plan
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
    toast.success("Activity started!");
    // In production, this would update student progress in the database
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
    toast.success("Stage completed! Great job!");
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {student.name}!</h1>
              <p className="text-sm text-muted-foreground">Your Learning Mission</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Click the chat bubble to ask LAILA for help!
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mission Timeline - Left Side */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Mission Timeline
                </CardTitle>
                <CardDescription>60-minute learning journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-muted-foreground">{completedStages}/{missionStages.length}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Timeline Stages */}
                <div className="space-y-4">
                  {missionStages.map((stage, index) => (
                    <div key={stage.id} className="relative">
                      {/* Connector Line */}
                      {index < missionStages.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
                      )}
                      
                      <div className="flex gap-3">
                        {/* Status Icon */}
                        <div className="relative z-10">
                          {stage.status === "completed" ? (
                            <CheckCircle className="h-8 w-8 text-green-500 fill-green-500/20" />
                          ) : stage.status === "active" ? (
                            <Circle className="h-8 w-8 text-primary fill-primary/20 animate-pulse" />
                          ) : (
                            <Circle className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>

                        {/* Stage Info */}
                        <div className="flex-1 pb-4">
                          <div className="font-medium">{stage.title}</div>
                          <div className="text-sm text-muted-foreground">{stage.duration} minutes</div>
                          <div className="text-xs text-muted-foreground mt-1">{stage.description}</div>
                          
                          {stage.status === "active" && (
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => handleStartActivity(stage.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Game Area - Right Side */}
          <div className="lg:col-span-2">
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle>
                  {activeStage ? activeStage.title : "Ready to Start"}
                </CardTitle>
                <CardDescription>
                  {activeStage
                    ? activeStage.description
                    : "Begin your learning mission when you're ready!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeStage ? (
                  <div className="space-y-6">
                    {/* Activity Content Area */}
                    <div className="border-2 border-dashed rounded-lg p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                      <div className="space-y-4">
                        <div className="text-6xl">🎮</div>
                        <h3 className="text-2xl font-bold">Interactive Learning Activity</h3>
                        <p className="text-muted-foreground max-w-md">
                          {activeStage.id === "intro" &&
                            "Get warmed up with a fun introduction to today's topic!"}
                          {activeStage.id === "core" &&
                            "Dive deep into the core concepts with hands-on activities."}
                          {activeStage.id === "seatwork" &&
                            "Time to show what you've learned! Complete the assessment."}
                        </p>
                        <div className="flex gap-3 justify-center pt-4">
                          <Button
                            size="lg"
                            onClick={() => handleCompleteStage(activeStage.id)}
                          >
                            Complete Stage
                          </Button>
                          <div className="text-sm text-muted-foreground">
                            Need help? Click the chat bubble below!
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stage Timer */}
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Stage Time</span>
                        <span className="text-muted-foreground">{activeStage.duration} minutes</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold mb-2">
                      {completedStages === missionStages.length
                        ? "Mission Complete!"
                        : "Ready to Begin?"}
                    </h3>
                    <p className="text-muted-foreground">
                      {completedStages === missionStages.length
                        ? "Congratulations! You've completed all stages."
                        : "Start your first activity when you're ready."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* LAILA Chat Bubble */}
      {student && <LAILAChat studentId={student.id} lessonPlanId={currentLesson?.id} />}
    </div>
  );
}
