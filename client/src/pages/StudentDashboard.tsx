import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, MessageCircle, Play, BookOpen, Trophy, Star, Zap, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { renderMarkdown } from "@/lib/markdown";
import { useLocation } from "wouter";
import LAILAChat from "@/components/LAILAChat";
import QuizActivity from "@/components/QuizActivity";
import MatchingGame from "@/components/MatchingGame";
import ChallengeActivity from "@/components/ChallengeActivity";

// Helper function to clean markdown formatting
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold**
    .replace(/\*([^*]+)\*/g, '$1')     // Remove *italic*
    .replace(/#{1,6}\s/g, '')          // Remove # headers
    .trim();
}

interface Student {
  id: number;
  studentId: string;
  name: string;
  grade?: string;
  xp: number;
  level: number;
  badges: string[];
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
    heroImage?: string;
    images?: string[];
    videos?: { id: string; title: string; embedUrl: string }[];
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
  xpReward: number;
}

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ProcessedLesson | null>(null);
  const [lessons, setLessons] = useState<ProcessedLesson[]>([]);
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [stageStartTime, setStageStartTime] = useState<number | null>(null);
  const [canComplete, setCanComplete] = useState(false);
  const [videoWatchProgress, setVideoWatchProgress] = useState<Record<string, number>>({});
  const [requiredVideoWatchPercentage] = useState(80); // Require 80% watch time

  const parseMissionStages = (lesson: ProcessedLesson | null): MissionStage[] => {
    if (!lesson) {
      return [
        {
          id: "intro",
          title: "Gamified Introduction",
          duration: 10,
          description: "Get ready to start learning!",
          content: "Select a lesson to begin your learning adventure!",
          status: "pending",
          xpReward: 50,
        },
        {
          id: "core",
          title: "Core Skill Building",
          duration: 30,
          description: "Master key concepts",
          content: "Loading lesson content...",
          status: "pending",
          xpReward: 150,
        },
        {
          id: "seatwork",
          title: "Evaluated Seatwork",
          duration: 20,
          description: "Show what you've learned!",
          content: "Loading assessment content...",
          status: "pending",
          xpReward: 100,
        },
      ];
    }

    const activityData = lesson.processedContent.activityData;
    
    return [
      {
        id: "intro",
        title: "🎮 Mission Briefing",
        duration: 10,
        description: `Welcome to ${lesson.subject}`,
        content: `${lesson.processedContent.analysis.substring(0, 400)}\n\n🚀 Ready to start your learning adventure?`,
        status: "active",
        activityType: "text",
        xpReward: 50,
      },
      {
        id: "core",
        title: "⚔️ Core Training",
        duration: 30,
        description: `Master ${lesson.subject} skills`,
        content: `${lesson.processedContent.timeline.substring(0, 600)}`,
        status: "pending",
        activityType: activityData?.quiz ? "quiz" : activityData?.matching ? "matching" : "text",
        activityData: activityData,
        xpReward: 150,
      },
      {
        id: "seatwork",
        title: "🏆 Final Challenge",
        duration: 20,
        description: "Prove your mastery!",
        content: `Complete the final challenge to earn your badge!`,
        status: "pending",
        activityType: activityData?.challenge ? "challenge" : "text",
        activityData: activityData,
        xpReward: 100,
      },
    ];
  };

  const [missionStages, setMissionStages] = useState<MissionStage[]>(parseMissionStages(null));
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const storedStudent = localStorage.getItem("laila_student");
    if (!storedStudent) {
      setLocation("/laila/student/login");
      return;
    }

    const studentData = JSON.parse(storedStudent);
    // Initialize XP and level if not present
    if (!studentData.xp) studentData.xp = 0;
    if (!studentData.level) studentData.level = 1;
    if (!studentData.badges) studentData.badges = [];
    
    setStudent(studentData);

    const storedLessons = localStorage.getItem("laila_processed_lessons");
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    }
  }, [setLocation]);

  useEffect(() => {
    if (selectedLesson) {
      setMissionStages(parseMissionStages(selectedLesson));
    }
  }, [selectedLesson]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleSelectLesson = (lesson: ProcessedLesson) => {
    setSelectedLesson(lesson);
    toast({
      title: "🎯 Mission Started!",
      description: `Get ready to master ${lesson.subject}!`,
    });
  };

  const handleCompleteStage = (stageId: string) => {
    const stage = missionStages.find((s) => s.id === stageId);
    if (!stage) return;
    
    // Check if minimum time requirement is met
    if (!canComplete) {
      toast({
        title: "Not Ready Yet!",
        description: "Please spend more time engaging with the content before completing this stage.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all videos have been watched (if stage has videos)
    if (selectedLesson?.processedContent.videos && selectedLesson.processedContent.videos.length > 0) {
      const unwatchedVideos = selectedLesson.processedContent.videos.filter(
        video => (videoWatchProgress[video.id] || 0) < requiredVideoWatchPercentage
      );
      
      if (unwatchedVideos.length > 0) {
        toast({
          title: "Videos Not Watched!",
          description: `Please watch all ${selectedLesson.processedContent.videos.length} videos before completing this stage.`,
          variant: "destructive",
        });
        return;
      }
    }

    // Award XP
    const newXP = (student?.xp || 0) + stage.xpReward;
    const newLevel = Math.floor(newXP / 300) + 1;
    const leveledUp = newLevel > (student?.level || 1);

    setMissionStages((prev) =>
      prev.map((s, index) => {
        if (s.id === stageId) {
          const nextStage = prev[index + 1];
          if (nextStage) {
            return [
              { ...s, status: "completed" as const },
              { ...nextStage, status: "active" as const },
            ];
          }
          return [{ ...s, status: "completed" as const }];
        }
        return [s];
      }).flat()
    );

    // Update student XP and level
    if (student) {
      const updatedStudent = {
        ...student,
        xp: newXP,
        level: newLevel,
      };
      setStudent(updatedStudent);
      localStorage.setItem("laila_student", JSON.stringify(updatedStudent));

      if (leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    }

    // Check if all stages complete - award badge
    const allComplete = missionStages.every((s) => s.id === stageId || s.status === "completed");
    if (allComplete && selectedLesson && student) {
      const badgeName = `${selectedLesson.subject} Master`;
      if (!student.badges.includes(badgeName)) {
        const updatedStudent = {
          ...student,
          badges: [...student.badges, badgeName],
        };
        setStudent(updatedStudent);
        localStorage.setItem("laila_student", JSON.stringify(updatedStudent));
        setNewBadge(badgeName);
        setTimeout(() => setNewBadge(null), 4000);
      }
    }

    toast({
      title: `✨ +${stage.xpReward} XP!`,
      description: "Great job! Keep going!",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("laila_student");
    setLocation("/laila/student/login");
  };

  // Track stage engagement time
  useEffect(() => {
    const activeStage = missionStages.find((s) => s.status === "active");
    if (activeStage) {
      setStageStartTime(Date.now());
      setCanComplete(false);
      
      // Enable complete button after minimum duration (in seconds, converted to ms)
      const timer = setTimeout(() => {
        setCanComplete(true);
      }, activeStage.duration * 1000); // duration is in minutes, convert to ms
      
      return () => clearTimeout(timer);
    }
  }, [missionStages]);

  const activeStage = missionStages.find((s) => s.status === "active");
  const completedStages = missionStages.filter((s) => s.status === "completed").length;
  const totalDuration = missionStages.reduce((sum, s) => sum + s.duration, 0);
  const completedDuration = missionStages
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.duration, 0) + timeElapsed;
  const progressPercentage = Math.min(100, (completedDuration / totalDuration) * 100);

  const xpToNextLevel = 300 - ((student?.xp || 0) % 300);
  const xpProgress = ((student?.xp || 0) % 300) / 300 * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-4 md:p-8">
      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in">
          <div className="text-center animate-in zoom-in">
            <div className="text-8xl mb-4">🎉</div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              LEVEL UP!
            </h1>
            <p className="text-4xl font-bold text-cyan-400">Level {student?.level}</p>
          </div>
        </div>
      )}

      {/* New Badge Animation */}
      {newBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in">
          <div className="text-center animate-in zoom-in">
            <Award className="h-32 w-32 mx-auto mb-4 text-yellow-400 animate-pulse" />
            <h2 className="text-4xl font-bold text-yellow-400 mb-2">New Badge Unlocked!</h2>
            <p className="text-2xl text-white">{newBadge}</p>
          </div>
        </div>
      )}

      {/* Header with Player Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Welcome back, {student?.name}!
            </h1>
            <p className="text-gray-400">Your epic learning journey continues...</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowChat(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/50"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Ask LAILA
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-gray-700 text-gray-300">
              Logout
            </Button>
          </div>
        </div>

        {/* Player Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Level</p>
                  <p className="text-3xl font-bold text-purple-400">{student?.level || 1}</p>
                </div>
                <Zap className="h-12 w-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total XP</p>
                  <p className="text-3xl font-bold text-cyan-400">{student?.xp || 0}</p>
                </div>
                <Star className="h-12 w-12 text-cyan-400 fill-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{xpToNextLevel} XP to next level</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Badges</p>
                  <p className="text-3xl font-bold text-yellow-400">{student?.badges.length || 0}</p>
                </div>
                <Trophy className="h-12 w-12 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Missions</p>
                  <p className="text-3xl font-bold text-green-400">{lessons.length}</p>
                </div>
                <BookOpen className="h-12 w-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {!selectedLesson ? (
          <>
            {/* Available Missions */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6 text-cyan-400" />
                  Available Missions
                </CardTitle>
                <CardDescription className="text-gray-400">Choose your next learning adventure</CardDescription>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 mb-2">No missions available yet</p>
                    <p className="text-sm text-gray-500">Check back later for new learning adventures!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className="group relative overflow-hidden rounded-lg border-2 border-cyan-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 text-left transition-all hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                        <div className="relative">
                          <h3 className="text-xl font-bold mb-2 text-cyan-400">{lesson.title}</h3>
                          <p className="text-sm text-yellow-400 mb-3">⭐ {lesson.subject}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>60 minutes</span>
                            <span className="mx-2">•</span>
                            <Trophy className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400">300 XP</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Mission Progress */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Mission Progress</CardTitle>
                    <CardDescription className="text-gray-400">
                      Learning: {selectedLesson.title} ({selectedLesson.subject})
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedLesson(null)}
                    className="border-gray-700"
                  >
                    Change Mission
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-400">{completedDuration} / {totalDuration} minutes</span>
                  <span className="text-cyan-400 font-semibold">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-500 relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mission Timeline */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Mission Timeline</CardTitle>
                <CardDescription className="text-gray-400">Follow the path to victory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {missionStages.map((stage, index) => (
                  <div key={stage.id} className="relative">
                    {/* Connector Line */}
                    {index < missionStages.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-cyan-500/50 to-purple-500/50" />
                    )}

                    <div className="flex gap-4">
                      {/* Status Icon */}
                      <div className="relative z-10">
                        {stage.status === "completed" ? (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                        ) : stage.status === "active" ? (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                            <Circle className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Stage Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-lg font-semibold ${
                            stage.status === "active" ? "text-cyan-400" : 
                            stage.status === "completed" ? "text-green-400" : 
                            "text-gray-400"
                          }`}>
                            {stage.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400">{stage.duration} min</span>
                            <span className="flex items-center gap-1 text-yellow-400">
                              <Star className="h-4 w-4 fill-yellow-400" />
                              {stage.xpReward} XP
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-3" dangerouslySetInnerHTML={{ __html: renderMarkdown(stage.description) }} />

                        {stage.status === "active" && (
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                            {/* Hero Image */}
                            {selectedLesson.processedContent.heroImage && (
                              <div className="mb-4 rounded-lg overflow-hidden">
                                <img 
                                  src={selectedLesson.processedContent.heroImage} 
                                  alt={selectedLesson.subject}
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            )}
                            
                            <div className="text-sm text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(stage.content) }} />
                            
                            {/* Image Gallery */}
                            {selectedLesson.processedContent.images && selectedLesson.processedContent.images.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                {selectedLesson.processedContent.images.slice(1).map((img, idx) => (
                                  <img 
                                    key={idx}
                                    src={img} 
                                    alt={`${selectedLesson.subject} ${idx + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Videos */}
                            {selectedLesson.processedContent.videos && selectedLesson.processedContent.videos.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-cyan-400 mb-2">📺 Watch & Learn</h4>
                                <p className="text-xs text-yellow-400 mb-2">
                                  ⚠️ Watch at least {requiredVideoWatchPercentage}% of each video to complete this stage
                                </p>
                                {selectedLesson.processedContent.videos.map((video, idx) => {
                                  const watchProgress = videoWatchProgress[video.id] || 0;
                                  const isWatched = watchProgress >= requiredVideoWatchPercentage;
                                  return (
                                    <div key={video.id} className="mb-4">
                                      <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm text-gray-300">{video.title}</p>
                                        {isWatched ? (
                                          <span className="text-xs text-green-400 flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" /> Watched
                                          </span>
                                        ) : (
                                          <span className="text-xs text-gray-400">
                                            {Math.round(watchProgress)}% watched
                                          </span>
                                        )}
                                      </div>
                                      <div className="aspect-video rounded-lg overflow-hidden bg-slate-900">
                                        <iframe
                                          width="100%"
                                          height="100%"
                                          src={`${video.embedUrl}?enablejsapi=1`}
                                          title={video.title}
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          id={`video-${video.id}`}
                                        />
                                      </div>
                                      {/* Manual watch confirmation for now (YouTube API requires additional setup) */}
                                      {!isWatched && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setVideoWatchProgress(prev => ({ ...prev, [video.id]: 100 }));
                                            toast({
                                              title: "Video Marked as Watched",
                                              description: "Great job watching the video!",
                                            });
                                          }}
                                          className="mt-2 text-xs"
                                        >
                                          ✓ I finished watching this video
                                        </Button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            
                            {stage.activityType === "text" && (
                              <div className="space-y-2">
                                {!canComplete && (
                                  <p className="text-sm text-yellow-400">
                                    ⏱️ Please engage with the content for at least {stage.duration} seconds before completing.
                                  </p>
                                )}
                                <Button
                                  onClick={() => handleCompleteStage(stage.id)}
                                  disabled={!canComplete}
                                  className={`bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold ${!canComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  {canComplete ? 'Complete Stage' : 'Engaging with Content...'}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interactive Activities */}
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
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50 p-6 backdrop-blur-sm">
          <div className="w-96 h-[600px] bg-slate-900 rounded-lg overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
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
