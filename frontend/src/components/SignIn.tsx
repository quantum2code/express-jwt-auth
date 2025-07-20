import { Link } from "react-router";
import FormInput from "./FormInput";
import { Button } from "./ui/button";

function SignIn() {
  return (
    <div className=" flex justify-center w-screen">
      <div className="font-geist grid gap-8 border-1 border-neutral-300 p-5 rounded-2xl">
        <div className="grid gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <div className="grid gap-4">
          <FormInput
            labelText="Email"
            inputType="email"
            placeholderText="enter your email"
            inputId="email-create-acc"
          />
          <FormInput
            labelText="Password"
            inputType="password"
            placeholderText="enter your password"
            inputId="password-create-acc"
          />
          <Button size={"lg"}>Log in</Button>
          <span className="text-sm text-muted-foreground">
            already have an account <Link to={"/signup"}>sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
