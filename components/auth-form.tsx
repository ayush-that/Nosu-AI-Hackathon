"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { Bot, Eye, EyeOff } from "lucide-react";
import { PasswordStrength } from "./password-strength";
import { useToast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      if (!name.trim()) {
        setError("Name is required");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password, name);
        if (error) throw error;

        toast({
          title: "Check your email",
          description:
            "We've sent you a verification link. Please verify your email to sign in.",
          duration: 8000,
        });
        // Reset form after successful signup
        setEmail("");
        setPassword("");
        setName("");
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
          duration: 3000,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        // Check if the error is about email confirmation
        if (error.message.toLowerCase().includes("email confirmation")) {
          toast({
            title: "Check your email",
            description: "Please check your email for the verification link.",
            duration: 5000,
          });
          // Reset form and switch to sign in
          setIsSignUp(false);
          setPassword("");
        } else {
          setError(error.message);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        setError("An error occurred");
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <h1 className="text-2xl font-bold">MediConnect</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? "Create an account to start chatting"
              : "Welcome back! Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {isSignUp && <PasswordStrength password={password} />}
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setName("");
              setPassword("");
              setShowPassword(false);
            }}
            disabled={loading}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
