
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Documentation = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hirely Documentation</h1>
        <div className="prose max-w-none">
          <p>Welcome to the Hirely documentation. Here you'll find detailed information about using our platform.</p>
          
          <h2 className="text-2xl mt-6 mb-4">Getting Started</h2>
          <ul className="list-disc pl-6">
            <li>Creating a Profile</li>
            <li>Searching for Jobs</li>
            <li>Applying to Positions</li>
          </ul>
          
          <h2 className="text-2xl mt-6 mb-4">Features</h2>
          <ul className="list-disc pl-6">
            <li>AI Resume Analysis</li>
            <li>Video Interview Preparation</li>
            <li>Job Matching</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default Documentation;
