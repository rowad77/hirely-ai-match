
/**
 * End-to-End Tests for Authentication Flow
 * 
 * @playwright
 */

import { test, expect } from '@playwright/test';

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'Password123!',
  name: 'Test User'
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login page
    await page.goto('/login');
  });

  test('should display login form correctly', async ({ page }) => {
    // Check for login form elements
    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check for signup link
    await expect(page.locator('a:text("Sign up")')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    
    // Fill email only
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    // Check for email validation error
    await expect(page.locator('text=valid email')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    // Click signup link
    await page.click('a:text("Sign up")');
    
    // Check we're on signup page
    await expect(page).toHaveURL(/\/signup/);
    
    // Check for signup form elements
    await expect(page.locator('h1')).toContainText('Sign Up');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should handle login with correct credentials', async ({ page }) => {
    // Fill login form
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // We should be redirected to the dashboard
    await page.waitForURL(/\/dashboard/);
    
    // Check we're logged in by looking for user name in the navbar
    await expect(page.locator('[data-testid="user-menu"]')).toContainText(TEST_USER.name);
  });

  test('should handle login failure with incorrect credentials', async ({ page }) => {
    // Fill login form with incorrect password
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', 'WrongPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
    
    // Should still be on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should handle logout', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL(/\/dashboard/);
    
    // Click on user menu
    await page.click('[data-testid="user-menu"]');
    
    // Click logout
    await page.click('text=Logout');
    
    // Should be logged out and redirected to home
    await page.waitForURL('/');
    
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});
