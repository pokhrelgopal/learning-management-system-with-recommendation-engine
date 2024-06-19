import RegisterForm from "@/components/elements/RegisterForm";
import Image from "next/image";

const Register = () => {
  return (
    <main className="container mx-lg:auto min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 lg:gap-16">
        <div className="hidden lg:flex flex-col items-center justify-center">
          <Image
            src="/register.svg"
            alt="Login"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
        <div className="lg:flex lg:flex-col lg:justify-center">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};

export default Register;
