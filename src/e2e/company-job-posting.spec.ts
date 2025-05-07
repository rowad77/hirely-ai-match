
/**
 * End-to-End Tests for Company Job Posting Flow
 * 
 * @playwright
 */

import { test, expect } from '@playwright/test';

// Test data
const COMPANY_USER = {
  email: 'company@example.com',
  password: 'Company123!'
};

const NEW_JOB = {
  title: 'Senior Frontend Developer',
  location: 'Remote, US',
  type: 'Full-time',
  salary: '$120,000 - $150,000',
  description: 'We are looking for an experienced frontend developer with React expertise.'
};

test.describe('Company Job Posting Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as a company user
    await page.goto('/login');
    await page.fill('input[type="email"]', COMPANY_USER.email);
    await page.fill('input[type="password"]', COMPANY_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for company dashboard
    await page.waitForURL('/company/dashboard');
  });

  test('should allow posting a new job', async ({ page }) => {
    // Navigate to job creation page
    await page.click('text=Jobs');
    await page.click('text=Create New Job');
    
    // Fill job details form
    await page.fill('input[name="title"]', NEW_JOB.title);
    await page.fill('input[name="location"]', NEW_JOB.location);
    
    // Select job type from dropdown
    await page.click('text=Select Job Type');
    await page.click(`text=${NEW_JOB.type}`);
    
    await page.fill('input[name="salary"]', NEW_JOB.salary);
    
    // Use rich text editor for description
    // Note: This might need custom handling depending on the editor
    await page.click('.rich-text-editor');
    await page.keyboard.type(NEW_JOB.description);
    
    // Submit the job
    await page.click('button:text("Publish Job")');
    
    // Check for success message
    await expect(page.locator('text=Job posted successfully')).toBeVisible();
    
    // Verify job appears in the company's job list
    await page.click('text=Jobs');
    await expect(page.locator(`text=${NEW_JOB.title}`)).toBeVisible();
  });

  test('should show validation errors for incomplete job postings', async ({ page }) => {
    // Navigate to job creation page
    await page.click('text=Jobs');
    await page.click('text=Create New Job');
    
    // Submit without filling required fields
    await page.click('button:text("Publish Job")');
    
    // Check for validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
  });
  
  test('should allow editing an existing job posting', async ({ page }) => {
    // Create a job first
    await page.click('text=Jobs');
    await page.click('text=Create New Job');
    
    // Fill job details
    await page.fill('input[name="title"]', NEW_JOB.title);
    await page.fill('input[name="location"]', NEW_JOB.location);
    await page.click('text=Select Job Type');
    await page.click(`text=${NEW_JOB.type}`);
    await page.fill('input[name="salary"]', NEW_JOB.salary);
    await page.click('.rich-text-editor');
    await page.keyboard.type(NEW_JOB.description);
    
    // Submit the job
    await page.click('button:text("Publish Job")');
    
    // Now edit the job
    await page.click('text=Jobs');
    await page.click(`text=${NEW_JOB.title}`);
    await page.click('button:text("Edit Job")');
    
    // Change title
    const updatedTitle = 'Senior Frontend Engineer';
    await page.fill('input[name="title"]', updatedTitle);
    
    // Save changes
    await page.click('button:text("Update Job")');
    
    // Check for success message
    await expect(page.locator('text=Job updated successfully')).toBeVisible();
    
    // Verify changes reflect in the job list
    await page.click('text=Jobs');
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();
  });

  test('should allow managing job applications', async ({ page }) => {
    // Go to jobs page
    await page.click('text=Jobs');
    
    // Click on job with applications
    await page.click('text=View Applications', { timeout: 5000 });
    
    // Ensure applications list loads
    await expect(page.locator('[data-testid="applications-list"]')).toBeVisible();
    
    // If applications exist, test reviewing an application
    const applicationCount = await page.locator('[data-testid="application-item"]').count();
    
    if (applicationCount > 0) {
      // Click on first application
      await page.click('[data-testid="application-item"]:first-child');
      
      // Check application details are visible
      await expect(page.locator('[data-testid="applicant-profile"]')).toBeVisible();
      
      // Test updating application status
      await page.click('text=Change Status');
      await page.click('text=Interview');
      
      // Verify status change
      await expect(page.locator('[data-testid="current-status"]')).toContainText('Interview');
    }
  });
});
