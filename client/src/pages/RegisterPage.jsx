import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await register({ ...form, confirmPassword: form.password });

    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.message);
    }
  };

  return (
    <form className="max-w-md mx-auto mt-20 p-8" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Create account</h1>
      {error && <p className="text-red-500">{error}</p>}
      {Object.keys(form).map((field) => (
        <input
          key={field}
          className="w-full p-3 mt-3 bg-gray-100 rounded"
          type={field === 'password' ? 'password' : 'text'}
          placeholder={field}
          value={form[field]}
          onChange={(event) => setForm({ ...form, [field]: event.target.value })}
        />
      ))}
      <button className="w-full mt-4 p-3 bg-indigo-600 text-white rounded">
        Register
      </button>
      <Link className="text-indigo-600 text-sm" to="/login">
        Sign in
      </Link>
    </form>
  );
};

export default RegisterPage;
