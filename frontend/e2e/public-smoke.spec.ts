import { expect, test } from "@playwright/test";

test("home page renders search-led experience", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Find verified rental homes in Thailand" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  await expect(page.getByText("Fresh homes worth checking first")).toBeVisible();
});

test("property results page renders filters and fallback-safe results shell", async ({ page }) => {
  await page.goto("/properties?query=Bangkok&bedrooms=2&sort=price_asc");

  await expect(page.getByRole("heading", { name: "Browse verified homes" })).toBeVisible();
  await expect(page.getByPlaceholder("Location or keyword")).toHaveValue("Bangkok");
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
  await expect(page.getByText(/Page \d+ of \d+/)).toBeVisible();
});

test("auth entry pages render usable forms", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Login to FindYourCrib" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("link", { name: "Reset it" })).toBeVisible();

  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Account type")).toBeVisible();
});

test("password recovery pages render usable forms", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();

  await page.goto("/reset-password?token=dev-token");
  await expect(page.getByRole("heading", { name: "Choose a new password" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset password" })).toBeVisible();
});

test("missing routes render the custom not found state", async ({ page }) => {
  await page.goto("/definitely-not-a-real-listing");

  await expect(page.getByRole("heading", { name: "This page is not listed." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse homes" })).toBeVisible();
});
