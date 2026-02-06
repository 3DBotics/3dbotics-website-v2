import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TeacherDashboard() {
  const user = { name: "Teacher" }; // Mock user for demo
  const authLoading = false;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock lessons data
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Introduction to 3D Modeling",
      description: "Learn the basics of 3D design",
      status: "ready" as const,
      pillar: "3d_modeling" as const,
    },
  ]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadedFile(file);
    setIsProcessing(true);
    setUploadProgress(10);

    try {
      // Simulate upload progress
      setUploadProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadProgress(70);
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Success",
        description: "Lesson plan uploaded successfully!",
      });

      // Add to lessons list
      const newLesson = {
        id: lessons.length + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded: ${file.name}`,
        status: "ready" as const,
        pillar: "3d_modeling" as const,
      };
      setLessons([...lessons, newLesson]);

      setUploadProgress(100);
      setIsProcessing(false);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  // Auth checks removed for demo version

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Night Prep</h1>
          <p className="text-muted-foreground">
            Upload your lesson plans and let LAILA deconstruct them into engaging 60-minute learning experiences.
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
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors duration-200
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'border-border hover:border-primary/50'}
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
                {isProcessing ? "Processing..." : "Drop your lesson plan here"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {uploadProgress < 30 && "Preparing upload..."}
                    {uploadProgress >= 30 && uploadProgress < 50 && "Uploading file..."}
                    {uploadProgress >= 50 && uploadProgress < 70 && "Storing in cloud..."}
                    {uploadProgress >= 70 && uploadProgress < 100 && "LAILA is deconstructing the lesson..."}
                    {uploadProgress === 100 && "Complete!"}
                  </span>
                  <span className="text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                {uploadProgress >= 70 && uploadProgress < 100 && (
                  <p className="text-xs text-muted-foreground">
                    Generating 60-minute timeline: 10min intro • 30min core • 20min seatwork
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lesson Plans List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Lesson Plans</h2>

          {lessons && lessons.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {lesson.title}
                      </CardTitle>
                      {lesson.status === "ready" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {lesson.status === "processing" && (
                        <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                      )}
                      {lesson.status === "failed" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <CardDescription>
                      {lesson.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium capitalize">{lesson.status}</span>
                      </div>
                      {lesson.pillar && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Pillar:</span>
                          <span className="font-medium capitalize">
                            {lesson.pillar.replace("_", " ")}
                          </span>
                        </div>
                      )}
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={lesson.status !== "ready"}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No lesson plans yet. Upload your first lesson plan to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
