export const ensureArray = <T>(data: T): T | [] => (Array.isArray(data) ? data : []);
