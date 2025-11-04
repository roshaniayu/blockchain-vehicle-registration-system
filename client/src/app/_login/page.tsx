"use client";

import { useState } from "react";

// Components
import { LoginForm } from "./components/loginForm";
import { RegisterForm } from "./components/registerForm";
import { LogoIcon } from "@/components/icons/logo";

export default function LoginPage() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <section className="absolute left-0 top-0 w-full">
      <div className="flex flex-col items-center justify-center p-8 mx-auto md:min-h-screen">
        <LogoIcon className="mb-8" width={440} height={440} />
        {showRegisterForm ? (
          <RegisterForm loginForm={() => setShowRegisterForm(false)} />
        ) : (
          <LoginForm registerForm={() => setShowRegisterForm(true)} />
        )}
      </div>
    </section>
  );
}
