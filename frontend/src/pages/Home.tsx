import UserCard from "@/components/UserCard";
import useAuth from "@/hooks/useAuth";
import { logout } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const { mutate: logOut, isError: logoutError } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/", { replace: true });
    },
  });

  const { user, isLoading } = useAuth();
  return (
    <div className="flex justify-center w-screen">
      {logoutError && (
        <p className="text-sm text-destructive">Error logging out</p>
      )}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <UserCard
          name={user.name}
          email={user.email}
          onLogout={() => logOut()}
        />
      )}
    </div>
  );
};

export default Home;
