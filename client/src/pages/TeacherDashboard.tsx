import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
// Storage will be handled via tRPC mutation

export default function TeacherDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { data: lessons, isLoading, refetch } = trpc.lessons.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createLesson = trpc.lessons.create.useMutation({
    onSuccess: () => {
      toast.success("Lesson plan uploaded successfully!");
      setUploadProgress(0);
      setIsProcessing(false);
      setUploadedFile(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to upload lesson plan: " + error.message);
      setIsProcessing(false);
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    setUploadProgress(10);

    try {
      // Simulate upload progress
      setUploadProgress(30);
      
      // For now, create lesson without file upload
      // File upload will be implemented with proper backend endpoint
      setUploadProgress(70);
      
      await createLesson.mutateAsync({
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded: ${file.name}`,
      });
      
      setUploadProgress(100);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [createLesson]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the teacher dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
              Drag and drop your lesson plan file, or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    {isProcessing ? "Processing..." : "Drop your lesson plan here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOC, DOCX, and TXT files
                  </p>
                </>
              )}
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
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : lessons && lessons.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {lesson.title}
                      </CardTitle>
                      {lesson.status === 'ready' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {lesson.status === 'processing' && (
                        <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                      )}
                      {lesson.status === 'failed' && (
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
                            {lesson.pillar.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          disabled={lesson.status !== 'ready'}
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
