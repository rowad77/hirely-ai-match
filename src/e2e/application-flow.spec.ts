
/**
 * End-to-End Tests for Job Application Flow
 * 
 * @playwright
 */

import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

// Test data
const TEST_USER = {
  email: 'candidate@example.com',
  password: 'Password123!'
};

test.describe('Job Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first as a candidate
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete and redirect
    await page.waitForURL('/dashboard');
  });

  test('should allow a candidate to apply for a job', async ({ page }) => {
    // Go to jobs page
    await page.goto('/jobs');
    
    // Search for a job
    await page.fill('input[type="search"]', 'developer');
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForSelector('[data-testid="job-results"]');
    
    // Click on the first job
    await page.click('[data-testid="job-card"]:first-child');
    
    // Wait for job details page
    await page.waitForSelector('button:text("Apply Now")');
    
    // Click apply button
    await page.click('button:text("Apply Now")');
    
    // Check we're on the application page
    await expect(page).toHaveURL(/\/apply/);
    
    // Step 1: Fill personal information
    await expect(page.locator('h1')).toContainText('Apply for');
    
    // Fill personal info if not already filled
    await page.fill('input[name="fullName"]', 'Test Candidate');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="phone"]', '555-123-4567');
    await page.fill('textarea[name="coverLetter"]', 'I am excited about this opportunity and believe my skills would be a great fit for the position.');
    
    // Continue to next step
    await page.click('button:text("Next")');
    
    // Step 2: Upload resume
    const fileBuffer = readFileSync(path.join(__dirname, '../fixtures/test-resume.pdf'));
    const fileName = 'test-resume.pdf';
    
    // Use file input to upload resume
    await page.locator('input[type="file"]').setInputFiles({
      name: fileName,
      mimeType: 'application/pdf',
      buffer: fileBuffer
    });
    
    // Continue to next step
    await page.click('button:text("Next")');
    
    // Step 3: Video interview (simulate)
    await expect(page.locator('h2')).toContainText('Video Interview');
    
    // Skip video interview for testing (click finish)
    await page.click('button:text("Submit Application")');
    
    // Check for success message
    await expect(page.locator('h2')).toContainText('Application Submitted');
    
    // Verify application shows in dashboard
    await page.goto('/dashboard');
    await page.click('text=Application History');
    
    // Should see the submitted application
    await expect(page.locator('[data-testid="application-item"]')).toBeVisible();
  });
  
  test('should show errors for invalid application inputs', async ({ page }) => {
    // Go to jobs page and select a job
    await page.goto('/jobs');
    await page.click('[data-testid="job-card"]:first-child');
    await page.click('button:text("Apply Now")');
    
    // Try to submit with empty fields
    await page.fill('input[name="fullName"]', '');
    await page.click('button:text("Next")');
    
    // Check for error message
    await expect(page.locator('text=Name is required')).toBeVisible();
    
    // Test invalid email format
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button:text("Next")');
    
    // Check for email validation error
    await expect(page.locator('text=valid email')).toBeVisible();
  });
  
  test('should allow resuming an incomplete application', async ({ page }) => {
    // Go to jobs page and select a job
    await page.goto('/jobs');
    await page.click('[data-testid="job-card"]:first-child');
    await page.click('button:text("Apply Now")');
    
    // Start filling out form
    await page.fill('input[name="fullName"]', 'Test Candidate');
    
    // Navigate away without completing
    await page.goto('/dashboard');
    
    // Check for "resume application" notification or card
    await expect(page.locator('text=Resume Application')).toBeVisible();
    
    // Click to resume
    await page.click('text=Resume Application');
    
    // Should be back on the application page with data preserved
    await expect(page.locator('input[name="fullName"]')).toHaveValue('Test Candidate');
  });
});
