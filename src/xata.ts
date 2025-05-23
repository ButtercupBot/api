// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "FuncOnMessage",
    checkConstraints: {
      FuncOnMessage_xata_id_length_xata_id: {
        name: "FuncOnMessage_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_FuncOnMessage_xata_id_key: {
        name: "_pgroll_new_FuncOnMessage_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "guild_id",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "matcher",
        type: "multiple",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "on_match",
        type: "json",
        notNull: true,
        unique: false,
        defaultValue:
          '\'{\n    "type": "message",\n    "content": "meow"\n}\'::json',
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "FuncOnSlash",
    checkConstraints: {
      FuncOnSlash_xata_id_length_xata_id: {
        name: "FuncOnSlash_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_FuncOnSlash_xata_id_key: {
        name: "_pgroll_new_FuncOnSlash_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "args",
        type: "json",
        notNull: true,
        unique: false,
        defaultValue: "'[]'::json",
        comment: "",
      },
      {
        name: "command",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "description",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "guild_id",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "permission",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "response",
        type: "json",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "apiKeys",
    checkConstraints: {
      apiKeys_xata_id_length_xata_id: {
        name: "apiKeys_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_apiKeys_xata_id_key: {
        name: "_pgroll_new_apiKeys_xata_id_key",
        columns: ["xata_id"],
      },
      apiKeys__pgroll_new_key_key: {
        name: "apiKeys__pgroll_new_key_key",
        columns: ["key"],
      },
    },
    columns: [
      {
        name: "key",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "scopes",
        type: "multiple",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "guilds",
    checkConstraints: {
      guilds_xata_id_length_xata_id: {
        name: "guilds_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_guilds_xata_id_key: {
        name: "_pgroll_new_guilds_xata_id_key",
        columns: ["xata_id"],
      },
      guilds_guild_id_unique: {
        name: "guilds_guild_id_unique",
        columns: ["guild_id"],
      },
    },
    columns: [
      {
        name: "guild_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "managers",
        type: "multiple",
        notNull: true,
        unique: false,
        defaultValue: "'{}'::text[]",
        comment: "",
      },
      {
        name: "plan",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type FuncOnMessage = InferredTypes["FuncOnMessage"];
export type FuncOnMessageRecord = FuncOnMessage & XataRecord;

export type FuncOnSlash = InferredTypes["FuncOnSlash"];
export type FuncOnSlashRecord = FuncOnSlash & XataRecord;

export type ApiKeys = InferredTypes["apiKeys"];
export type ApiKeysRecord = ApiKeys & XataRecord;

export type Guilds = InferredTypes["guilds"];
export type GuildsRecord = Guilds & XataRecord;

export type DatabaseSchema = {
  FuncOnMessage: FuncOnMessageRecord;
  FuncOnSlash: FuncOnSlashRecord;
  apiKeys: ApiKeysRecord;
  guilds: GuildsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Ahhh_Saturn-s-workspace-tncb11.eu-west-1.xata.sh/db/buttercup",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
