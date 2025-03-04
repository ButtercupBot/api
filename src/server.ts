import { bearer } from '@elysiajs/bearer';
import { swagger } from '@elysiajs/swagger';
import { ActivityType } from 'discord.js';
import { Elysia, t } from 'elysia';
import { client } from '.';
import { version } from '../package.json';
import Guild from '$libGuild';
import { DiscordAuth, Scopes } from 'discord-auth.ts';
import type { AccessToken } from 'discord-auth.ts/src/interfaces/user/accessToken';


const oauth2 = new DiscordAuth(
    Bun.env.CLIENT_ID,
    Bun.env.DISCORD_SECRET,
    Bun.env.DISCORD_CALLBACK,
    [Scopes.IDENTIFY, Scopes.GUILDS],
);

const api = new Elysia()
    .use(
        swagger({
            documentation: {
                tags: [
                    { name: 'Protected', description: 'Server authentication is required for these endpoints' },
                    { name: 'Auth', description: 'User authentication endpoints' }
                ],

                info: {
                    title: 'ButterAPI Documentation',
                    version,
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'token',
                        },
                    },
                },
            },
        }),
    )
    .use(bearer())
    .get('/', ({ redirect }) => redirect('/swagger'))
    .group('auth', { detail: { tags: ['Auth'] } }, (auth) =>
        auth
            .get('/login', ({ redirect }) => redirect(oauth2.getAuthUrl()))
            .get('/callback', async ({
                query: { code, error },
                set,
                redirect,
                cookie: { token, userData }
            }) => {
                if (!code || error) {
                    set.status = 'Bad Request';
                    return 'Failed to log you in';
                }
                const accessToken = await oauth2.accessHandler().tokenExchange(code) as AccessToken;
                const user = await oauth2.user(accessToken).getUser();
                token.set({
                    value: accessToken,
                    domain: Bun.env.NODE_ENV ? 'buttercup.boo' : undefined,
                    path: '/',
                    maxAge: accessToken.expires_in,
                    expires: new Date(accessToken.expires_in),
                    sameSite: 'strict',
                    httpOnly: true,
                    secure: true
                });
                userData.set({
                    value: user,
                    domain: Bun.env.NODE_ENV ? 'buttercup.boo' : undefined,
                    path: '/',
                    maxAge: accessToken.expires_in,
                    expires: new Date(accessToken.expires_in),
                    sameSite: 'strict',
                    httpOnly: true,
                    secure: true
                });
                return redirect(Bun.env.NODE_ENV ? 'buttercup.boo/' : 'localhost:5173/');
            })
            .get('/logout', async ({
                redirect,
                cookie: { token, userData }
            }) => {
                token.remove();
                userData.remove();
                token.set({
                    value: null,
                    domain: Bun.env.NODE_ENV ? 'buttercup.boo' : undefined,
                    path: '/',
                    maxAge: 0,
                    expires: new Date(),
                    sameSite: 'strict',
                    httpOnly: true,
                    secure: true
                });
                userData.set({
                    value: null,
                    domain: Bun.env.NODE_ENV ? 'buttercup.boo' : undefined,
                    path: '/',
                    maxAge: 0,
                    expires: new Date(),
                    sameSite: 'strict',
                    httpOnly: true,
                    secure: true
                });
                return redirect(Bun.env.NODE_ENV ? 'buttercup.boo/' : 'localhost:5173/');
            })
    )
    .guard(
        {
            beforeHandle({ set, bearer }) {
                if (bearer !== Bun.env.API_KEY) {
                    set.status = 400;
                    set.headers['www-authenticate'] =
                        `Bearer realm='sign', error="invalid_request`;
                    return 'Unauthorized';
                }
            },
            detail: {
                tags: ['Protected']
            }
        },
        (guarded) =>
            guarded
                .get('guilds', () => Guild.guild.all())
                .get('guild/:id', ({ params: { id } }) => Guild.guild.byId(id).toJSON())
                .get('guild/:id/leave', async ({ params: { id } }) => {
                    const guild = Guild.guild.byId(id);
                    if (!guild) return false;
                    guild.leave();
                    return true;
                })
                .get('guild/:id/invite/create', ({ params: { id } }) => Guild.invites.create(id))
                .get('guild/:id/invite/remove/:invite', ({ params: { id, invite } }) => Guild.invites.remove(id, invite))
                .get('guild/:id/members', ({ params: { id } }) =>
                    Guild.members.all(id)
                )
                .get('guild/:id/channels', ({ params: { id } }) =>
                    Guild.channels.all(id)
                )
                .get('guild/:id/roles', ({ params: { id } }) => Guild.roles.get.all(id))
                .post(
                    '/bot/presence/',
                    ({ body, set }) => {
                        if (!client.user) {
                            set.status = 500;
                            return 'unable to access user';
                        }
                        client.user.setActivity({
                            name: 'Buttercup',
                            state: body.state,
                            type: ActivityType.Custom,
                        });
                        return 200;
                    },
                    {
                        body: t.Object({
                            state: t.String(),
                        }),
                    },
                ),

    );
// .post('function/message/register', ({ body: { guildId, messageMatcher, createdBy, onMatch } }) => {
//     new CreateFunctionMessage(guildId, messageMatcher, createdBy, onMatch)
// }, {
//     body: t.Object({
//         guildId: t.String(),
//         messageMatcher: t.String(),
//         createdBy: t.String(),
//         onMatch: t.Object({
//             type: t.String(),
//             content: t.String(),
//         })
//     })
// })

export default api;