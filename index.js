const Discord = require('discord.js');
const client = new Discord.Client();
const {
	prefix,
	token,
} = require('./config.json');

const {
    monsters,
    bosses,
} = require('./monsterdata.json');

client.on('ready', () => 
{
    console.log('Connected as ' + client.user.tag);
    
    client.user.setActivity("Gloomhaven");

    client.guilds.forEach((guild) => 
    {
        console.log(" - " + guild.name);
        guild.channels.forEach((channel) => 
        {
            console.log(` -- ${channel.name} ${channel.type} - ${channel.id}`);
        })
    })
    let testChannel = client.channels.get("680152659306872934");
    const attachment = new Discord.Attachment();
    testChannel.send("Hello! To view a list of commands type '.help'!");
});

client.on('reconnecting', () => 
{
	console.log('Reconnecting!');
});

client.on('disconnect', () => 
{
	console.log(client.user.tag + ' has Disconnected!');
});

client.on('message', (receivedMessage) => 
{
    if (receivedMessage.author == client.user) 
    {
        return;
    }

    if (receivedMessage.content.startsWith(prefix)) 
    {
        processCommand(receivedMessage);
    }
})

function processCommand(receivedMessage) 
{
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    if (primaryCommand == "help") 
    {
        helpCommand(receivedMessage);
    }
    else if (primaryCommand == "monster") 
    {
        monsterDataCommand(arguments, receivedMessage);
    }
    else if (primaryCommand == "boss") 
    {
        bossDataCommand(arguments, receivedMessage);
    }
    else if (primaryCommand == "monsterList") 
    {
        monsterListCommand(receivedMessage);
    }
    else if (primaryCommand == "bossList") 
    {
        bossListCommand(receivedMessage);
    }
    else 
    {
        receivedMessage.channel.send("I dont know what you mean. Type .help to view a list of commands.");
    }
}

function helpCommand(receivedMessage) 
{
    receivedMessage.channel.send("'.help' - Opens this menu \n" +
    "'.monster {monster type} {level} {n or e}' - Display monster details \n" +
    "'.boss {boss name} {level}' - Display boss details \n" +
    "'.monsterList' - Display the names of all available monsters \n" +
    "'.bossList' - Display the names of all available bosses"); 
}

function monsterListCommand(receivedMessage)
{
    var monsterList = "";
        for (var monster in monsters) 
        {
            if (!monsters.hasOwnProperty(monster)) continue;
            
            monsterList += monster + "\n";
        }
        receivedMessage.channel.send(monsterList);
}

