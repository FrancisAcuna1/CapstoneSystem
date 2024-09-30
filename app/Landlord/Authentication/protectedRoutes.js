import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function  ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        console.log('Retrieved token:', token); // Add this line to check token value
        if (!token) {
            setIsAuthenticated(false);
            router.push('/'); // Redirect to login if no token
            return;
        }
    
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            headers: {
            'Authorization': `Bearer ${token}`,
            },
        });
    
        if (response.ok) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.push('/'); // Redirect to login if not authenticated
        }
    
        setLoading(false);
        };
    
        checkAuth();
    }, [router]);
    
}
