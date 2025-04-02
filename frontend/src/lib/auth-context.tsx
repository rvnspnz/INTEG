import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isSeller: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      // First check if we have a user in localStorage
      const storedUser = localStorage.getItem("user");
      let currentUser = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        currentUser = parsedUser;
        
        // Also try to fetch the current logged-in user from the backend
        try {
          const response = await fetch("http://localhost:8080/api/user/current", {
            credentials: "include"
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.data) {
              // If we got actual user data from the backend, update the user
              const backendUser: User = {
                id: data.data.id.toString(),
                username: data.data.username,
                name: data.data.firstName ? `${data.data.firstName} ${data.data.lastName || ''}`.trim() : data.data.username,
                email: data.data.email,
                role: data.data.role,
                createdAt: data.data.createdAt,
              };
              setUser(backendUser);
              localStorage.setItem("user", JSON.stringify(backendUser));
              currentUser = backendUser;
            }
          } else {
            // If the backend doesn't recognize us as logged in, clear localStorage
            console.log("Backend session expired, clearing local user data");
            setUser(null);
            localStorage.removeItem("user");
            currentUser = null;
          }
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
        
        // Route users based on role
        if (currentUser) {
          routeUserBasedOnRole(currentUser.role, location.pathname);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [location.pathname]);

  // Helper functions for role checking
  const isAdmin = () => user?.role === 'ADMIN';
  const isSeller = () => user?.role === 'SELLER' || user?.role === 'ADMIN';
  
  // Function to route users based on their role
  const routeUserBasedOnRole = (role: string, currentPath: string) => {
    // Public routes that should be accessible to all users regardless of role
    const publicRoutes = ['/', '/auctions', '/artists', '/about', '/faqs', '/artwork', '/artist'];
    
    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => 
      currentPath === route || currentPath.startsWith(route + '/')
    );
    
    if (role === 'ADMIN' && !currentPath.startsWith('/admin')) {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'SELLER' && 
              !currentPath.startsWith('/seller') && 
              !currentPath.startsWith('/admin') &&
              !isPublicRoute) {
      navigate('/seller/dashboard', { replace: true });
    } else if (role === 'CUSTOMER' && 
              (currentPath === '/login' || currentPath === '/signup')) {
      // For customers, redirect from login/signup pages to home page
      navigate('/', { replace: true });
    }
  };

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting backend login with:", emailOrUsername);
      
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: emailOrUsername, password }),
        credentials: "include" // Include cookies/session
      });

      console.log("Backend login response status:", response.status);

      if (!response.ok) {
        console.error("Backend login failed with status:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("Backend login response data:", data);
      
      // The backend returns {status: true, statusCode: 200, message: 'Successfully logged in.'}
      // And doesn't include user data in the response
      if (data.status === true) {
        try {
          // Try to fetch the current user data after login
          const userResponse = await fetch("http://localhost:8080/api/user/current", {
            credentials: "include"
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.data) {
              // If we got actual user data from the backend, update the user
              const backendUser: User = {
                id: userData.data.id.toString(),
                username: userData.data.username,
                name: userData.data.firstName ? `${userData.data.firstName} ${userData.data.lastName || ''}`.trim() : userData.data.username,
                email: userData.data.email,
                role: userData.data.role,
                createdAt: userData.data.createdAt,
              };
              setUser(backendUser);
              localStorage.setItem("user", JSON.stringify(backendUser));
              
              // Always redirect to home page first, regardless of role
              navigate('/', { replace: true });
              
              return true;
            }
          }
        } catch (error) {
          console.error("Error fetching user data after login:", error);
        }
        
        // Fallback if we couldn't get user data from the backend
        let role = 'CUSTOMER';
        
        // Check if this is the admin user
        if (emailOrUsername === 'admin') {
          role = 'ADMIN';
        } else if (emailOrUsername === 'seller') {
          role = 'SELLER';
        }
        
        const userData: User = {
          id: "1", // Default ID
          username: emailOrUsername,
          name: emailOrUsername, // Use username as display name
          email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@example.com`,
          role: role as 'CUSTOMER' | 'SELLER' | 'ADMIN',
          createdAt: new Date().toISOString(),
        };

        console.log("Created user data with role:", role);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Always redirect to home page first, regardless of role
        navigate('/', { replace: true });
        
        return true;
      } else {
        console.error("Login failed - invalid response format");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string, name?: string): Promise<boolean> => {
    try {
      console.log("Attempting signup with username:", username, "email:", email);
      
      const response = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          firstName: name?.split(' ')[0] || '',
          lastName: name?.split(' ')[1] || '',
          email,
          password,
          role: "CUSTOMER" // Default role for sign up
        }),
        credentials: "include" // Include cookies in the request
      });

      console.log("Signup response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
        return false;
      }

      console.log("Signup successful, creating user...");
      
      // Create the user directly instead of calling login again
      const userData: User = {
        id: "1", // Default ID
        username,
        name: name || username,
        email,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Redirect to homepage after successful signup
      navigate('/', { replace: true });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    // Call the logout endpoint to invalidate the session
    fetch("http://localhost:8080/api/user/logout", {
      method: "POST",
      credentials: "include"
    }).catch(error => {
      console.error("Logout API error:", error);
    });

    setUser(null);
    localStorage.removeItem("user");
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, isSeller }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 