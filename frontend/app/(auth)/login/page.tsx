import LoginForm from "@/components/elements/LoginForm";
import Image from "next/image";

const Login = () => {
  return (
    <main className="container mx-auto min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="flex flex-col  items-center justify-center">
          <Image
            src="/login.svg"
            alt="Login"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default Login;
