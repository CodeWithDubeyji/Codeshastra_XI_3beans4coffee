"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMountain, FaSnowflake, FaUmbrellaBeach, FaPlane, FaCar, FaTrain, FaBus, FaWallet, FaCalendarAlt } from 'react-icons/fa';
import { MdLocalActivity } from 'react-icons/md';

export default function TravelQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<{
    ageGroup: string;
    travelStyle: string;
    bucketList: string[];
    interests: string[];
    travelFrequency: string;
    preferredTransport: string;
    budgetRange: string;
    travelDuration: string;
  }>({
    ageGroup: '',
    travelStyle: '',
    bucketList: [],
    interests: [],
    travelFrequency: '',
    preferredTransport: '',
    budgetRange: '',
    travelDuration: ''
  });

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      // Redirect to create trip page
      router.push('/create-trip');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-white-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div
                key={num}
                className={`w-1/7 h-2 rounded-full mx-1 ${
                  num <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">What's your age group?</h2>
            <div className="grid grid-cols-1 gap-4">
              {['Student (13-25)', 'Adult (26-50)', 'Senior (51+)'].map((age) => (
                <button
                  key={age}
                  onClick={() => {
                    setAnswers({ ...answers, ageGroup: age });
                    handleNext();
                  }}
                  className="p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-3"
                >
                  <span className="text-xl">{age}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">What's your travel style?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setAnswers({ ...answers, travelStyle: 'Adventure' });
                  handleNext();
                }}
                className="p-6 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center space-y-2"
              >
                <FaMountain className="text-4xl text-blue-600" />
                <span>Adventure</span>
              </button>
              <button
                onClick={() => {
                  setAnswers({ ...answers, travelStyle: 'Winter' });
                  handleNext();
                }}
                className="p-6 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center space-y-2"
              >
                <FaSnowflake className="text-4xl text-blue-600" />
                <span>Winter</span>
              </button>
              <button
                onClick={() => {
                  setAnswers({ ...answers, travelStyle: 'Beach' });
                  handleNext();
                }}
                className="p-6 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center space-y-2"
              >
                <FaUmbrellaBeach className="text-4xl text-blue-600" />
                <span>Beach</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">Select your interests</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Food', 'Culture', 'Nature', 'History', 'Shopping', 'Nightlife'].map((interest) => (
                <button
                  key={interest}
                  onClick={() => {
                    const newInterests = answers.interests.includes(interest)
                      ? answers.interests.filter((i) => i !== interest)
                      : [...answers.interests, interest];
                    setAnswers({ ...answers, interests: newInterests });
                  }}
                  className={`p-4 border-2 rounded-xl transition-all flex items-center justify-center ${
                    answers.interests.includes(interest)
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <MdLocalActivity className="mr-2" />
                  <span>{interest}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">What's on your bucket list?</h2>
            <textarea
              className="w-full p-4 border-2 rounded-xl h-32 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your travel dreams (e.g., See Northern Lights, Visit Great Wall of China)"
              onChange={(e) => setAnswers({ ...answers, bucketList: e.target.value.split(',') })}
            />
            <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">How often do you travel?</h2>
            <div className="grid grid-cols-1 gap-4">
              {['Frequent (Multiple times a year)', 'Occasional (Once a year)', 'Rare (Less than once a year)'].map((frequency) => (
                <button
                  key={frequency}
                  onClick={() => {
                    setAnswers({ ...answers, travelFrequency: frequency });
                    handleNext();
                  }}
                  className="p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-3"
                >
                  <FaCalendarAlt className="text-2xl text-blue-600" />
                  <span>{frequency}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">Preferred mode of transport?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Flight', icon: FaPlane },
                { name: 'Train', icon: FaTrain },
                { name: 'Car', icon: FaCar },
                { name: 'Bus', icon: FaBus }
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    setAnswers({ ...answers, preferredTransport: name });
                    handleNext();
                  }}
                  className="p-6 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center space-y-2"
                >
                  <Icon className="text-4xl text-blue-600" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">What's your budget range?</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                'Budget Friendly (Under ₹20,000)',
                'Moderate (₹20,000 - ₹50,000)',
                'Luxury (Above ₹50,000)'
              ].map((budget) => (
                <button
                  key={budget}
                  onClick={() => setAnswers({ ...answers, budgetRange: budget })}
                  className={`p-4 border-2 rounded-xl transition-all flex items-center space-x-3 ${
                    answers.budgetRange === budget
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <FaWallet className="text-2xl text-blue-600" />
                  <span>{budget}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (answers.budgetRange) {
                  router.push('/create-trip');
                }
              }}
              disabled={!answers.budgetRange}
              className={`w-full mt-4 py-3 rounded-xl transition-colors ${
                answers.budgetRange
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              Complete Quiz
            </button>
          </div>
        )}

      </div>
    </div>
  );
}