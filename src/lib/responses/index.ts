import { respond as messageRespond } from "./message";
import { respond as embedRespond } from "./embed";
import type { ResponseSchema as EmbedResponseSchema } from "./embed";
import type { ResponseSchema as MessageResponseSchema } from "./message";

export {
    messageRespond,
    embedRespond,
    type EmbedResponseSchema,
    type MessageResponseSchema
};