import { Command } from './@types/Util.js';
import { Client, Intents, Collection, Message, MessageEmbed } from 'discord.js';

import fs from 'fs';
import util from 'util';
import { clean } from './utils.js';

import dotenv from 'dotenv';
dotenv.config();

const intents = new Intents();
intents.add('GUILD_MESSAGES', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES');
const client = new Client({ intents: intents });

client.commands = new Collection();

// Events
client.on('ready', async () => {
    console.log('Client ready to rumble!');

    const commandFiles = fs.readdirSync('./dist/commands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command: Command = await import(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
});

client.on('messageCreate', (message) => {
    // Eval
    if (message.author.id == '211888560662511617' && message.content.startsWith('?')) {
        const args = message.content.slice(1).replace(/[ \r\n|\r|\n]/gi, ' ').trim().split(' ');
        const command = args.shift()?.toLowerCase() || '';

        if (command == 'eval') {
            const code = args.join(' ');

            const embed = new MessageEmbed().setTitle('**Eval**');
            embed.addField('Input', '```' + code + '```'); 

            try {
                let evaled = eval(code);
                if (typeof evaled !== 'string') {
                    evaled = util.inspect(evaled);
                }
                embed.addField('Output', '```' + clean(evaled) + '```');
            } catch (err) {
                embed.addField('Error', `\`\`\`${clean(err.toString())}\`\`\``);
            }

            message.channel.send({ embeds: [embed] });
        } else if (command == 'deploy') {
            client.commands.each(c => {
                message.guild?.commands.create(c.create).catch(e => {
                    message.react('❌')
                });
            });
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const today = new Date();
    const aprilFools = new Date('04-01-2021');
    if (today.getDate() == aprilFools.getDate() && today.getMonth() == aprilFools.getMonth()) {
        interaction.reply('https://giphy.com/gifs/rickroll-rick-astley-never-gonna-give-you-up-Vuw9m5wXviFIQ');
    } else if (client.commands.has(interaction.commandName)) {
        try {
            const command = client.commands.get(interaction.commandName);
            if (!command) return console.log('No command found.');

            if (!interaction.guildId) return interaction.reply({ content: 'Hell no!',  ephemeral: true });

            await interaction.defer({ ephemeral: command.hidden ? true : false });
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

// Login
client.login();
