console.time('Full Start');
import { ActivityType, Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { version } from '../package.json';
import { CreateFunctionMessage, GetFunctionMessage } from '$funcOnMessage';
import api from './server';
import { InteractionHandler } from '$libfunctions/Slash';

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
});

client.on('ready', async (client) => {
    console.log(`Started bot as ${client.user.tag}`);
    api.listen(Bun.env.PORT, (server) => {
        console.log(`server running: ${server.url}`);
    });
    client.user.setPresence({
        status: 'idle',
    });
    client.user.setActivity({
        name: 'Buttercup',
        state: `😺 Meow! v${version}`,
        type: ActivityType.Custom,
    });
    for (const OnMessage of await new GetFunctionMessage().all()) {
        console.time(`init message function ${OnMessage.id}`);
        new CreateFunctionMessage(
            OnMessage.guild_id,
            OnMessage.matcher,
            OnMessage.on_match
        ).discordRegister();
        console.timeEnd(`init message function ${OnMessage.id}`);
    }
    await handler.register();
    console.timeEnd('Full Start');
});

client.setMaxListeners(0);

const handler = new InteractionHandler();
await handler.init();

client.login(Bun.env.DISCORD_TOKEN);

export type API = typeof api;
