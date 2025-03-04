import { client } from "../..";
import { getXataClient, type FuncOnMessageRecord } from "../../xata";
import type { EditableData, SelectableColumn, SelectedPick } from "@xata.io/client";

const xata = getXataClient();
const fields: SelectableColumn<FuncOnMessageRecord>[] = ['guild_id', 'matcher', 'on_match', 'id'];
type functionMessage = EditableData<SelectedPick<FuncOnMessageRecord, typeof fields>>;

export class CreateFunctionMessage {
    private record: functionMessage;
    constructor(guild_id: string, matcher: string[], on_match: { type: 'message', content: string; }) {
        this.record = {
            id: Bun.randomUUIDv7(),
            guild_id,
            matcher,
            on_match,
        };
    };
    discordRegister = () => {
        client.on('messageCreate', (message) => {
            if (!message.guild) return;
            if (message.guild.id !== this.record.guild_id) return;
            if (message.author.bot) return;
            if (!(new RegExp(this.record.matcher?.at(0) as string, this.record.matcher?.at(1)).exec(message.content))) return;
            switch (this.record.on_match.type) {
                case 'message': {
                    message.reply(this.record.on_match.content);
                    break;
                }
            }
        });
        return this;
    };
    dbRegister = () => {
        return xata.db.FuncOnMessage.create(this.record);
    };
}

export class GetFunctionMessage {
    private props: {
        guild_id?: string;
        id?: string;
    } = {};
    guild = (guildId: string) => {
        this.props.guild_id = guildId;
        return this;
    };
    id = (id: string) => {
        this.props.id = id;
        return this;
    };
    all = () => xata.db.FuncOnMessage.getAll();
    query = () => xata.db.FuncOnMessage.filter(this.props).getFirst();
}