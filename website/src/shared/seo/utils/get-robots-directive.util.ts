export const getRobotsDirective = (defaultDirective: string): string =>
  import.meta.env.VITE_ROBOTS_DIRECTIVE || defaultDirective;
