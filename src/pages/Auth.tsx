
import React, { useState } from "react";
import Logo from "@/components/Logo";
import { ChevronLeft, LogIn, UserPlus, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back to Lil Baby Kicks journal!",
        });
      } else {
        await signup(name, email, password);
        toast({
          title: "Account created successfully",
          description: "Welcome to Lil Baby Kicks journal!",
        });
      }
      navigate("/");
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col">
      <header className="flex justify-between items-center mb-12 animate-slide-down">
        <Link
          to="/landing"
          className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <Logo />
        <div className="w-10 h-10 opacity-0">
          {/* Empty div for alignment */}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <div className="w-full space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? "Welcome Back" : "Create Your Journal"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Sign in to continue your journaling journey"
                : "Sign up to start capturing your precious moments"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-medium transition-all duration-300",
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              )}
            >
              {isSubmitting ? (
                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm underline text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
