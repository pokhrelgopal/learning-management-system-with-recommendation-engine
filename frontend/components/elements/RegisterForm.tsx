"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@radix-ui/react-radio-group";
import Link from "next/link";
import React, { useState } from "react";
import { RadioGroupItem } from "../ui/radio-group";
import showToast from "@/lib/toaster";
import { register } from "@/app/server";
import { useRouter } from "next/navigation";
import Logo from "../particles/Logo";

const RegisterForm = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showToast("error", "Please fill all fields.");
      return;
    }
    if (!/^[a-zA-Z ]+$/.test(fullName)) {
      showToast("error", "Full name should only have alphabets and spaces.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("error", "Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      showToast("error", "Password should have at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const data = {
        full_name: fullName,
        email,
        password,
        role,
      };
      const res = await register(data);
      if (res.status === 201) {
        showToast("success", "Account created successfully.");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error creating account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full lg:w-96" onSubmit={(e) => e.preventDefault()}>
      <div className="my-5 flex justify-center">
        <Logo />
      </div>
      <h2 className="text-3xl mb-6 font-bold">Create an account</h2>
      <div className="form-group">
        <Label htmlFor="name" className="text-lg">
          Full Name
        </Label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          className="mt-1 text-lg"
        />
      </div>
      <div className="form-group mt-3">
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
          type="password"
          className="mt-1 text-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group mt-3">
        <Label htmlFor="password" className="text-lg">
          Confirm Password
        </Label>
        <Input
          type="password"
          className="mt-1 text-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="form-group mt-5">
        <RadioGroup
          defaultValue="student"
          className="flex items-center gap-10"
          onValueChange={(value) => setRole(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="r1" />
            <Label htmlFor="r1" className="text-lg">
              Student
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="instructor" id="r2" />
            <Label htmlFor="r2" className="text-lg">
              Instructor
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button
        loading={loading}
        onClick={handleClick}
        size="lg"
        className="mt-5 w-full"
      >
        Login
      </Button>
      <p className="mt-2">
        Already have an account?
        <Link href="/login">
          <span className="ml-2 text-primary underline underline-offset-4">
            Login
          </span>
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
