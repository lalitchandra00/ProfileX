import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error("Not logged in — no userId in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/profile?userId=${userId}`);
        const data = await response.json();
        
        if (response.ok && data.success && data.data) {
          setProfile(data.data);
        } else {
          console.error("Error fetching profile:", data.message);
        }
      } catch (err) {
        console.error("Network error", err);
      }
    };

    fetchProfile();
  }, []);

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1 ml-1";
  const textClass = "w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800 min-h-[44px] flex items-center";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center p-6 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-4xl relative z-10 mt-6 sm:mt-10">
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Profile Details</h2>
            <Link to="/home" className="inline-flex justify-center items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
              Edit Profile
            </Link>
          </div>
          
          <div className="flex flex-col gap-6">

            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Personal Information</p>

            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>First Name</label>
                <div className={textClass}>{profile.firstName}</div>
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Last Name</label>
                <div className={textClass}>{profile.lastName}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Date of Birth</label>
                <div className={textClass}>{profile.dob ? profile.dob.split('T')[0] : ''}</div>
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Gender</label>
                <div className={textClass}>{profile.gender}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Blood Group</label>
                <div className={textClass}>{profile.bloodGroup}</div>
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Marital Status</label>
                <div className={textClass}>{profile.maritalStatus}</div>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Contact Information</p>

            <div className="flex flex-col">
              <label className={labelClass}>Email</label>
              <div className={textClass}>{profile.email}</div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Phone Number 1</label>
                <div className={textClass}>{profile.phone1}</div>
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Phone Number 2</label>
                <div className={textClass}>{profile.phone2}</div>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Address</p>

            <div className="flex flex-col">
              <label className={labelClass}>Correspondence Address</label>
              <div className={textClass}>{profile.correspondenceAddress}</div>
            </div>

            <div className="flex flex-col">
              <label className={labelClass}>Permanent Address</label>
              <div className={textClass}>{profile.permanentAddress}</div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Education</p>

            <div className="flex flex-col">
              <label className={labelClass}>College Name</label>
              <div className={textClass}>{profile.collegeName}</div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Year</label>
                <div className={textClass}>{profile.year}</div>
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Branch</label>
                <div className={textClass}>{profile.branch}</div>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Work</p>

            <div className="flex flex-col">
              <label className={labelClass}>Work / Occupation</label>
              <div className={textClass}>{profile.work}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
