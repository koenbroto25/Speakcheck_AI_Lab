/**
 * Login - Student Authentication Component
 * 
 * Simple login with Student ID
 * 
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getStudentProfile, createStudent, saveStudentLocal } from '@/lib/speakcheck/api';
import type { Student } from '@/types/speakcheck';
import { GameCard, GameButton, GameInput } from './GameCard';
import { AliceAvatar } from './AliceAvatar';

interface LoginProps {
  onLogin: (student: Student) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [step, setStep] = useState<'id' | 'register'>('id');
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('7A');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for existing session
  useEffect(() => {
    const checkExistingSession = async () => {
      const storedId = localStorage.getItem('speakcheck_student_id');
      if (storedId) {
        setIsLoading(true);
        try {
          // In production, fetch from API
          const storedName = localStorage.getItem('speakcheck_student_name') || 'Student';
          const storedClass = localStorage.getItem('speakcheck_student_class') || '7A';
          
          onLogin({
            id: storedId,
            name: storedName,
            class: storedClass,
            xp: 0,
            createdAt: new Date(),
            settings: { soundEnabled: true, feedbackMode: 'auto', difficulty: 'medium', language: 'en-US' }
          });
        } catch (err) {
          console.error('Session check failed:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkExistingSession();
  }, [onLogin]);

  // Handle ID submission
  const handleIdSubmit = async () => {
    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login for ID:', studentId.trim());
      // Check if student exists
      const response = await getStudentProfile(studentId.trim());
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        // Existing student
        saveStudentLocal({
          id: response.data.id,
          name: response.data.name,
          class: response.data.class
        });
        onLogin(response.data);
      } else {
        setError(response.error || 'Student ID not found. Please register first.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please check your internet or API URL.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration submission
  const handleRegisterSubmit = async () => {
    if (!studentId.trim()) {
      setError('Please enter a Student ID/Username');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting registration for ID:', studentId.trim());
      // 1. Check if ID already exists
      const checkResponse = await getStudentProfile(studentId.trim());
      console.log('Uniqueness check response:', checkResponse);
      
      if (checkResponse.success && checkResponse.data) {
        setError('ID already exists. Please choose a different ID or username.');
        setIsLoading(false);
        return;
      }

      // 2. Create new student
      const response = await createStudent({
        studentId: studentId.trim(),
        name: name.trim(),
        studentClass
      });
      console.log('Create student response:', response);

      if (response.success && response.data) {
        saveStudentLocal({
          id: response.data.id,
          name: response.data.name,
          class: response.data.class
        });
        onLogin(response.data);
      } else {
        // Even if GAS returns success: false, it might have saved (as seen in user report)
        // This usually means there was a redirect or JSON parsing error in fetch
        setError(response.error || 'Registration pending. Try logging in with your ID.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration encountered an issue. Please try logging in with your ID.');
    } finally {
      setIsLoading(false);
    }
  };

  // Go to registration step
  const goToRegistration = () => {
    setStep('register');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F0F0F3]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AliceAvatar mood="happy" size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-[#4A90E2]">Speak Check AI Lab</h1>
        </div>

        <GameCard>
          <div className="space-y-6">
            {/* Step 1: Student ID */}
            {step === 'id' && (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-[#2D3748] mb-2">Welcome!</h2>
                  <p className="text-[#718096]">Enter your Student ID to continue</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D3748] mb-2">
                      Student ID
                    </label>
                    <GameInput
                      type="text"
                      placeholder="e.g., S001"
                      value={studentId}
                      onChange={setStudentId}
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <p className="text-[#E74C3C] text-sm text-center">{error}</p>
                  )}

                  <GameButton
                    variant="primary"
                    className="w-full"
                    onClick={handleIdSubmit}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Continue
                  </GameButton>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E8E8EB]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-[#F0F0F3] text-[#718096] text-sm">or</span>
                  </div>
                </div>

                <GameButton
                  variant="default"
                  className="w-full"
                  onClick={goToRegistration}
                  disabled={isLoading}
                >
                  📝 Register Here for New Student
                </GameButton>
              </>
            )}

            {/* Step 2: Registration Form */}
            {step === 'register' && (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-[#2D3748] mb-2">Student Registration</h2>
                  <p className="text-[#718096]">Create your learning account</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D3748] mb-1">
                      ID / Username
                    </label>
                    <GameInput
                      type="text"
                      placeholder="Choose a username"
                      value={studentId}
                      onChange={setStudentId}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D3748] mb-1">
                      Full Name
                    </label>
                    <GameInput
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={setName}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D3748] mb-1">
                      Class
                    </label>
                    <select
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl',
                        'bg-[#F0F0F3] text-[#2D3748]',
                        'shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff]',
                        'focus:outline-none focus:ring-2 focus:ring-[#4A90E2]'
                      )}
                    >
                      <option value="7A">Class 7A</option>
                      <option value="7B">Class 7B</option>
                      <option value="8A">Class 8A</option>
                      <option value="8B">Class 8B</option>
                      <option value="9A">Class 9A</option>
                      <option value="9B">Class 9B</option>
                    </select>
                  </div>

                  {error && (
                    <p className="text-[#E74C3C] text-sm text-center font-medium">{error}</p>
                  )}

                  <GameButton
                    variant="primary"
                    className="w-full"
                    onClick={handleRegisterSubmit}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Register
                  </GameButton>

                  <button
                    onClick={() => {
                      setStep('id');
                      setError('');
                    }}
                    className="w-full text-[#718096] hover:text-[#4A90E2] text-sm"
                  >
                    ← Back to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </GameCard>

        {/* Footer */}
        <p className="text-center text-[#718096] text-xs mt-6">
          Speak Check AI Lab v1.0<br />
          Built for Junior High School EFL Learners
        </p>
      </div>
    </div>
  );
}

export default Login;