import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const withAuth = (Component: any) => {
  return function AuthWrapped(props: any) {
    const { user } = useAuth();
    const navigate = useRouter();
    useEffect(() => {
      if (!user) {
        navigate.push("/");
      }
    }, [user, navigate]);

    if (!user)
      return (
        <div className="container h-screen mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-4 text-gray-600">Loading...</span>
        </div>
      );

    return <Component {...props} />;
  };
};

export default withAuth;
