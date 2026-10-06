import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { v4 as uuidv4 } from 'uuid';
import './AuthPage.scss';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === username);
      if (user) {
        dispatch(login(user));
      } else {
        alert('User not found. Please register.');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.username === username)) {
        alert('User already exists');
        return;
      }
      const newUser = { id: uuidv4(), username };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      dispatch(login(newUser));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Enter username..."
            />
          </div>
          <button type="submit">{isLogin ? 'Sign In' : 'Create Account'}</button>
        </form>
        <p className="toggle-auth">
          {isLogin ? "Don't have an account?" : 'Already have an account?'} 
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Register' : ' Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
