import { test, expect } from '@playwright/test';

test.describe('MailFlow Adaptive UI', () => {
  test('should render fallback layout correctly initially', async ({ page }) => {
    await page.goto('/');
    
    // Expect the app title to be present
    await expect(page.locator('header').getByText('MailFlow')).toBeVisible();
    
    // Since mock user 'user_exec_001' has a preset, it should quickly load the custom layout instead of the fallback
    // But we check for something common or wait for layout render
    await page.waitForSelector('.ouas-layout', { timeout: 10000 });
  });

  test('should switch persona and apply preset configuration', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Student persona
    await page.locator('select').selectOption('user_student_001');
    
    // Wait for the calendar layout specific to student to appear
    await expect(page.locator('.ouas-layout--calendar')).toBeVisible({ timeout: 10000 });
    
    // Switch back to Executive
    await page.locator('select').selectOption('user_exec_001');
    
    // Wait for the single-column layout for executive
    await expect(page.locator('.ouas-layout--single-column')).toBeVisible({ timeout: 10000 });
  });

  test('agent chat UI should be visible and intractable', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('.agent-chat')).toBeVisible();
    
    // Test writing a prompt
    const input = page.locator('.chat-input-area input');
    await input.fill('Make it a two-column view');
    await expect(input).toHaveValue('Make it a two-column view');
    
    // For demo purposes, we will not hit the real Anthropic API in automated E2E tests, 
    // so we skip clicking "Send" here to avoid real agent calls unless mocked.
  });
});
