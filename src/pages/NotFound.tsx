
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Button from "@/components/ui-custom/Button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-medicoart-light">
      <div className="text-center p-8 max-w-md">
        <div className="inline-block mb-6 bg-medicoart-gray-light text-medicoart-blue px-4 py-1 rounded-full text-sm font-medium animate-bounce">
          404 Error
        </div>
        <h1 className="text-4xl md:text-5xl font-medium mb-4 text-medicoart-gray-dark">
          Page Not Found
        </h1>
        <p className="text-medicoart-gray mb-8 text-lg">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/">
          <Button size="lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
