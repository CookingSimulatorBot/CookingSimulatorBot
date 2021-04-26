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
    console.log('Reminder: GuildMember has to be changed soon to InteractionMember');

    const commandFiles = fs.readdirSync('./dist/commands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command: Command = await import(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
});

client.on('message', (message) => {
    // Check for "release"
    if (message.channel.id == '767708787967918081') return checkMessage(message);
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

            message.channel.send(embed);
        }
    }
});

client.on('interaction', async (interaction) => {
    if (!interaction.isCommand()) return;

    const today = new Date();
    const aprilFools = new Date('04-01-2021');
    if (today.getDate() == aprilFools.getDate() && today.getMonth() == aprilFools.getMonth()) {
        interaction.reply('https://giphy.com/gifs/rickroll-rick-astley-never-gonna-give-you-up-Vuw9m5wXviFIQ');
    } else if (client.commands.has(interaction.commandName)) {
        try {
            const command = client.commands.get(interaction.commandName);
            if (!command) return console.log('No command found.');

            if (!interaction.guildID) return interaction.reply('Hell no!', { ephemeral: true });

            interaction.defer(command.hidden ? true : false);
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

const checkMessage = (message: Message) => {
    if (message.content.includes('?') && message.content.includes('release')) {
        message.reply('All new information about the CS VR release can be found in <#587658747220983817>.');
    }
};
const token = 'ODI2MzU0MjAyMjUwNDQ0ODEy.YGLQUg.gf4QQf_GeLznvh9kix2I8ng89Gc'
// Login
client.login();
