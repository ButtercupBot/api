import { s3 as bucket } from "bun";
import { type ChatInputCommandInteraction, type Interaction, type CacheType, InteractionType } from "discord.js";

export class Script {
    file;
    constructor(public guildId: string, public id: string) { this.file = bucket.file(`${guildId}/${id}`); }
}


export class Runner {
    worker;
    constructor(script: string, public interaction: Interaction<CacheType>) {
        const blob = new Blob([
            script
        ]);
        const url = URL.createObjectURL(blob);
        this.createWorker(url);
    };
    createWorker = async (url: string) => {
        this.worker = new Worker(url, {
            // @ts-ignore | it does exist and is in the bun docs but no in the @types/bun package
            preload: ['./src/lib/butterDep.ts'],
        });
        const waitForMessage = () => new Promise<void>((resolve) => {
            setInterval(() => {
                if (this.worker.onmessage) {
                    resolve();
                }
            });
        });

        await waitForMessage();


        this.worker.onmessage((event) => this.handleEvent(event.data.channel, event.data.data));
        this.worker.addEventListener('message', (event) => this.handleEvent(event.data.channel, event.data.data));

    };
    handleEvent = async (channel: string, data: string) => {
        switch (channel) {
            case 'reply': {
                if (this.interaction.type !== InteractionType.ApplicationCommand) return false;
                console.log('replying');
                await this.interaction.reply(data);
                break;
            }
        }
    };
}
