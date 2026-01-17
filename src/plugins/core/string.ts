/**
 * Convert string to camelCase.
 *
 * @param str - String to convert
 * @returns camelCase string
 *
 * @example Basic usage
 * ```typescript
 * camelCase('hello-world'); // 'helloWorld'
 * camelCase('hello_world'); // 'helloWorld'
 * camelCase('hello world'); // 'helloWorld'
 * camelCase('Hello World'); // 'helloWorld'
 * camelCase('HelloWorld'); // 'helloWorld'
 * ```
 *
 * @see {@link kebabCase} for kebab-case conversion
 * @see {@link snakeCase} for snake_case conversion
 * @see {@link pascalCase} for PascalCase conversion
 */
export function camelCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .split(/[\s\-_]+/)
    .filter(word => word.length > 0)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

/**
 * Convert string to kebab-case.
 *
 * @param str - String to convert
 * @returns kebab-case string
 *
 * @example Basic usage
 * ```typescript
 * kebabCase('helloWorld'); // 'hello-world'
 * kebabCase('hello_world'); // 'hello-world'
 * kebabCase('hello world'); // 'hello-world'
 * kebabCase('HelloWorld'); // 'hello-world'
 * ```
 *
 * @see {@link camelCase} for camelCase conversion
 * @see {@link snakeCase} for snake_case conversion
 * @see {@link pascalCase} for PascalCase conversion
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert string to snake_case.
 *
 * @param str - String to convert
 * @returns snake_case string
 *
 * @example Basic usage
 * ```typescript
 * snakeCase('helloWorld'); // 'hello_world'
 * snakeCase('hello-world'); // 'hello_world'
 * snakeCase('hello world'); // 'hello_world'
 * snakeCase('HelloWorld'); // 'hello_world'
 * ```
 *
 * @see {@link camelCase} for camelCase conversion
 * @see {@link kebabCase} for kebab-case conversion
 * @see {@link pascalCase} for PascalCase conversion
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Convert string to PascalCase.
 *
 * @param str - String to convert
 * @returns PascalCase string
 *
 * @example Basic usage
 * ```typescript
 * pascalCase('hello-world'); // 'HelloWorld'
 * pascalCase('hello_world'); // 'HelloWorld'
 * pascalCase('hello world'); // 'HelloWorld'
 * pascalCase('helloWorld'); // 'HelloWorld'
 * ```
 *
 * @see {@link camelCase} for camelCase conversion
 * @see {@link kebabCase} for kebab-case conversion
 * @see {@link snakeCase} for snake_case conversion
 */
export function pascalCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .split(/[\s\-_]+/)
    .filter(word => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Capitalize first letter of string.
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example Basic usage
 * ```typescript
 * capitalize('hello'); // 'Hello'
 * capitalize('hello world'); // 'Hello world'
 * capitalize('HELLO'); // 'HELLO'
 * capitalize(''); // ''
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to specified length with optional suffix.
 *
 * @param str - String to truncate
 * @param length - Number of characters to keep before adding suffix
 * @param suffix - Suffix to append when truncated (default: '...')
 * @returns Truncated string
 *
 * @example Basic usage
 * ```typescript
 * truncate('Hello World', 5); // 'Hello...'
 * truncate('Hello World', 8); // 'Hello Wo...'
 * truncate('Hello', 10); // 'Hello'
 * ```
 *
 * @example With custom suffix
 * ```typescript
 * truncate('Hello World', 5, '---'); // 'Hello---'
 * truncate('Hello World', 8, ' [more]'); // 'Hello Wo [more]'
 * ```
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * Convert string to URL-safe slug with Turkish/Unicode support.
 *
 * @param str - String to slugify
 * @returns URL-safe slug
 *
 * @example Basic usage
 * ```typescript
 * slugify('Hello World'); // 'hello-world'
 * slugify('Hello  World!'); // 'hello-world'
 * ```
 *
 * @example Turkish characters
 * ```typescript
 * slugify('Türkçe Başlık'); // 'turkce-baslik'
 * slugify('Çorum'); // 'corum'
 * slugify('İstanbul'); // 'istanbul'
 * ```
 *
 * @example Unicode support
 * ```typescript
 * slugify('Привет мир'); // 'privet-mir'
 * slugify('Café au lait'); // 'cafe-au-lait'
 * ```
 */
export function slugify(str: string): string {
  // Character transliteration maps
  const charMap: Record<string, string> = {
    // Turkish
    'ş': 's', 'Ş': 's',
    'ı': 'i', 'İ': 'i',
    'ğ': 'g', 'Ğ': 'g',
    'ü': 'u', 'Ü': 'u',
    'ö': 'o', 'Ö': 'o',
    'ç': 'c', 'Ç': 'c',
    // Russian (Cyrillic to Latin - basic transliteration)
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    // Greek (basic)
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z',
    'η': 'i', 'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm',
    'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's',
    'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o'
  };

  return str
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .toLowerCase()
    // Normalize to NFD and remove combining marks (handles accented Latin characters)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Simple string interpolation with template variables.
 *
 * @param str - Template string with {{variable}} placeholders
 * @param data - Object with variable values
 * @returns Interpolated string
 *
 * @example Basic usage
 * ```typescript
 * template('Hello {{name}}!', { name: 'World' }); // 'Hello World!'
 * template('{{greeting}}, {{name}}!', { greeting: 'Hello', name: 'Alice' }); // 'Hello, Alice!'
 * ```
 *
 * @example With nested objects
 * ```typescript
 * template('Hello {{user.name}}!', { user: { name: 'Alice' } }); // 'Hello Alice!'
 * ```
 *
 * @example Missing variables
 * ```typescript
 * template('Hello {{name}}!', {}); // 'Hello !'
 * template('Hello {{user.name}}!', { user: {} }); // 'Hello !'
 * ```
 */
export function template(str: string, data: Record<string, any>): string {
  return str.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.trim().split('.');
    let value: any = data;

    for (const key of keys) {
      if (value == null) {
        return '';
      }
      value = value[key];
    }

    return value !== undefined ? String(value) : '';
  });
}
