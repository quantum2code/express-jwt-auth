import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { signup } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  //post the signup data to the server
  const { mutate: signUp, isError } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate("/home", { replace: true });
    },
  });
  return (
    <div className=" flex justify-center w-screen">
      <div className="font-geist grid gap-8 border-1 border-neutral-300 p-5 rounded-2xl">
        <div className="grid gap-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Create an account
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
          {isError && (
            <p className="text-destructive text-sm">*Invalid credentials</p>
          )}
        </div>
        <div className="grid gap-4">
          <FormInput
            labelText="Name"
            inputType="text"
            placeholderText="enter your username"
            inputId="username-create-acc"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setName(target.value);
            }}
          />
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
          <FormInput
            labelText="Confirm password"
            inputType="password"
            placeholderText="enter your password again"
            inputId="confirm-password-create-acc"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setConfirmPassword(target.value);
            }}
          />
          <Button
            size={"lg"}
            onClick={() => {
              signUp({ name, email, password, confirmPassword });
            }}
            disabled={
              name.length < 3 ||
              email.length < 3 ||
              password.length < 6 ||
              password !== confirmPassword
            }
          >
            Create account
          </Button>
          <span className="text-sm text-muted-foreground">
            already have an account <Link to={"/login"}>sign in</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
