
/**
 * End-to-End Tests for Admin Job Import and Management
 * 
 * @playwright
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync } from 'fs';

// Test data
const ADMIN_USER = {
  email: 'admin@hirely.com',
  password: 'Admin123!'
};

test.describe('Admin Job Import and Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for admin dashboard
    await page.waitForURL('/owner/dashboard');
  });

  test('should import jobs using CSV upload', async ({ page }) => {
    // Navigate to jobs page
    await page.click('text=Jobs');
    
    // Click CSV upload button
    await page.click('[data-testid="csv-upload-button"]');
    
    // Prepare test CSV file
    const fileName = 'test-jobs.csv';
    const fileBuffer = readFileSync(path.join(__dirname, '../fixtures/test-jobs.csv'));
    
    // Upload CSV file
    await page.locator('input[type="file"]').setInputFiles({
      name: fileName,
      mimeType: 'text/csv',
      buffer: fileBuffer
    });
    
    // Select company for jobs (if required)
    await page.click('text=Select Company');
    await page.click('text=TechCorp');
    
    // Start import
    await page.click('button:text("Import Jobs")');
    
    // Check for import progress
    await expect(page.locator('text=Processing')).toBeVisible();
    
    // Wait for import completion (might take some time)
    await expect(page.locator('text=Import Complete')).toBeVisible({ timeout: 30000 });
    
    // Verify imported jobs count
    const importSummary = await page.locator('[data-testid="import-summary"]').textContent();
    expect(importSummary).toContain('jobs imported successfully');
  });

  test('should approve or reject pending jobs', async ({ page }) => {
    // Navigate to job approvals
    await page.click('text=Job Approvals');
    
    // Wait for pending jobs list
    await page.waitForSelector('[data-testid="pending-jobs-list"]');
    
    // If there are pending jobs, approve one
    const pendingJobsCount = await page.locator('[data-testid="pending-job-item"]').count();
    
    if (pendingJobsCount > 0) {
      // Click on first pending job
      await page.click('[data-testid="pending-job-item"]:first-child');
      
      // View job details
      await expect(page.locator('[data-testid="job-review-details"]')).toBeVisible();
      
      // Approve job
      await page.click('button:text("Approve")');
      
      // Check for success message
      await expect(page.locator('text=Job approved successfully')).toBeVisible();
      
      // Go back to job approvals
      await page.click('text=Job Approvals');
      
      // If there's another pending job, reject it to test both flows
      const remainingJobs = await page.locator('[data-testid="pending-job-item"]').count();
      if (remainingJobs > 0) {
        // Click on first pending job
        await page.click('[data-testid="pending-job-item"]:first-child');
        
        // Reject job with reason
        await page.click('button:text("Reject")');
        await page.fill('textarea[name="rejectionReason"]', 'Inappropriate content or formatting');
        await page.click('button:text("Confirm Rejection")');
        
        // Check for success message
        await expect(page.locator('text=Job rejected')).toBeVisible();
      }
    }
  });

  test('should configure job import settings', async ({ page }) => {
    // Navigate to import settings
    await page.click('text=Settings');
    await page.click('text=Job Import');
    
    // Test creating new import configuration
    await page.click('button:text("New Import Config")');
    
    // Fill configuration details
    await page.fill('input[name="configName"]', 'Daily Tech Jobs');
    
    // Select source
    await page.click('text=Select Source');
    await page.click('text=JobSpy');
    
    // Fill parameters
    await page.fill('input[name="searchTerms"]', 'developer,engineer');
    await page.fill('input[name="location"]', 'Remote,USA');
    
    // Set schedule
    await page.click('text=Select Schedule');
    await page.click('text=Daily');
    
    // Save configuration
    await page.click('button:text("Save Configuration")');
    
    // Check for success message
    await expect(page.locator('text=Import configuration saved')).toBeVisible();
    
    // Verify configuration appears in the list
    await expect(page.locator('text=Daily Tech Jobs')).toBeVisible();
  });

  test('should view system analytics and reports', async ({ page }) => {
    // Navigate to analytics
    await page.click('text=Analytics');
    
    // Check that analytics dashboard loads
    await expect(page.locator('[data-testid="analytics-dashboard"]')).toBeVisible();
    
    // Verify key metrics are displayed
    await expect(page.locator('[data-testid="total-jobs"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-companies"]')).toBeVisible();
    await expect(page.locator('[data-testid="registered-candidates"]')).toBeVisible();
    
    // Check chart components
    await expect(page.locator('[data-testid="job-trends-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="applications-chart"]')).toBeVisible();
    
    // Test downloading a report
    await page.click('button:text("Download Report")');
    
    // Note: Actual download verification may require additional setup
    await expect(page.locator('text=Report Generated')).toBeVisible();
  });
});
