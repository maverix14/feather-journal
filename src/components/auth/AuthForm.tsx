
import React, { useState } from "react";
import { LogIn, UserPlus, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import GuestModeOption from "./GuestModeOption";
import AuthToggle from "./AuthToggle";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  isForgotPassword: boolean;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  setIsLogin,
  isForgotPassword,
  setIsForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, signup, sendPasswordResetEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(email);
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions.",
        });
        setIsForgotPassword(false);
      } else if (isLogin) {
        await login(email, password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back to Lil Baby Kicks journal!",
        });
        navigate("/");
      } else {
        await signup(name, email, password);
        toast({
          title: "Account created successfully",
          description: "Welcome to Lil Baby Kicks journal!",
        });
        navigate("/");
      }
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

  const handleSkipLogin = () => {
    // Use guest mode - set localStorage flag
    localStorage.setItem("guestMode", "true");
    toast({
      title: "Using guest mode",
      description: "Your data will be stored locally on this device only.",
    });
    navigate("/");
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isForgotPassword 
            ? "Reset Your Password" 
            : isLogin 
              ? "Welcome Back" 
              : "Create Your Journal"
          }
        </h1>
        <p className="text-sm text-muted-foreground">
          {isForgotPassword
            ? "Enter your email to receive reset instructions"
            : isLogin
              ? "Sign in to continue your journaling journey"
              : "Sign up to start capturing your precious moments"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && !isForgotPassword && (
          <NameInput name={name} setName={setName} />
        )}

        <EmailInput email={email} setEmail={setEmail} />

        {!isForgotPassword && (
          <PasswordInput password={password} setPassword={setPassword} />
        )}

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
          ) : isForgotPassword ? (
            "Send Reset Instructions"
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

      <AuthToggle 
        isLogin={isLogin} 
        setIsLogin={setIsLogin} 
        setIsForgotPassword={setIsForgotPassword} 
        isSubmitting={isSubmitting} 
      />

      <GuestModeOption onSkipLogin={handleSkipLogin} />
    </div>
  );
};

export default AuthForm;
