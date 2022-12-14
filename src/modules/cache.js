import { caching } from 'cache-manager';

const memoryCache = await caching('memory', {
    max: 1000,
    ttl: 1000 * 60 * 5,
});

export { memoryCache }