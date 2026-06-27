import { useState } from 'react';


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

  const inputClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 w-full"
  const labelClass = "text-sm font-medium text-gray-600 mb-1"
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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-300 flex items-center justify-center p-6">

      <div className="w-full max-w-4xl">
        <h1
          className="text-4xl font-bold text-center text-purple-800 mb-6 font-display"
          style={{ textShadow: '1px 3px 5px rgba(0,0,0,0.15)' }}
        >
          Welcome to User U
        </h1>

        <div
          className="bg-white rounded-2xl p-8"
          style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.12)' }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Enter your details</h2>

          <form className="flex flex-col gap-5">


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
