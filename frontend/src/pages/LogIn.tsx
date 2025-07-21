import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //post the login data to the server
  const navigate = useNavigate();
  const { mutate: logIn, isError } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/home", { replace: true });
    },
  });
  return (
    <div className=" flex justify-center w-screen">
      <div className="font-geist grid gap-8 border-1 border-neutral-300 p-5 rounded-2xl">
        <div className="grid gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
          {isError && (
            <p className="text-destructive text-sm">*Invalid credentials</p>
          )}
        </div>
        <div className="grid gap-4">
          <FormInput
            labelText="Email"
            inputType="email"
            placeholderText="enter your email"
            inputId="email-create-acc"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setEmail(target.value);
            }}
          />
          <FormInput
            labelText="Password"
            inputType="password"
            placeholderText="enter your password"
            inputId="password-create-acc"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setPassword(target.value);
            }}
          />
          <Button
            size={"lg"}
            onClick={() => {
              logIn({ email, password });
            }}
            disabled={email.length < 1 || password.length < 1}
          >
            Log in
          </Button>
          <span className="text-sm text-muted-foreground">
            already have an account <Link to={"/signup"}>sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