function monsterDataCommand(arguments, receivedMessage) 
{
    if (arguments.length <= 2) 
    {
        receivedMessage.channel.send("Please specify a monster type, level(0-7), and if it is normal or elite. To view a list of monsters enter '.monsterList'.");     
    }
    else 
    {
        let monster = Object.values(monsters);
        let nameSplit = arguments[0].match(/[A-Z][a-z]+/g);
        let fullName = "";
        if (nameSplit.length < 2)
        {
           fullName = nameSplit[0];
        }
        else 
        {
            fullName = nameSplit[0] + " " + nameSplit[1];
        }
        for (let i=0; i<monster.length; i++)
        {
            console.log(monster[i]);
            if (fullName !== monster[i].name)
            {
                continue;
            }
            else
            {
                let selectedMonster = monster[i];
                let level = Object.values(selectedMonster.level);
                let numLevel = parseInt(arguments[1]);
                for (let j=0; j<level.length; j++)
                {
                    if (numLevel != level[j].level)
                    {
                        continue;
                    }
                    else
                    {
                        if(arguments[2] == "n")
                        {
                            let health = level[j].normal.health;
                            let move = level[j].normal.move;
                            let attack = level[j].normal.attack;
                            let range = level[j].normal.range;
                            let attributes = "";
                            for(i=0; i<level[j].normal.attributes.length; i++)
                            {
                                if(i == (level[j].normal.attributes.length) - 1)
                                {
                                    attributes += "[" + level[j].normal.attributes[i] + "] ";
                                }
                                else
                                {
                                    attributes += "[" + level[j].normal.attributes[i] + "], ";
                                }
                            }
                            if(attributes == null)
                            {
                                attributes = "None";
                            }

                            receivedMessage.channel.send("**" + fullName + " - Level: " + level[j].level + ", Normal**\n\n" +
                            "**Health:** " + health + "\n" +
                            "**Move:** " + move + "\n" +
                            "**Attack:** " + attack + "\n" +
                            "**Range:** " + range + "\n" +
                            "**Attributes:** " + attributes + "\n");
                        }
                        else if(arguments[2] == "e")
                        {
                            let health = level[j].elite.health;
                            let move = level[j].elite.move;
                            let attack = level[j].elite.attack;
                            let range = level[j].elite.range;
                            let attributes = "";
                            for(i=0; i<level[j].elite.attributes.length; i++)
                            {
                                if(i == (level[j].elite.attributes.length) - 1)
                                {
                                    attributes += "[" + level[j].elite.attributes[i] + "] ";
                                }
                                else
                                {
                                    attributes += "[" + level[j].elite.attributes[i] + "], ";
                                }
                            }
                            if(attributes == null)
                            {
                                attributes = "None";
                            }

                            receivedMessage.channel.send("**" + fullName + " - Level: " + level[j].level + ", Elite**\n\n" +
                            "**Health:** " + health + "\n" +
                            "**Move:** " + move + "\n" +
                            "**Attack:** " + attack + "\n" +
                            "**Range:** " + range + "\n" +
                            "**Attributes:** " + attributes + "\n");
                        }
                        else
                        {
                            receivedMessage.channel.send("Please enter if the monster is normal or elite {n/e}.");
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
}

function bossListCommand(receivedMessage)
{
    var bossList = "";
        for (var boss in bosses) 
        {
            if (!bosses.hasOwnProperty(boss)) continue;
            
            bossList += boss + "\n";
        }
        receivedMessage.channel.send(bossList);
}

function bossDataCommand(arguments, receivedMessage) 
{
    if (arguments.length <= 1) 
    {
        receivedMessage.channel.send("Please specify a boss and level(0-7). To view a list of bosses enter '.bossList'.");     
    }
    else 
    {
        let boss = Object.values(bosses);
        let nameSplit = arguments[0].match(/[A-Z][a-z]+/g);
        let fullName = "";
        if (nameSplit.length < 2)
        {
           fullName = nameSplit[0];
        }
        else 
        {
            fullName = nameSplit[0] + " " + nameSplit[1];
        }
        for (let i=0; i<boss.length; i++)
        {
            console.log(boss[i]);
            if (fullName !== boss[i].name)
            {
                continue;
            }
            else
            {
                let selectedBoss = boss[i];
                let level = Object.values(selectedBoss.level);
                let numLevel = parseInt(arguments[1]);
                for (let j=0; j<level.length; j++)
                {
                    if (numLevel != level[j].level)
                    {
                        continue;
                    }
                    else
                    {
                        let health = level[j].health;
                        let move = level[j].move;
                        let attack = level[j].attack;
                        let range = level[j].range;
                        let notes = level[j].notes;

                        let immunities = "";
                        for(i=0; i<level[j].immunities.length; i++)
                        {
                            if(i == level[j].immunities.length - 1)
                            {
                                immunities += "[" + level[j].immunities[i] + "] ";
                            }
                            else
                            {
                                immunities += "[" + level[j].immunities[i] + "], ";
                            }
                        }
                        if(immunities == null)
                        {
                            immunities = "None";
                        }

                        let special1 = "";
                        for(i=0; i<level[j].special1.length; i++)
                        {
                            if(i == level[j].special1.length - 1)
                            {
                                special1 += "[" + level[j].special1[i] + "] ";
                            }
                            else
                            {
                                special1 += "[" + level[j].special1[i] + "], ";
                            }
                        }
                        if(special1 == null)
                        {
                            special1 = "None";
                        }

                        let special2 = "";
                        for(i=0; i<level[j].special2.length; i++)
                        {
                            if(i == level[j].special2.length - 1)
                            {
                                special2 += "[" + level[j].special2[i] + "] ";
                            }
                            else
                            {
                                special2 += "[" + level[j].special2[i] + "], ";
                            }
                        }
                        if(special2 == null)
                        {
                            special2 = "None";
                        }

                        receivedMessage.channel.send("**" + fullName + " - Level: " + level[j].level + "**\n\n" +
                        "**Health:** " + health + "\n" +
                        "**Move:** " + move + "\n" +
                        "**Attack:** " + attack + "\n" +
                        "**Range:** " + range + "\n" +
                        "**Immunities:** " + immunities + "\n" +
                        "**Special 1:** " + special1 + "\n" +
                        "**Special 2:** " + special2 + "\n" +
                        "**Notes:** " + notes + "\n"
                        );   
                            
                    }
                    break;    
                }
            }
            break;
        }
    }
}


client.login(token);