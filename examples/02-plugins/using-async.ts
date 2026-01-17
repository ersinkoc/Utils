import { debounce, throttle, sleep, retry, timeout } from '@oxog/utils/async';

// Debounce for search/input
const search = (query: string) => {
  console.log(`Searching for: ${query}`);
};

const debouncedSearch = debounce(search, 300);

debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc');

setTimeout(() => {
  debouncedSearch('final');
}, 500);

// Debounce with control methods
const save = (data: any) => {
  console.log('Saving:', data);
};

const debouncedSave = debounce(save, 1000);
debouncedSave({ id: 1, value: 'test' });

debouncedSave.cancel();

debouncedSave({ id: 1, value: 'final' });
console.log('Pending:', debouncedSave.pending());

debouncedSave.flush();

// Throttle for scroll/events
const onScroll = () => {
  console.log('Scroll event');
};

const throttledScroll = throttle(onScroll, 100);

window.addEventListener('scroll', throttledScroll);

// Sleep for async operations
async function processItems(items: string[]) {
  for (const item of items) {
    console.log('Processing:', item);
    await sleep(100);
  }
}

processItems(['item1', 'item2', 'item3']);

// Retry with exponential backoff
let attempts = 0;
const fetchData = async () => {
  attempts++;
  console.log(`Attempt ${attempts}`);
  if (attempts < 3) {
    throw new Error('Failed');
  }
  return 'success';
};

const result = await retry({
  fn: fetchData,
  attempts: 5,
  delay: 1000,
  backoff: 'exponential'
});

console.log(result);

// Retry with custom condition
const fetchWithRetry = async () => {
  attempts++;
  if (attempts < 3) {
    const error = new Error('Failed') as any;
    error.code = 'ECONNRESET';
    throw error;
  }
  return 'success';
};

const retryResult = await retry({
  fn: fetchWithRetry,
  attempts: 5,
  delay: 1000,
  retryIf: (error) => error.code === 'ECONNRESET'
});

console.log(retryResult);

// Timeout for long-running operations
const longOperation = async () => {
  return new Promise((resolve) => setTimeout(() => resolve('done'), 2000));
};

try {
  const data = await timeout(longOperation(), 1000);
  console.log(data);
} catch (error) {
  console.log('Operation timed out');
}

// Timeout for API calls
const fetchAPI = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

try {
  const apiData = await timeout(fetchAPI('https://api.example.com/data'), 5000);
  console.log(apiData);
} catch (error) {
  console.log('API request timed out');
}
