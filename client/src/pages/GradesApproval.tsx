import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Edit, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function GradesApproval() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(1);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [gradeValues, setGradeValues] = useState<{ [key: number]: { grade: number; feedback: string } }>({});

  // Mock data
  const lessons = [
    { id: 1, title: "Introduction to 3D Modeling", description: "Learn the basics" },
    { id: 2, title: "AI Fundamentals", description: "Understanding AI concepts" },
  ];

  const grades = [
    {
      id: 1,
      studentName: "Juan Dela Cruz",
      suggestedGrade: 85,
      finalGrade: null,
      feedback: null,
      approved: false,
    },
    {
      id: 2,
      studentName: "Maria Santos",
      suggestedGrade: 92,
      finalGrade: null,
      feedback: null,
      approved: false,
    },
  ];

  const handleApprove = async (gradeId: number) => {
    const values = gradeValues[gradeId];
    if (!values) {
      toast({
        title: "Error",
        description: "Please enter grade and feedback",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Grade approved successfully!",
    });
    setEditingGrade(null);
  };

  const handleEdit = (gradeId: number, currentGrade?: number, currentFeedback?: string) => {
    setEditingGrade(gradeId);
    setGradeValues({
      ...gradeValues,
      [gradeId]: {
        grade: currentGrade || 0,
        feedback: currentFeedback || "",
      },
    });
  };

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
            <CardDescription>Please log in to access the grades approval dashboard.</CardDescription>
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
          <h1 className="text-4xl font-bold">Grade Approval</h1>
          <p className="text-muted-foreground">
            Review LAILA's suggested grades and provide your final assessment.
          </p>
        </div>

        {/* Lesson Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Lesson</CardTitle>
            <CardDescription>Choose a lesson to review student grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {lessons.map((lesson) => (
                <Button
                  key={lesson.id}
                  variant={selectedLesson === lesson.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedLesson(lesson.id)}
                >
                  {lesson.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grades List */}
        {selectedLesson && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Student Grades</h2>

            {grades.map((grade) => (
              <Card key={grade.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{grade.studentName}</CardTitle>
                      <CardDescription>
                        LAILA's Suggested Grade: {grade.suggestedGrade}%
                      </CardDescription>
                    </div>
                    {grade.approved && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingGrade === grade.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`grade-${grade.id}`}>Final Grade (%)</Label>
                        <Input
                          id={`grade-${grade.id}`}
                          type="number"
                          min="0"
                          max="100"
                          value={gradeValues[grade.id]?.grade || grade.suggestedGrade}
                          onChange={(e) =>
                            setGradeValues({
                              ...gradeValues,
                              [grade.id]: {
                                ...gradeValues[grade.id],
                                grade: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`feedback-${grade.id}`}>Feedback</Label>
                        <Textarea
                          id={`feedback-${grade.id}`}
                          placeholder="Provide feedback for the student..."
                          value={gradeValues[grade.id]?.feedback || ""}
                          onChange={(e) =>
                            setGradeValues({
                              ...gradeValues,
                              [grade.id]: {
                                ...gradeValues[grade.id],
                                feedback: e.target.value,
                              },
                            })
                          }
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApprove(grade.id)}>
                          <Save className="h-4 w-4 mr-2" />
                          Approve & Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingGrade(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {grade.finalGrade && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Final Grade: {grade.finalGrade}%
                          </p>
                          {grade.feedback && (
                            <p className="text-sm text-muted-foreground">
                              {grade.feedback}
                            </p>
                          )}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEdit(grade.id, grade.finalGrade || grade.suggestedGrade, grade.feedback || "")
                        }
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {grade.approved ? "Edit Grade" : "Review & Approve"}
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
  );
}
