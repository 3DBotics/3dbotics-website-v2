import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Loader, X, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProcessingStage {
  name: string;
  status: "pending" | "processing" | "complete" | "error";
  progress: number;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  status: "processing" | "ready" | "error";
  subject: string; // Dynamic subject (Biology, Math, History, etc.)
  stages?: ProcessingStage[];
  processedContent?: {
    analysis: string;
    timeline: string;
    activities: string;
  };
}

export default function TeacherDashboard() {
  const user = { name: "Teacher" }; // Mock user for demo
  const authLoading = false;
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [trashedLessons, setTrashedLessons] = useState<Lesson[]>([]);
  const [showTrashBin, setShowTrashBin] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load lessons from localStorage
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedLessons = localStorage.getItem("laila_processed_lessons");
      const storedTrash = localStorage.getItem("laila_trashed_lessons");

      if (storedLessons) {
        setLessons(JSON.parse(storedLessons));
      }

      if (storedTrash) {
        setTrashedLessons(JSON.parse(storedTrash));
      }
    } catch (error) {
      console.error("Error loading lessons from localStorage:", error);
    }
  }, []);

  const processingStages: ProcessingStage[] = [
    { name: "Analyzing lesson structure", status: "pending", progress: 0 },
    { name: "Generating 60-minute timeline", status: "pending", progress: 0 },
    { name: "Creating gamified activities", status: "pending", progress: 0 },
    { name: "Preparing for students", status: "pending", progress: 0 },
  ];

  const [currentStages, setCurrentStages] = useState<ProcessingStage[]>(processingStages);

  const processLessonWithLMStudio = async (fileContent: string, fileName: string) => {
    try {
      // Reset stages
      setCurrentStages(
        processingStages.map((stage) => ({
          ...stage,
          status: "pending" as const,
          progress: 0,
        }))
      );

      // Stage 1: Analyzing lesson structure and identifying subject
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: "processing" as const, progress: 25 } : s))
      );

      // Send to LM Studio for analysis - NO RESTRICTIONS ON SUBJECT
      const analysisResponse = await fetch("https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "local-model",
          messages: [
            {
              role: "system",
              content:
                "You are LAILA (Local AI Leveraging Academe), an AI education assistant for 3DBotics®. You can process ANY subject matter - science, math, history, literature, arts, etc. Analyze the lesson plan and: 1) Identify the subject/topic, 2) Structure it into a 60-minute 3DBotics® learning experience with 10 minutes gamified introduction, 30 minutes core skill building, and 20 minutes evaluated seatwork. Use your general knowledge to understand the content, then apply 3DBotics® teaching methodology.",
            },
            {
              role: "user",
              content: `Please analyze this lesson plan. Identify the subject and structure it for 3DBotics® teaching:\n\n${fileContent}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("LM Studio analysis failed");
      }

      const analysisData = await analysisResponse.json();
      const analysisResult = analysisData.choices?.[0]?.message?.content || "";

      // Complete stage 1
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: "complete" as const, progress: 100 } : s))
      );

      // Stage 2: Generating 60-minute timeline
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 1 ? { ...s, status: "processing" as const, progress: 25 } : s))
      );

      const timelineResponse = await fetch("https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "local-model",
          messages: [
            {
              role: "system",
              content:
                "You are LAILA. Create a detailed 60-minute learning timeline with specific activities for each phase: Gamified Introduction (10min), Core Skill Building (30min), and Evaluated Seatwork (20min). Make it engaging and age-appropriate.",
            },
            {
              role: "user",
              content: `Based on this analysis:\n${analysisResult}\n\nCreate a detailed 60-minute timeline with specific activities for each phase.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      const timelineData = await timelineResponse.json();
      const timelineResult = timelineData.choices?.[0]?.message?.content || "";

      // Complete stage 2
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 1 ? { ...s, status: "complete" as const, progress: 100 } : s))
      );

      // Stage 3: Creating gamified activities
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, status: "processing" as const, progress: 25 } : s))
      );

      const activitiesResponse = await fetch("https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "local-model",
          messages: [
            {
              role: "system",
              content:
                "You are LAILA. Generate structured JSON data for interactive learning activities. Create 3 activities: 1 quiz (multiple choice), 1 drag-and-drop matching game, and 1 challenge. Use 5th-grade language. Return ONLY valid JSON in this format: {\"quiz\":{\"question\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correct\":0},\"matching\":{\"pairs\":[[\"term1\",\"def1\"],[\"term2\",\"def2\"]]},\"challenge\":{\"title\":\"...\",\"description\":\"...\",\"points\":100}}",
            },
            {
              role: "user",
              content: `Create interactive activities for this lesson:\n${timelineResult}\n\nReturn ONLY the JSON object, no other text.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      const activitiesData = await activitiesResponse.json();
      const activitiesResult = activitiesData.choices?.[0]?.message?.content || "";
      
      // Try to parse JSON activity data
      let parsedActivityData = null;
      try {
        // Extract JSON from response (might have extra text)
        const jsonMatch = activitiesResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedActivityData = JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        console.error("Failed to parse activity JSON:", error);
      }

      // Complete stage 3
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, status: "complete" as const, progress: 100 } : s))
      );

      // Stage 4: Preparing for students
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 3 ? { ...s, status: "processing" as const, progress: 25 } : s))
      );

      // Extract subject from analysis
      const subjectMatch = analysisResult.match(/subject[:\s]+([^\n.]+)/i);
      const detectedSubject = subjectMatch ? subjectMatch[1].trim() : "General Studies";

      // Simulate final preparation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Complete stage 4
      setCurrentStages((prev) =>
        prev.map((s, i) => (i === 3 ? { ...s, status: "complete" as const, progress: 100 } : s))
      );

      // Add processed lesson
      const newLesson: Lesson = {
        id: lessons.length + 1,
        title: fileName.replace(/\.[^/.]+$/, ""),
        description: `Processed by LAILA • ${new Date().toLocaleDateString()}`,
        status: "ready",
        subject: detectedSubject,
        stages: currentStages,
        processedContent: {
          analysis: analysisResult,
          timeline: timelineResult,
          activities: activitiesResult,
          activityData: parsedActivityData,
        },
      };

      const updatedLessons = [newLesson, ...lessons];
      setLessons(updatedLessons);

      // Save to localStorage for student access
      try {
        localStorage.setItem("laila_processed_lessons", JSON.stringify(updatedLessons));
      } catch (error) {
        console.error("Error saving lessons to localStorage:", error);
      }

      toast({
        title: "✨ Lesson Ready!",
        description: `LAILA has successfully processed your ${detectedSubject} lesson. Students can now access it!`,
      });

      // Send browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("LAILA Lesson Ready", {
          body: `Your lesson "${fileName}" is ready for students!`,
          icon: "🎓",
        });
      } else if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }

      setIsProcessing(false);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Processing error:", error);

      // Mark all stages as error
      setCurrentStages((prev) =>
        prev.map((s) => ({
          ...s,
          status: "error" as const,
        }))
      );

      toast({
        title: "Processing Error",
        description:
          "Failed to process lesson with LAILA. Please check that LM Studio is running and ngrok tunnel is active.",
        variant: "destructive",
      });

      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    const validTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".txt")) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, DOCX, or TXT files only.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    // Read file content
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      await processLessonWithLMStudio(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleViewDetails = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowDetailsModal(true);
  };

  const handleMoveToTrash = (lessonId: number) => {
    const lessonToTrash = lessons.find((l) => l.id === lessonId);
    if (!lessonToTrash) return;

    // Move to trash
    const updatedLessons = lessons.filter((l) => l.id !== lessonId);
    const updatedTrash = [...trashedLessons, lessonToTrash];

    setLessons(updatedLessons);
    setTrashedLessons(updatedTrash);

    // Update localStorage
    try {
      localStorage.setItem("laila_processed_lessons", JSON.stringify(updatedLessons));
      localStorage.setItem("laila_trashed_lessons", JSON.stringify(updatedTrash));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }

    toast({
      title: "Moved to Trash",
      description: "Lesson moved to trash bin. You can restore it later.",
    });
  };

  const handleRestoreLesson = (lessonId: number) => {
    const lessonToRestore = trashedLessons.find((l) => l.id === lessonId);
    if (!lessonToRestore) return;

    // Restore from trash
    const updatedTrash = trashedLessons.filter((l) => l.id !== lessonId);
    const updatedLessons = [lessonToRestore, ...lessons];

    setTrashedLessons(updatedTrash);
    setLessons(updatedLessons);

    // Update localStorage
    try {
      localStorage.setItem("laila_processed_lessons", JSON.stringify(updatedLessons));
      localStorage.setItem("laila_trashed_lessons", JSON.stringify(updatedTrash));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }

    toast({
      title: "Lesson Restored",
      description: "Lesson has been restored and is now available to students.",
    });
  };

  const handlePermanentDelete = (lessonId: number) => {
    const updatedTrash = trashedLessons.filter((l) => l.id !== lessonId);
    setTrashedLessons(updatedTrash);

    // Update localStorage
    try {
      localStorage.setItem("laila_trashed_lessons", JSON.stringify(updatedTrash));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }

    setDeleteConfirmId(null);

    toast({
      title: "Permanently Deleted",
      description: "Lesson has been permanently deleted and cannot be recovered.",
      variant: "destructive",
    });
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader className="h-4 w-4 text-cyan-400 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const overallProgress = Math.round(
    currentStages.reduce((sum, stage) => sum + stage.progress, 0) / currentStages.length
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Night Prep</h1>
          <p className="text-muted-foreground">
            Upload your lesson plans and let LAILA deconstruct them into engaging 60-minute learning
            experiences.
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Lesson Plan
            </CardTitle>
            <CardDescription>
              Click to browse or drag and drop your lesson plan file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center
                transition-colors duration-200
                ${isProcessing ? "opacity-50 cursor-not-allowed border-border" : "border-border hover:border-primary/50 cursor-pointer"}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt"
                disabled={isProcessing}
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isProcessing ? "Processing with LAILA..." : "Drop your lesson plan here"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </div>

            {/* Processing Stages */}
            {isProcessing && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-muted-foreground">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                <div className="space-y-3 mt-4">
                  {currentStages.map((stage, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
                    >
                      {getStageIcon(stage.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stage.name}</p>
                        {stage.status === "processing" && (
                          <p className="text-xs text-muted-foreground">In progress...</p>
                        )}
                        {stage.status === "complete" && (
                          <p className="text-xs text-green-500">Complete</p>
                        )}
                        {stage.status === "error" && (
                          <p className="text-xs text-red-500">Failed</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{stage.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trash Bin Section */}
        {trashedLessons.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trash2 className="h-6 w-6" />
                Trash Bin ({trashedLessons.length})
              </h2>
              <Button
                onClick={() => setShowTrashBin(!showTrashBin)}
                variant="outline"
              >
                {showTrashBin ? "Hide" : "Show"} Trash
              </Button>
            </div>

            {showTrashBin && (
              <div className="grid gap-4 md:grid-cols-2">
                {trashedLessons.map((lesson) => (
                  <Card key={lesson.id} className="relative overflow-hidden border-red-500/30">
                    <div className="absolute top-0 right-0 p-3">
                      <Trash2 className="h-6 w-6 text-red-500" />
                    </div>

                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 pr-8">
                        <FileText className="h-5 w-5" />
                        {lesson.title}
                      </CardTitle>
                      <CardDescription>{lesson.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Subject:</span>{" "}
                          <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                            {lesson.subject}
                          </span>
                        </p>
                      </div>

                      {deleteConfirmId === lesson.id ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-red-500 text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Permanently delete this lesson?</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handlePermanentDelete(lesson.id)}
                              variant="destructive"
                              className="flex-1"
                            >
                              Yes, Delete Forever
                            </Button>
                            <Button
                              onClick={() => setDeleteConfirmId(null)}
                              variant="outline"
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleRestoreLesson(lesson.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirmId(lesson.id)}
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Lesson Plans</h2>

          {lessons.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No lesson plans yet. Upload one to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    {lesson.status === "ready" && <CheckCircle className="h-6 w-6 text-green-500" />}
                    {lesson.status === "processing" && (
                      <Loader className="h-6 w-6 text-cyan-400 animate-spin" />
                    )}
                    {lesson.status === "error" && <AlertCircle className="h-6 w-6 text-red-500" />}
                  </div>

                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 pr-8">
                      <FileText className="h-5 w-5" />
                      {lesson.title}
                    </CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={
                            lesson.status === "ready"
                              ? "text-green-500"
                              : lesson.status === "processing"
                                ? "text-cyan-400"
                                : "text-red-500"
                          }
                        >
                          {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Subject:</span>{" "}
                        <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                          {lesson.subject}
                        </span>
                      </p>
                    </div>

                    {lesson.status === "ready" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewDetails(lesson)}
                          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleMoveToTrash(lesson.id)}
                          variant="outline"
                          className="border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedLesson?.title}</DialogTitle>
            <DialogDescription>
              Subject: {selectedLesson?.subject} • Processed by LAILA
            </DialogDescription>
          </DialogHeader>

          {selectedLesson?.processedContent && (
            <div className="space-y-6 mt-4">
              {/* Analysis Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Lesson Analysis
                </h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedLesson.processedContent.analysis}
                  </p>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  60-Minute Timeline
                </h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedLesson.processedContent.timeline}
                  </p>
                </div>
              </div>

              {/* Activities Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-400" />
                  Gamified Activities
                </h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedLesson.processedContent.activities}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowDetailsModal(false)} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
