// limitations :
// 1. The user and profile databases are not connected so it is creating problem in making it dynamic website 
// 2. Authentication is not used properly by using middlewares
// 3. edit option is not good enough need to upgrade


import { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  const [username, setuserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const user_signup_data = {
      username: username,
      email: email,
      password: password
    }

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user_signup_data),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Signup successful! Please login.');
      } else {
        alert('Error in signup: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Is the backend running?');
    }


    console.log('Signup submitted', { username, email, password });
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[0%] right-[-5%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 relative z-10 my-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Join us today! It takes only a few steps.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setuserName(e.target.value)}
              placeholder="Lalit Chandra"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="Create a strong password"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
