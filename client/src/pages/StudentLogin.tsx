import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function StudentLogin() {
  const [, setLocation] = useLocation();
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");

  const loginMutation = trpc.student.login.useMutation({
    onSuccess: (student) => {
      toast.success(`Welcome, ${student.name}!`);
      // Store student info in sessionStorage for this session
      sessionStorage.setItem("student", JSON.stringify(student));
      setLocation("/student/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !pin) {
      toast.error("Please enter both Student ID and PIN");
      return;
    }
    loginMutation.mutate({ studentId, pin });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Welcome to LAILA</CardTitle>
          <CardDescription className="text-base">
            Enter your Student ID and PIN to begin your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="Enter your Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Start Learning"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
