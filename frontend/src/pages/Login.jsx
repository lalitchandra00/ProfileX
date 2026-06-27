import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_login_data = {
      email: email,
      password: password
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user_login_data),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/home');
      } else {

        alert('Error logging in' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error. ');
    }



    console.log('Login submitted', { email, password });
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              required
            />
          </div>

          <div className="flex items-center justify-between mt-[-8px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300 accent-purple-600" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
