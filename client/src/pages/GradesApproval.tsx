import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Edit, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function GradesApproval() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [gradeValues, setGradeValues] = useState<{ [key: number]: { grade: number; feedback: string } }>({});

  const { data: lessons } = trpc.lessons.list.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: grades, refetch: refetchGrades } = trpc.grades.getByLesson.useQuery(
    { lessonPlanId: selectedLesson! },
    { enabled: !!selectedLesson }
  );

  const approveGrade = trpc.grades.approve.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Grade approved successfully!",
      });
      refetchGrades();
      setEditingGrade(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve grade: " + error.message,
        variant: "destructive",
      });
    },
  });

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

    await approveGrade.mutateAsync({
      id: gradeId,
      finalGrade: values.grade,
      feedback: values.feedback,
    });
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
          <h1 className="text-4xl font-bold">Approval Zone</h1>
          <p className="text-muted-foreground">
            Review LAILA's suggested grades and make them official
          </p>
        </div>

        {/* Lesson Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Lesson</CardTitle>
            <CardDescription>Choose a lesson to review student grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {lessons?.map((lesson) => (
                <Button
                  key={lesson.id}
                  variant={selectedLesson === lesson.id ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => setSelectedLesson(lesson.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-xs opacity-70">{lesson.pillar?.replace('_', ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grades List */}
        {selectedLesson && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Student Grades</h2>
            
            {grades && grades.length > 0 ? (
              <div className="space-y-4">
                {grades.map((grade) => (
                  <Card key={grade.id} className={grade.isApproved ? "border-green-500" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Student ID: {grade.studentId}
                        </CardTitle>
                        {grade.isApproved && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Approved</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-muted-foreground">LAILA's Suggested Grade</Label>
                          <div className="text-2xl font-bold">{grade.suggestedGrade || "N/A"}</div>
                        </div>
                        {grade.isApproved && (
                          <div>
                            <Label className="text-muted-foreground">Final Grade</Label>
                            <div className="text-2xl font-bold text-green-600">{grade.finalGrade}</div>
                          </div>
                        )}
                      </div>

                      {editingGrade === grade.id ? (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <Label htmlFor={`grade-${grade.id}`}>Final Grade</Label>
                            <Input
                              id={`grade-${grade.id}`}
                              type="number"
                              min="0"
                              max="100"
                              value={gradeValues[grade.id]?.grade || ""}
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
                              placeholder="Enter feedback for the student..."
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
                            />
                          </div>
                          <Button
                            onClick={() => handleApprove(grade.id)}
                            disabled={approveGrade.isPending}
                            className="w-full"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {approveGrade.isPending ? "Saving..." : "Make Official"}
                          </Button>
                        </div>
                      ) : (
                        <>
                          {grade.feedback && (
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">Feedback</Label>
                              <p className="text-sm">{grade.feedback}</p>
                            </div>
                          )}
                          {!grade.isApproved && (
                            <Button
                              onClick={() => handleEdit(grade.id, grade.suggestedGrade || undefined, grade.feedback || undefined)}
                              variant="outline"
                              className="w-full"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit & Approve
                            </Button>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No grades available for this lesson yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
