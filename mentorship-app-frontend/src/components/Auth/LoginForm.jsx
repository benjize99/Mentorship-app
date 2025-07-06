import React from 'react';
import { useForm } from 'react-hook-form';

export default function LoginForm({ onLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.token) {
        localStorage.setItem('jwtToken', result.token);
        onLogin(result.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Email" {...register('email', { required: true })} />
      {errors.email && <span>Email is required</span>}
      
      <input type="password" placeholder="Password" {...register('password', { required: true })} />
      {errors.password && <span>Password is required</span>}

      <button type="submit">Login</button>
    </form>
  );
}
