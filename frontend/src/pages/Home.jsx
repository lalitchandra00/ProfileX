import { useState } from 'react';
import { Link } from 'react-router-dom';


function Home() {
  const [FirstName, setFirstName] = useState('')
  const [LastName, setLastName] = useState('')
  const [Email, setEmail] = useState('')
  const [DOB, setDOB] = useState('')
  const [gender, setGender] = useState('')
  const [Phone1, setPhone1] = useState('')
  const [Phone2, setPhone2] = useState('')
  const [CollegeName, setCollegeName] = useState('')
  const [Year, setYear] = useState('')
  const [Branch, setBranch] = useState('')
  const [BloodGroup, setBloodGroup] = useState('')
  const [MaritalStatus, setMaritalStatus] = useState('')
  const [Work, setWork] = useState('')
  const [CorrespondenceAddress, setCorrespondenceAddress] = useState('')
  const [PermanentAddress, setPermanentAddress] = useState('')

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1 ml-1"
  const genders = ["Male", "Female", "Other"];


  //Ai coded this part
  const handleSubmit = async (e) => {
    e.preventDefault();




    const userData = {
      firstName: FirstName,
      lastName: LastName,
      email: Email,
      dob: DOB,
      gender: gender,
      phone1: Phone1,
      phone2: Phone2,
      collegeName: CollegeName,
      year: Year,
      branch: Branch,
      bloodGroup: BloodGroup,
      maritalStatus: MaritalStatus,
      work: Work,
      correspondenceAddress: CorrespondenceAddress,
      permanentAddress: PermanentAddress
    };

    try {
      const response = await fetch('http://localhost:8000/api/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert('Data saved successfully!');
      } else {
        alert('Error saving data: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Is the backend running?');
    }
  };
  // Till here

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6 relative overflow-hidden">
      

      <div className="absolute top-0 right-0 p-6 z-50">
        <Link 
          to="/profile" 
          className="bg-white/70 hover:bg-white text-purple-700 font-bold py-2 px-6 rounded-full shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] border border-purple-100 transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5"
        >
          View Profile
        </Link>
      </div>


      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-4xl relative z-10">
        <h1
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 tracking-tight"
        >
          Welcome to ProfileX
        </h1>

        <div
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Enter your details</h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Profile Setup</span>
          </div>

          <form className="flex flex-col gap-6">


            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Personal Information</p>


            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  value={FirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Lalit"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  value={LastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Chandra"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={DOB}
                  onChange={(e) => setDOB(e.target.value)}
                  className={inputClass}
                />
              </div>



              <div className="flex gap-4">
                <label className={labelClass}> Gender </label>
                {genders.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={option}
                      checked={gender === option}
                      onChange={(e) => setGender(e.target.value)}
                      className="accent-purple-500"
                    />

                    <label className={labelClass}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>

            </div>


            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Blood Group</label>
                <select
                  value={BloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(blgrp => (
                    <option key={blgrp} value={blgrp}>{blgrp}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Marital Status</label>
                <select
                  value={MaritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {['Single', 'Married', 'Divorced', 'Widowed'].map(ms => (
                    <option key={ms} value={ms}>{ms}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Contact Information</p>


            <div className="flex flex-col">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abcd@gmail.com"
                className={inputClass}
              />
            </div>


            <div className="flex flex-row justify-between">
              <span>
                <label className={labelClass}>Phone Number 1</label>
                <input
                  type="tel"
                  value={Phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  placeholder="+91 99999 99999"
                  className={inputClass}
                />
              </span>
              <span>
                <label className={labelClass}>Phone Number 2</label>
                <input
                  type="tel"
                  value={Phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  placeholder="+91 99999 99999"
                  className={inputClass}
                />
              </span>

            </div>


            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Address</p>


            <div className="flex flex-col">
              <label className={labelClass}>Correspondence Address</label>
              <textarea
                value={CorrespondenceAddress}
                onChange={(e) => setCorrespondenceAddress(e.target.value)}
                placeholder="Current / correspondence address"
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>


            <div className="flex flex-col">
              <label className={labelClass}>Permanent Address</label>
              <textarea
                value={PermanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder="Permanent / home address"
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>


            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Education</p>

            <div className="flex flex-col">
              <label className={labelClass}>College Name</label>
              <input
                type="text"
                value={CollegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="example : DTU"
                className={inputClass}
              />
            </div>


            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Year</label>
                <select
                  value={Year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Passout'].map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col flex-1">
                <label className={labelClass}>Branch</label>
                <input
                  type="text"
                  value={Branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="example: Computer Science"
                  className={inputClass}
                />
              </div>
            </div>


            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mt-2">Work</p>

            <div className="flex flex-col">
              <label className={labelClass}>Work / Occupation</label>
              <input
                type="text"
                value={Work}
                onChange={(e) => setWork(e.target.value)}
                placeholder="example: Software Engineer"
                className={inputClass}
              />
            </div>


            <button
              type="button"
              onClick={handleSubmit}
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
            >
              Submit
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
