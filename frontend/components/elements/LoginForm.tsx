"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import showToast from "@/lib/toaster";
import Link from "next/link";
import React from "react";

const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleLogin = async () => {
    if (!email || !password) {
      showToast("error", "Please fill in all fields.");
      return;
    }
  };
  return (
    <form className="w-96 rounded-lg" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-2xl mb-6 font-bold">Login to your account</h2>
      <div className="form-group">
        <Label htmlFor="email" className="text-lg">
          Email
        </Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mt-1 text-lg"
        />
      </div>
      <div className="form-group mt-3">
        <Label htmlFor="password" className="text-lg">
          Password
        </Label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="mt-1 text-lg"
        />
      </div>
      <Button onClick={handleLogin} size="lg" className="mt-5 text-lg w-full">
        Login
      </Button>
      <p className="mt-2">
        Don&apos;t have an account?
        <Link href="/register">
          <span className="ml-2 text-primary underline underline-offset-4">
            Register
          </span>
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
