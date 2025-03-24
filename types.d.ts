declare module "bun" {
    interface Env {
        DISCORD_TOKEN: string;
        XATA_BRANCH: string;
        XATA_API_KEY: string;
        API_KEY: string;
        PORT: number;
        DISCORD_SECRET: string;
        DISCORD_CALLBACK: string;
        CLIENT_ID: string;
        S3_ACCESS_KEY_ID: string;
        S3_SECRET_ACCESS_KEY: string;
        S3_BUCKET: string;
        S3_ENDPOINT: string;
        KEY_FINGERPRINT: string;
    }
}