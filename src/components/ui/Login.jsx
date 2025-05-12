import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropTypes from 'prop-types';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:3000/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Save JWT in localStorage
      setAuthenticated(true); // Update authenticated state
      navigate('/dashboard'); // Redirect to the dashboard
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Card className="w-full max-w-md bg-[#f4f9fb] p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="username" className="mb-2">Username</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" className="mb-2">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4 rounded-1.0">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Prop types validation
Login.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
};

export default Login;
