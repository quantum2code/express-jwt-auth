import { Link } from "react-router";
import { Button } from "../components/ui/button";

function Landing() {
  return (
    <div className=" font-geist flex justify-center w-screen">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-bold text-4xl tracking-tight">Simple. Secure</h1>
        <div className="flex gap-2">
          <Link to={"/signup"}>
            <Button variant={"default"}>Get started</Button>
          </Link>
          <Link to={"/about"}>
            <Button className="bg-background text-foreground border-foreground border-2 hover:bg-background ">
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
