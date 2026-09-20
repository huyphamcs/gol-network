export const APP_BASE_PATH = '/app';

export function appPath(path: `/${string}`): string {
  if (path === '/') return APP_BASE_PATH;
  return `${APP_BASE_PATH}${path}`;
}

export function stripAppBasePath(path: string): string {
  if (path === APP_BASE_PATH) return '/';
  return path.startsWith(`${APP_BASE_PATH}/`) ? path.slice(APP_BASE_PATH.length) : path;
}
