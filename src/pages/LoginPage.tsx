import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_UID = 'd14ac157-3e21-4b6e-89ea-ba40f842d6d4';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAuth();

  if (user && isAdmin) {
    navigate('/admin');
    return null;
  } else if (user) {
    navigate('/');
    return null;
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    console.log('Starting login process with:', values.email);

    try {
      const result = await signIn(values.email, values.password);

      if (!result.success) {
        toast.error(result.error || "Invalid email or password. Please try again.");
        form.setError("password", { message: "Invalid email or password" });
        return;
      }
      
      // Auth context will handle the success case
      // No need to navigate here as the ProtectedRoute component will handle redirection
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center gap-2">
            <Link to="/" className="absolute top-4 left-4">
              <Button variant="ghost" size="sm">
                ← Back to Home
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          </div>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="******" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Log In
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-xs text-gray-500 text-center mt-4 px-4">
            For demonstration purposes, use: <br />
            Email: admin@example.com | Password: admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
