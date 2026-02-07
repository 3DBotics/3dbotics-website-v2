import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, MessageCircle, Play, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import LAILAChat from "@/components/LAILAChat";
import QuizActivity from "@/components/QuizActivity";
import MatchingGame from "@/components/MatchingGame";
import ChallengeActivity from "@/components/ChallengeActivity";

interface Student {
  id: number;
  studentId: string;
  name: string;
  grade?: string;
}

interface ActivityData {
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
  matching?: {
    pairs: [string, string][];
  };
  challenge?: {
    title: string;
    description: string;
    points: number;
  };
}

interface ProcessedLesson {
  id: number;
  title: string;
  subject: string;
  processedContent: {
    analysis: string;
    timeline: string;
    activities: string;
    activityData?: ActivityData;
  };
}

interface MissionStage {
  id: string;
  title: string;
  duration: number;
  description: string;
  content: string;
  status: "pending" | "active" | "completed";
  activityType?: "quiz" | "matching" | "challenge" | "text";
  activityData?: ActivityData;
}

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [student, setStudent] = useState<Student | null>(null);
  const [availableLessons, setAvailableLessons] = useState<ProcessedLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<ProcessedLesson | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedStudent = sessionStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    } else {
      setLocation("/laila/student/login");
    }

    // Load processed lessons from localStorage (shared with Teacher)
    loadAvailableLessons();
  }, [setLocation]);

  const loadAvailableLessons = () => {
    try {
      const lessonsData = localStorage.getItem("laila_processed_lessons");
      if (lessonsData) {
        const lessons = JSON.parse(lessonsData);
        setAvailableLessons(lessons);
        
        // Auto-select the first lesson if none selected
        if (lessons.length > 0 && !selectedLesson) {
          setSelectedLesson(lessons[0]);
        }
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
    }
  };

  // Parse timeline from processed content to create mission stages
  const parseMissionStages = (lesson: ProcessedLesson | null): MissionStage[] => {
    if (!lesson) {
      return [
        {
          id: "intro",
          title: "Gamified Introduction",
          duration: 10,
          description: "Get ready for an exciting learning adventure!",
          content: "Select a lesson to begin your learning journey!",
          status: "pending",
        },
        {
          id: "core",
          title: "Core Skill Building",
          duration: 30,
          description: "Master key concepts",
          content: "Loading lesson content...",
          status: "pending",
        },
        {
          id: "seatwork",
          title: "Evaluated Seatwork",
          duration: 20,
          description: "Show what you've learned!",
          content: "Loading assessment content...",
          status: "pending",
        },
      ];
    }

    // Extract stages from timeline with actual lesson content
    const activityData = lesson.processedContent.activityData;
    
    return [
      {
        id: "intro",
        title: "Gamified Introduction",
        duration: 10,
        description: `Introduction to ${lesson.subject}`,
        content: `${lesson.processedContent.analysis.substring(0, 400)}\n\n🎮 Get ready for an exciting learning adventure!`,
        status: "active",
        activityType: "text",
      },
      {
        id: "core",
        title: "Core Skill Building",
        duration: 30,
        description: `Master ${lesson.subject} concepts`,
        content: `${lesson.processedContent.timeline.substring(0, 600)}`,
        status: "pending",
        activityType: activityData?.quiz ? "quiz" : activityData?.matching ? "matching" : "text",
        activityData: activityData,
      },
      {
        id: "seatwork",
        title: "Evaluated Seatwork",
        duration: 20,
        description: "Apply what you've learned!",
        content: `Complete the challenge to show what you've learned!`,
        status: "pending",
        activityType: activityData?.challenge ? "challenge" : "text",
        activityData: activityData,
      },
    ];
  };

  const [missionStages, setMissionStages] = useState<MissionStage[]>(parseMissionStages(null));
  const [timeElapsed, setTimeElapsed] = useState(0);
  const totalTime = 60; // 60 minutes total

  // Update mission stages when lesson is selected
  useEffect(() => {
    if (selectedLesson) {
      setMissionStages(parseMissionStages(selectedLesson));
      setTimeElapsed(0);
    }
  }, [selectedLesson]);

  const handleSelectLesson = (lesson: ProcessedLesson) => {
    setSelectedLesson(lesson);
    toast({
      title: "Lesson Loaded",
      description: `Ready to learn ${lesson.subject}!`,
    });
  };

  const handleStartActivity = (stageId: string) => {
    setMissionStages((prev) =>
      prev.map((stage) => {
        if (stage.id === stageId && stage.status === "active") {
          return { ...stage, status: "active" };
        }
        return stage;
      })
    );

    toast({
      title: "Activity Started",
      description: "Let's learn together!",
    });
  };

  const handleCompleteStage = (stageId: string) => {
    setMissionStages((prev) =>
      prev.map((stage, index) => {
        if (stage.id === stageId) {
          return { ...stage, status: "completed" };
        }
        // Move to next stage
        if (prev[index - 1]?.id === stageId && stage.status === "pending") {
          return { ...stage, status: "active" };
        }
        return stage;
      })
    );

    // Simulate time progression
    setTimeElapsed((prev) => Math.min(prev + 20, totalTime));

    toast({
      title: "Stage Complete!",
      description: "Great job! Moving to the next stage...",
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("student");
    setLocation("/laila/student/login");
  };

  const progress = (timeElapsed / totalTime) * 100;
  const activeStage = missionStages.find((s) => s.status === "active");

  if (!student) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Welcome, {student.studentId}!</h1>
            <p className="text-muted-foreground">Your 60-minute learning journey awaits</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowChat(!showChat)}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask LAILA
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Available Lessons */}
        {availableLessons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Available Lessons
              </CardTitle>
              <CardDescription>Select a lesson to begin learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {availableLessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className={`cursor-pointer transition-all ${
                      selectedLesson?.id === lesson.id
                        ? "border-cyan-500 border-2 bg-cyan-500/10"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleSelectLesson(lesson)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{lesson.title}</CardTitle>
                      <CardDescription>
                        <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                          {lesson.subject}
                        </span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedLesson && availableLessons.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No lessons available yet. Your teacher will upload lessons soon!
              </p>
            </CardContent>
          </Card>
        )}

        {selectedLesson && (
          <>
            {/* Mission Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Mission Progress</CardTitle>
                <CardDescription>
                  Learning: {selectedLesson.title} ({selectedLesson.subject})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {timeElapsed} / {totalTime} minutes
                    </span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Mission Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Mission Timeline</CardTitle>
                <CardDescription>Follow the path to complete your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {missionStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        {stage.status === "completed" ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : stage.status === "active" ? (
                          <Clock className="h-8 w-8 text-cyan-400 animate-pulse" />
                        ) : (
                          <Circle className="h-8 w-8 text-muted-foreground" />
                        )}
                        {index < missionStages.length - 1 && (
                          <div className="w-0.5 h-16 bg-border mt-2" />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{stage.title}</h3>
                          <span className="text-sm text-muted-foreground">{stage.duration} min</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>

                        {stage.status === "active" && stage.content && (
                          <div className="mt-3 p-4 bg-muted rounded-lg border border-cyan-500/30">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{stage.content}</p>
                          </div>
                        )}

                        {stage.status === "active" && (
                          <Button
                            onClick={() => handleCompleteStage(stage.id)}
                            className="mt-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                          >
                            Complete Stage
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Learning Activities */}
            {activeStage && activeStage.activityType === "quiz" && activeStage.activityData?.quiz && (
              <QuizActivity
                question={activeStage.activityData.quiz.question}
                options={activeStage.activityData.quiz.options}
                correctIndex={activeStage.activityData.quiz.correct}
                onComplete={(correct) => {
                  if (correct) {
                    handleCompleteStage(activeStage.id);
                  }
                }}
              />
            )}

            {activeStage && activeStage.activityType === "matching" && activeStage.activityData?.matching && (
              <MatchingGame
                pairs={activeStage.activityData.matching.pairs}
                onComplete={() => handleCompleteStage(activeStage.id)}
              />
            )}

            {activeStage && activeStage.activityType === "challenge" && activeStage.activityData?.challenge && (
              <ChallengeActivity
                title={activeStage.activityData.challenge.title}
                description={activeStage.activityData.challenge.description}
                points={activeStage.activityData.challenge.points}
                onComplete={() => handleCompleteStage(activeStage.id)}
              />
            )}
          </>
        )}
      </div>

      {/* LAILA Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50 p-6">
          <div className="w-96 h-[600px] bg-background rounded-lg overflow-hidden">
            <LAILAChat 
              onClose={() => setShowChat(false)}
              lessonContent={selectedLesson?.processedContent?.analysis}
              lessonSubject={selectedLesson?.subject}
            />
          </div>
        </div>
      )}
    </div>
  );
}
