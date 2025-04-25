
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Documentation = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hirely Documentation</h1>
        <div className="prose max-w-none">
          <p className="text-lg">Welcome to the Hirely documentation. Here you'll find detailed information about using our platform.</p>
          
          <h2 className="text-2xl mt-10 mb-4 font-bold">Getting Started</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Creating a Profile</li>
            <li>Searching for Jobs</li>
            <li>Applying to Positions</li>
          </ul>
          
          <h2 className="text-2xl mt-10 mb-4 font-bold">Features</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mt-6 mb-2">AI Resume Analysis</h3>
              <p className="mb-2">Our AI-powered resume analysis tool helps you understand your strengths and weaknesses as a candidate.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Upload your resume in PDF, DOC, DOCX, or TXT format</li>
                <li>Receive AI-generated feedback on your resume</li>
                <li>Get suggestions for improvements</li>
                <li>Automatically extract your skills, education, and work experience</li>
                <li>Update your profile with the extracted information</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mt-6 mb-2">Video Interview Preparation</h3>
              <p>Practice your interview skills with our AI-powered video interview preparation tool.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mt-6 mb-2">Job Matching</h3>
              <p>Our AI algorithm matches you with jobs that fit your skills and experience.</p>
            </div>
          </div>
          
          <h2 className="text-2xl mt-10 mb-4 font-bold">CV Extraction and Profile Updates</h2>
          <p className="mb-4">
            When you upload your CV, our AI not only analyzes it but also extracts key information to enhance your profile:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="font-medium">Skills:</span> Technical and soft skills are identified and added to your profile
            </li>
            <li>
              <span className="font-medium">Education:</span> Your educational background, degrees, and certifications are extracted
            </li>
            <li>
              <span className="font-medium">Work Experience:</span> Your job history including titles, companies, and dates is automatically populated
            </li>
            <li>
              <span className="font-medium">Personal Details:</span> Basic information like your name may be extracted if not already in your profile
            </li>
          </ul>
          <p className="mt-4">
            This information helps us match you more accurately with job opportunities and saves you time when applying for positions.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Documentation;
