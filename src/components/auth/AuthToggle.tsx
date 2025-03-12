
import React from "react";

interface AuthToggleProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ 
  isLogin, 
  setIsLogin, 
  setIsForgotPassword, 
  isSubmitting 
}) => {
  return (
    <div className="text-center flex items-center justify-center space-x-2 text-sm">
      <button
        onClick={() => {
          setIsForgotPassword(false);
          setIsLogin(!isLogin);
        }}
        className="underline text-muted-foreground hover:text-foreground transition-colors"
        disabled={isSubmitting}
      >
        {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
      
      <span className="text-muted-foreground">|</span>
      
      {isLogin && (
        <button
          onClick={() => {
            setIsForgotPassword(true);
            setIsLogin(true);
          }}
          className="underline text-muted-foreground hover:text-foreground transition-colors"
          disabled={isSubmitting}
        >
          Forgot password?
        </button>
      )}
    </div>
  );
};

export default AuthToggle;
