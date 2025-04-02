import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();
  
  // Get authentication state safely with error handling
  let user = null;
  let isLoading = false;
  
  try {
    const auth = useAuth();
    user = auth.user;
    isLoading = auth.isLoading;
  } catch (error) {
    console.log("Auth not available yet, showing auth page");
  }
  
  // If we're on the home page, redirect to dashboard
  useEffect(() => {
    if (location === "/" && user) {
      setLocation("/dashboard");
    }
  }, [location, user, setLocation]);

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
