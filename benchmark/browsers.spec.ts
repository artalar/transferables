import { test, expect } from '@playwright/test';
import { writeFile } from './node.utils';

test('structuredClone (browser)', async ({ page, browserName }, { title }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Benchmark/);

  page.on('console', (msg) => {
    if (msg && msg.text) {
      if (typeof msg.text === 'function') {
        console.log('PAGE LOG:', msg.text());
      } else {
        console.log('PAGE LOG:', msg.text);
      }
    } else {
      console.log('PAGE LOG:', msg);
    }
  });

  // create a locator
  const structuredCloneBtn = page.locator('button#structuredClone');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(structuredCloneBtn).toHaveAttribute('type', 'button');

  // Click the get started link.
  await structuredCloneBtn.click();

  // Expects the URL to contain intro.
  const structuredCloneResult = page.locator("#structuredCloneResult");
  await structuredCloneResult.waitFor();

  const result = await structuredCloneResult.getAttribute("data-value") as string;
  console.log(`structuredClone (${browserName})`)
  console.log(result);

  writeFile(result, title, browserName);
})

test('MessageChannel (browser)', async ({ page, browserName }, { title }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Benchmark/);

  page.on('console', (msg) => {
    if (msg && msg.text) {
      if (typeof msg.text === 'function') {
        console.log('PAGE LOG:', msg.text());
      } else {
        console.log('PAGE LOG:', msg.text);
      }
    } else {
      console.log('PAGE LOG:', msg);
    }
  });

  // create a locator
  const postMessageMessageChannelBtn = page.locator('button#postMessageMessageChannel');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(postMessageMessageChannelBtn).toHaveAttribute('type', 'button');

  // Click the get started link.
  await postMessageMessageChannelBtn.click();

  // Expects the URL to contain intro.
  const postMessageMessageChannel = page.locator("#postMessageMessageChannelResult");
  await postMessageMessageChannel.waitFor();

  const result = await postMessageMessageChannel.getAttribute("data-value") as string;
  console.log(`MessageChannel (${browserName})`)
  console.log(result);

  writeFile(result, title, browserName);
})

test('Worker (browser)', async ({ page, browserName }, { title }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Benchmark/);

  page.on('console', (msg) => {
    if (msg && msg.text) {
      if (typeof msg.text === 'function') {
        console.log('PAGE LOG:', msg.text());
      } else {
        console.log('PAGE LOG:', msg.text);
      }
    } else {
      console.log('PAGE LOG:', msg);
    }
  });

  // create a locator
  const postMessageWorkerBtn = page.locator('button#postMessageWorker');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(postMessageWorkerBtn).toHaveAttribute('type', 'button');

  // Click the get started link.
  await postMessageWorkerBtn.click();

  // Expects the URL to contain intro.
  const postMessageWorker = page.locator("#postMessageWorkerResult");
  await postMessageWorker.waitFor();

  const result = await postMessageWorker.getAttribute("data-value") as string;
  console.log(`Worker (${browserName})`)
  console.log(result);

  writeFile(result, title, browserName);
});
