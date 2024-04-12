export function getOrigin(request: Request) {
  const url = new URL(request.url);
  url.host = request.headers.get('host') || 'localhost:3000';

  return url.origin;
}

export function getUrl(request: Request, path: string): URL {
  return new URL(path, getOrigin(request));
}
