"use client";
import LoginForm from "@/components/elements/LoginForm";
import Spinner from "@/components/elements/Spinner";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
const Login = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <Spinner />;
  }
  if (user) {
    router.refresh();
  }
  return <LoginForm />;
};

export default Login;
