import { camelCase, kebabCase, snakeCase, pascalCase, capitalize, truncate, slugify, template } from '@oxog/utils';

const inputString = 'hello-world-example_string';

// Case conversions
console.log(camelCase(inputString));
console.log(kebabCase(inputString));
console.log(snakeCase(inputString));
console.log(pascalCase(inputString));

// Capitalize
console.log(capitalize('hello'));
console.log(capitalize('hello world'));

// Truncate
const longText = 'This is a very long text that needs to be truncated';
console.log(truncate(longText, 20));
console.log(truncate(longText, 20, '...'));
console.log(truncate(longText, 20, ' [more]'));

// Slugify
console.log(slugify('Hello World'));
console.log(slugify('Türkçe Başlık'));
console.log(slugify('Привет мир'));
console.log(slugify('Café au lait'));

// Template
const name = 'Ersin';
const greeting = template('Hello {{name}}!', { name });
console.log(greeting);

const data = {
  user: { name: 'Alice' },
  greeting: 'Welcome'
};
const message = template('{{greeting}} {{user.name}}!', data);
console.log(message);

// Real-world example: URL generation
const title = 'My Awesome Blog Post';
const url = `https://example.com/blog/${slugify(title)}`;
console.log(url);

// Real-world example: Form validation messages
const fieldName = 'firstName';
const errorMessage = template('{{field}} is required', { field: fieldName });
console.log(errorMessage);

// Real-world example: Generate API endpoints
const resource = 'user-profile';
const endpoint = `/api/${kebabCase(resource)}`;
console.log(endpoint);
