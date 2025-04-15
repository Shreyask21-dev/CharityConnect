import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
  requiredRole?: "user" | "admin";
};

export function ProtectedRoute({
  path,
  component: Component,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect admin to admin dashboard if trying to access user routes
    if (user.role === "admin" && requiredRole === "user") {
      return (
        <Route path={path}>
          <Redirect to="/admin-dashboard" />
        </Route>
      );
    }

    // Redirect user to user dashboard if trying to access admin routes
    if (user.role === "user" && requiredRole === "admin") {
      return (
        <Route path={path}>
          <Redirect to="/user-dashboard" />
        </Route>
      );
    }
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}