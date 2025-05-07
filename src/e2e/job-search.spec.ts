
/**
 * End-to-End Tests for Job Search Flow
 * 
 * @playwright
 */

import { test, expect } from '@playwright/test';

test.describe('Job Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the job search page
    await page.goto('/jobs');
  });

  test('should display job search page correctly', async ({ page }) => {
    // Check for title
    await expect(page.locator('h1')).toContainText('Find Your Dream Job');
    
    // Check for search form
    await expect(page.locator('input[type="search"]')).toBeVisible();
    
    // Check for filter panels
    await expect(page.locator('text=Filter Results')).toBeVisible();
  });

  test('should perform basic job search', async ({ page }) => {
    // Enter search term
    await page.fill('input[type="search"]', 'developer');
    
    // Submit search
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForSelector('[data-testid="job-results"]');
    
    // Check that we got some results
    const jobCards = await page.locator('[data-testid="job-card"]').count();
    expect(jobCards).toBeGreaterThan(0);
  });

  test('should apply filters to job search', async ({ page }) => {
    // Open job type filter
    await page.click('text=Job Type');
    
    // Select Full-time option
    await page.click('text=Full-time');
    
    // Apply filters
    await page.click('text=Apply Filters');
    
    // Wait for results to update
    await page.waitForSelector('[data-testid="job-results"]');
    
    // Verify filter is applied
    await expect(page.locator('[data-testid="active-filters"]')).toContainText('Full-time');
  });

  test('should navigate to job details page', async ({ page }) => {
    // Wait for job cards to appear
    await page.waitForSelector('[data-testid="job-card"]');
    
    // Click on the first job card
    await page.click('[data-testid="job-card"]:first-child');
    
    // Check we're on a job details page
    await expect(page).toHaveURL(/\/job\/[^/]+$/);
    
    // Check for job details components
    await expect(page.locator('h1')).toBeVisible(); // Job title
    await expect(page.locator('button:text("Apply Now")')).toBeVisible();
  });
});
