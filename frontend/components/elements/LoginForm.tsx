"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import showToast from "@/lib/toaster";
import Link from "next/link";
import React from "react";
import { login } from "@/app/server";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import Logo from "../particles/Logo";

interface Decoded {
  role: string;
  user_id: number;
  verified: boolean;
}

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      showToast("error", "Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const res = await login({ email, password });
      if (res.status === 200) {
        const access = res.data.access;
        const { role, user_id, verified }: Decoded = jwtDecode(access);
        if (role == "instructor" && !verified) {
          showToast("error", "You are not verified yet.");
          return;
        }
        setCookie("access", access, {
          expires: new Date(Date.now() + 86400000),
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("token", access);
        localStorage.setItem("role", role);
        localStorage.setItem("user_id", user_id.toString());
        showToast("success", "Login successful.");

        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        showToast("error", "Invalid email or password.");
      } else {
        showToast("error", "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="w-96 rounded-lg shadow bg-gray-50 p-5 "
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="my-5 flex justify-center">
        <Logo />
      </div>
      <h2 className="text-3xl mb-6 font-bold">Login to your account</h2>
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
      <Button
        loading={loading}
        onClick={handleLogin}
        size="lg"
        className="mt-5 text-lg w-full"
      >
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
