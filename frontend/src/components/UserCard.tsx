import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserCardProps = {
  name: string;
  email: string;
  onLogout: () => void;
};

const UserCard = ({ name, email, onLogout }: UserCardProps) => {
  return (
    <Card className="w-full max-w-sm shadow-md border border-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Welcome, {name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-sm text-muted-foreground">Email</div>
        <div className="text-base font-medium">{email}</div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="w-full" onClick={onLogout}>
          Log out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
