import FormInput from "./components/FormInput";
import { Button } from "./components/ui/button";

function App() {
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
        </div>
        <div className="grid gap-4">
          <FormInput
            labelText="Name"
            inputType="text"
            placeholderText="enter your username"
            inputId="username-create-acc"
          />
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
          <FormInput
            labelText="Confirm password"
            inputType="password"
            placeholderText="enter your password again"
            inputId="confirm-password-create-acc"
          />
          <Button size={"lg"}>Create account</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
