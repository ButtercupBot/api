import { XataClient } from "../xata";
import { init } from "@paralleldrive/cuid2";

const createKey = init({
    random: Math.random,
    length: 64,
    fingerprint: Bun.env.KEY_FINGERPRINT
});

const xata = new XataClient({
    apiKey: Bun.env.XATA_API_KEY,
    branch: Bun.env.XATA_BRANCH,
});

export const createAPIKey = async (scopes: string[]) => {
    const key = createKey();
    await xata.db.apiKeys.create({
        key: key,
        scopes: scopes,
    });
    return key;
};

export const validateAPIKey = async (key: string) => {
    const record = await xata.db.apiKeys.filter('key', key).getFirst();
    if (record) return record.scopes;
    return null;
};
