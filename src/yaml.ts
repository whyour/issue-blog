import * as yaml from 'js-yaml';
const optionalByteOrderMark = '\\ufeff?';
const platform = typeof process !== 'undefined' ? process.platform : '';
const pattern =
  '^(' +
  optionalByteOrderMark +
  '(= yaml =|---)' +
  '$([\\s\\S]*?)' +
  '^(?:\\2|\\.\\.\\.)\\s*' +
  '$' +
  (platform === 'win32' ? '\\r?' : '') +
  '(?:\\n)?)';
const regex = new RegExp(pattern, 'm');

export function parse(string: string) {
  string = string || '';

  const lines = string.split(/(\r?\n)/);
  if (lines[0] && /= yaml =|---/.test(lines[0])) {
    return yamlParse(string);
  } else {
    return { attributes: {}, body: string };
  }
}

function yamlParse(string: string) {
  const match = regex.exec(string);

  if (!match) {
    return {
      attributes: {},
      body: string
    };
  }

  const yamlString = match[match.length - 1].replace(/^\s+|\s+$/g, '');
  const attributes = yaml.load(yamlString) || {};
  const body = string.replace(match[0], '');

  return { attributes: attributes, body: body };
}

export function stringify(obj: any) {
  if (!obj) {
    throw new TypeError('obj is required!');
  }

  const content = obj._content || '';
  delete obj._content;

  if (!Object.keys(obj).length) {
    return content;
  }

  const separator = '---';
  let result = '---\n';
  result += stringifyYAML(obj);
  result += `${separator}\n${content}`;

  return result;
}

function stringifyYAML(obj: any) {
  const keys = Object.keys(obj);
  const data: any = {};
  const nullKeys = [];
  const dateKeys = [];
  let key, value, i, len;

  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    value = obj[key];

    if (value === null) {
      nullKeys.push(key);
    } else if (value instanceof Date) {
      dateKeys.push(key);
    } else {
      data[key] = value;
    }
  }

  let result = yaml.dump(data);

  if (dateKeys.length) {
    for (i = 0, len = dateKeys.length; i < len; i++) {
      key = dateKeys[i];
      result += `${key}: ${formatDate(obj[key])}\n`;
    }
  }

  if (nullKeys.length) {
    for (i = 0, len = nullKeys.length; i < len; i++) {
      result += `${nullKeys[i]}:\n`;
    }
  }

  return result;
}

function doubleDigit(num: number) {
  return num < 10 ? `0${num}` : num;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${doubleDigit(
    date.getMonth() + 1
  )}-${doubleDigit(date.getDate())} ${doubleDigit(
    date.getHours()
  )}:${doubleDigit(date.getMinutes())}:${doubleDigit(date.getSeconds())}`;
}
