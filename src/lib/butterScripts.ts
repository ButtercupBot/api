import { s3 } from "bun";
import { type ChatInputCommandInteraction, type Interaction, type CacheType, InteractionType } from "discord.js";
import { getXataClient } from "../xata";
import EventEmitter from 'node:events';

const xata = getXataClient();

export class ButterFile {
    private file;
    constructor(private guildId: string, private name: string) {
        this.file = s3.file(`${guildId}/${name}`);
    }
    get = async () => {
        if (!await this.file.exists()) return false;
        return this.file.text();
    };
    write = async (content: string) => {
        this.file.write(content);
        const record = await xata.db.butterscripts.select(['guild_id', 'script_ids']).filter({ 'guild_id': this.guildId }).getFirst();

        let scripts: string[] = [];
        scripts.push(this.name);

        if (record?.script_ids) {
            scripts.push(...record.script_ids);
        }

        xata.db.butterscripts.createOrUpdate({
            id: record?.id,
            guild_id: this.guildId,
            script_ids: scripts
        });
    };
}

// const meow = new ButterFile('912503529338458142', '0');
// await meow.write(`console.log('meow')`);
// console.log(await meow.get());

// export class Script {
//     file;
//     constructor(public guildId: string, public id: string) { this.file = bucket.file(`${guildId}/${id}`); }
// }

export class Runner {
    worker!: Worker;
    ready = new Promise<boolean>((resolve) => {
        const interval = setInterval(() => {
            if (this.worker.onmessage) {
                resolve(true);
                clearInterval(interval);
            }
        });
    });
    constructor(script: string, public interaction: Interaction<CacheType>) {
        const blob = new Blob([
            script
        ]);
        const url = URL.createObjectURL(blob);
        this.createWorker(url);
    };
    createWorker = async (url: string) => {
        this.worker = new Worker(url, {
            // @ts-ignore | it does exist and is in the bun docs but not in the @types/bun package
            preload: ['./src/lib/butterDep.ts'],
        });
        await this.ready;
        return this;
    };
    run = () => {
        const reply = (message: string) => {
            if (this.interaction.type !== InteractionType.ApplicationCommand) return false;
            this.interaction.reply(message);
        };
        this.worker.onmessage = ({ data }) => {
            if (data.type === 'reply') {
                reply(data.data);
            }
        };
    };
}
