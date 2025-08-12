const LIST_SEPARATOR = '.';

type ParameterNames = 'scale' | 'center' | 'basemap';
type UrlParameterTypes = string | boolean | number[] | number;

export function setUrlParameter<T extends UrlParameterTypes>(name: ParameterNames, value: T) {
  const url = new URL(window.location.href);
  if (Array.isArray(value)) {
    url.searchParams.set(name, value.join(LIST_SEPARATOR));
  } else {
    url.searchParams.set(name, value.toString());
  }

  window.history.replaceState({}, '', url.toString());
}

export function getUrlParameter<T extends UrlParameterTypes>(
  name: ParameterNames,
  type: 'string' | 'boolean' | 'number[]' | 'number',
  defaultValue?: T,
): T | null {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(name);

  if (value === null) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    return null;
  }

  if (type === 'boolean') {
    return (value === 'true') as T;
  }

  if (type === 'number[]') {
    return (value ? value.split(LIST_SEPARATOR).map(Number) : null) as T;
  }

  if (type === 'number') {
    return (value ? Number(value) : null) as T;
  }

  if (type === 'string') {
    if (value.trim() === '') {
      return null;
    }
  }

  return value as T;
}
