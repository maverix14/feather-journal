
import React, { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col">
      <AuthHeader />

      <main className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <AuthForm 
          isLogin={isLogin} 
          setIsLogin={setIsLogin} 
          isForgotPassword={isForgotPassword} 
          setIsForgotPassword={setIsForgotPassword} 
        />
      </main>
    </div>
  );
};

export default Auth;
