import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function StudentLogin() {
  const [, setLocation] = useLocation();
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !pin) {
      toast({
        title: "Error",
        description: "Please enter both Student ID and PIN",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Mock login for now - replace with actual API call
    setTimeout(() => {
      const mockStudent = { id: studentId, name: `Student ${studentId}` };
      toast({
        title: "Success",
        description: `Welcome, ${mockStudent.name}!`,
      });
      sessionStorage.setItem("student", JSON.stringify(mockStudent));
      setLocation("/laila/student/dashboard");
      setIsLoading(false);
    }, 500);
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Start Learning"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
