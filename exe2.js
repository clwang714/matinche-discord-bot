const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const search = require('youtube-search');
const Anesidora = require("anesidora");
const fs = require('fs');
const download = require('download');
const csv = require('csv-array');
const ow = require('overwatch-js');

const bot = new Discord.Client();
const token = '***************************************';

const opts = {
    maxResults: 1,
    key: '********************************',
    type: 'video'
};

const blue1 = '#1084cc';
const blue2 = '#00a8e0';
const pink1 = '#ff8ed9';
const pink2 = '#fc7bd1';

const george = '***************';
const chris = '***************';
const weebtown = '***************';
const logan = '***************';
const loganBot = '***************';
const emile = '***************';
const matin = '***************';
const stan = '***************';
const simon = '***************';
const jack = '***************';
const justin = '***************';
const guillermo = '***************';
const grant = '***************';


const botRole = '***************';
const chrisRole = '***************';
const mentionAbuser = '***************';
const everyone = '***************';


const matinche = '***************'
const xd = '***************';
const music = '***************';
const bots = '***************';

const sammyslincrofts = '***************';
const ownly = '***************';

const botherEmile = false;
const botherEmileChannel = ownly;

var playing;
var vol = 5;
var streamOptions = { seek: 0, volume: vol/50};

var playlist = [];
var songlist = [];
var index = 0;

var anchortime = bot.uptime;
var noSong = 0;

var userblacklist = [];
var blacklistWhitelist = ['************','*************'];
//var blacklistWhitelist = [];

const owPlayers = [*****,*****,*****,*****];
const owNames = ['****','*****','*****','*****'];
const owIDs = ['***************','****************','************','***********'];
const trackPlayer = [true,false,false,false];
var playerIndex;
var owData;
var prevOwData;
var gamesWon = 0;
var gamesLost = 0;
var gamesTied = 0;
var currentSR = 0;
var currentTime = 0;
var wasPlayingOw = [false,false,false,false];
var justPostedStats = [true,true,true,true];

var dispatcher;
var wasPlaying;
var paused = false;
var resumeTime = 0;

var pandora = new Anesidora("**************************", "***********************");
var playingRadio = false;
var station;
var track;

var temp2;
var loganChance = 10;
var emileDeleteChance = 20;

var deleting = false;
var deleteNumber = 0;
const deleteThreshold = 20;

var helping = false;

/******************************************************************************************************************/

function checkName(c)
{return (c.user.username == searchName);}

function checkStation(s)
{return (s.stationName === 'Today\'s Hits Radio');}

function isNumeric(n)
{return !isNaN(parseFloat(n)) && isFinite(n);}

function nextRadio(channel)
{
    pandora.login(function(err) {
        if (err) throw err;
        pandora.request("user.getStationList", function(err, stationList) {
            if (err) throw err;
            station = stationList.stations.find(checkStation);
            pandora.request("station.getPlaylist", {
                "stationToken": station.stationToken,
                "additionalAudioUrl": "HTTP_128_MP3"
            }, function(err, playlist) {
                if (err) throw err;
                track = playlist.items[0];
                download(track.additionalAudioUrl, __dirname + '/..', {filename:'radiosong.mp3'}).then(() => {
                    console.log('Downloaded ' + track.songName);
                });
            });
        });
    });

    anchortime = bot.uptime;

    setTimeout(function() {
        var song = track.songName;
        anchortime = bot.uptime;

        playlist.push(song);
        channel.join()

        .then(connection => {
            console.log('Connected!')
            dispatcher = connection.playFile(__dirname + '/../radiosong.mp3', {seek: 0, volume: vol/75, passes: 1});
        })
        .catch(console.error);
        index++;

        bot.channels.get(music).send('**Radio Mode** - Playing **' + song + '**');
        bot.user.setGame(song);

        //console.log(track);
    }, 3500);
}

/********************************************************************************************************************/

bot.login(token);

bot.on('ready', () => {
    console.log('I am ready!');
    bot.user.setStatus('offline');
    bot.user.setStatus('online');
    bot.user.setGame(null);

    //bot.guilds.get(matinche).members.get(stan).setVoiceChannel(ownly)

    if(botherEmile)
    {
        bot.guilds.get(matinche).members.get(emile).setVoiceChannel(botherEmileChannel);
    }
    //bot.channels.find(checkMusic).members.find(checkEmile).setVoiceChannel(sammyslincrofts););
    //bot.channels.get(xd).send('yikes')
    //console.log(bot.guilds.get(matinche).roles);
    //console.log(bot.guilds.get(matinche).members.get(emile).setRoles([mentionAbuser]));
    //console.log(bot.guilds.get(matinche).roles.get(mentionAbuser).hasPermission(['SEND_MESSAGES','EMBED_LINKS','ATTACH_FILES','CONNECT','SPEAK','USE_VAD','CHANGE_NICKNAME']));

    for(var i = 0; i < owPlayers.length; i = i + 1)
    {
        if(bot.channels.get(xd).members.get(owPlayers[i]).presence.game != null && bot.channels.get(xd).members.get(owPlayers[i]).presence.game.name == 'Overwatch')
        {
            wasPlayingOw[i] = true;
            console.log(owPlayers[i]);
        }
    }
});
/*
bot.on('typingStart', (channel, user) => {
    if(user.id == emile)
    {
        bot.guilds.get(matinche).roles.get(everyone).setPermissions(['SEND_MESSAGES','ADD_REACTIONS','READ_MESSAGES','EMBED_LINKS','ATTACH_FILES','CONNECT','SPEAK','USE_VAD','READ_MESSAGE_HISTORY',]);
    }
});

bot.on('typingStop', (channel, user) => {
    if(user.id == emile)
    {
        bot.guilds.get(matinche).roles.get(everyone).setPermissions(['SEND_MESSAGES','ADD_REACTIONS','READ_MESSAGES','EMBED_LINKS','ATTACH_FILES','CONNECT','SPEAK','USE_VAD','READ_MESSAGE_HISTORY','MENTION_EVERYONE']);
    }
});*/

bot.on('voiceStateUpdate', (oldMember, newMember) =>
{
    if(botherEmile && newMember.id === emile && newMember.voiceChannelID != botherEmileChannel)
    {
        newMember.setVoiceChannel(botherEmileChannel);
    }
});

bot.on('guildMemberSpeaking', (member, speaking) =>
{
    if(bot.voiceConnections.last() != null && !paused)
    {
        if (bot.voiceConnections.last().speaking)
        {anchortime = bot.uptime;}

        if (bot.uptime - anchortime > 4000 && !bot.voiceConnections.last().speaking)
        {
            if(!playingRadio)
            {
                if(playlist[index] != null)
                {bot.channels.get(music).send('!next');
                    anchortime = bot.uptime;}
                else
                {bot.user.setGame(null);
                    playing = '0';
                    bot.voiceConnections.last().channel.leave();}
            }
            else
            {nextRadio(bot.voiceConnections.last().channel);}
        }
    }
});

bot.on('presenceUpdate', (oldMember, member) =>
{
    if(owPlayers.includes(member.id) && trackPlayer[owPlayers.indexOf(member.id)] && member.presence.game != null && member.presence.game.name == 'Overwatch' && !wasPlayingOw[owPlayers.indexOf(member.id)])
    {
        playerIndex = owPlayers.indexOf(member.id);
        console.log('aaaaa' + playerIndex);
        wasPlayingOw[playerIndex] = true;

        ow.getOverall('pc', 'us', owIDs[playerIndex])
        .then((data) => owData = data);

        setTimeout(function() {
            gamesWon = owData.competitive.global.games_won;
            gamesLost = owData.competitive.global.games_lost;
            gamesTied = owData.competitive.global.games_tied;
            currentSR = owData.profile.rank;
            currentTime = Math.floor(Date.now() / 1000);

            fs.writeFile(__dirname + '/../data/' + owNames[playerIndex] + '.csv', "Won,Lost,Tied,SR,Time_Started\n"+gamesWon+','+gamesLost+','+gamesTied+','+currentSR+','+currentTime, function (err){
                if(err) throw err;
            });
        }, 6000);
    }

    if(owPlayers.includes(member.id) && trackPlayer[owPlayers.indexOf(member.id)] && (member.presence.game == null || member.presence.game.name != 'Overwatch'))
    {
        playerIndex = owPlayers.indexOf(member.id);
        csv.parseCSV(__dirname + '/../data/' + owNames[playerIndex] + '.csv', function(data){
            prevOwData = data;
        }, true);

        setTimeout(function() {
            if(wasPlayingOw[playerIndex])
            {
                console.log('bbbbb' + playerIndex);
                wasPlayingOw[playerIndex] = false;
                ow.getOverall('pc', 'us', owIDs[playerIndex])
                .then((data) => owData = data);

                setTimeout(function() {
                    gamesWon = owData.competitive.global.games_won;
                    gamesLost = owData.competitive.global.games_lost;
                    gamesTied = owData.competitive.global.games_tied;
                    currentSR = owData.profile.rank;
                    currentTime = Math.floor(Date.now() / 1000);

                    if(gamesWon-prevOwData[0].Won + gamesLost-prevOwData[0].Lost + gamesTied-prevOwData[0].Tied != 0)
                    {
                        var timePlayed = Math.round((currentTime - parseInt(prevOwData[0].Time_Started))/60);
                        var SRchange = 'No Change';

                        if(prevOwData[0].SR > 500 && currentSR == 500)
                        {SRchange = 'Lost >' + (prevOwData[0].SR-currentSR) + ' SR';}
                        else if (prevOwData[0].SR == 500 && currentSR == 500)
                        {
                            if((gamesWon-prevOwData[0].Won)>(gamesLost-prevOwData[0].Lost))
                            {SRchange = 'Gained ??? SR';}
                            else
                            {SRchange = 'Lost ??? SR';}
                        }
                        else if(prevOwData[0].SR == 500 && currentSR > 500)
                        {SRchange = 'Gained >' + (currentSR-prevOwData[0].SR) + ' SR'}
                        else if(prevOwData[0].SR > currentSR)
                        {SRchange = 'Lost ' + (prevOwData[0].SR-currentSR) + ' SR';}
                        else if(currentSR > prevOwData[0].SR)
                        {SRchange = 'Gained ' + (currentSR-prevOwData[0].SR) + ' SR'}

                        if(currentSR == 500)
                        {currentSR = '<500 SR';}
                        else
                        {currentSR = currentSR + ' SR';}

                        //console.log(playerIndex);
                        //console.log(member.id);
                        var username = owIDs[playerIndex].substring(0,owIDs[playerIndex].indexOf('-'));

                        bot.channels.get(bots).send(username + '\'s Overwatch Session Details :tada::tada:\nTime Played: **' + timePlayed + ' mins**\nGames Won: **' + (gamesWon-prevOwData[0].Won) + '**\nGames Lost: **' + (gamesLost-prevOwData[0].Lost) + '**\nGames Tied: **' + (gamesTied-prevOwData[0].Tied) + '**\n∆SR: **' + SRchange + '**, Current: **' + currentSR + '**');

                        currentSR = owData.profile.rank; //change back to a number before saving

                        fs.writeFile(__dirname + '/../data/' + owNames[playerIndex] + '.csv', "Won,Lost,Tied,SR,Time_Started\n"+gamesWon+','+gamesLost+','+gamesTied+','+currentSR+','+currentTime, function (err){
                            if(err) throw err;
                        });
                    }
                }, 6000);
            }
        }, 1000);
    }
});

bot.on('message', message =>
{
    if ((message.content.includes('!play ') || message.content.includes('!next') || message.content.includes('!prev') || message.content.includes('!vol ') || message.content.includes('!volume ') || message.content.includes('!spacejam') || message.content.includes('!dingdingdong') || message.content.includes('!himehime') || message.content.includes('!jdonn') || message.content.includes('!emile') || message.content.includes('!jack') || message.content.includes('!o_o') || message.content.includes('!godaddy') || message.content.includes('!hohoho') ||  message.content === '!radio') && message.guild.id == matinche)
    {
        if(!message.content.includes('!vol ') && !message.content.includes('!volume '))
        {resumeTime = 0;}

        if(bot.voiceConnections.last() != null && bot.voiceConnections.last().speaking && (!playingRadio || message.content === '!radio'))
        {dispatcher.end('play');}
    }

    if(playingRadio && (message.content.includes('!spacejam') || message.content.includes('!dingdingdong') || message.content.includes('!himehime') || message.content.includes('!jdonn') || message.content.includes('!emile') || message.content.includes('!jack') || message.content.includes('!o_o') || message.content.includes('!godaddy') || message.content.includes('!hohoho')) && message.guild.id == matinche)
    {
        message.channel.send('Playing sound bites disabled in radio mode');
    }

    if (message.content.includes('!play ') && message.member.voiceChannel != null && message.guild.id == matinche)
    {
        if(!playingRadio)
        {
            if(!userblacklist.includes(message.member.displayName))
            {
                noSong = 0;
                anchortime = bot.uptime;
                playing = '0';
                var channel = message.member.voiceChannel;
                var song = message.content.substring(6);
                if(song.substring(0,4) != 'http')
                {
                    console.log(song);
                    search(song, opts, function(err, results)
                    {
                        if(err) return console.log(err);
                        if(results.length != 0)
                        {song = results[0].link;
                        songlist.push(results[0].title);
                        console.log(song);}
                        else
                        {noSong = 1;
                        message.channel.send("No result found for **" + song + "**");}
                    });
                }
                else
                {
                    setTimeout(function() {
                        songlist.push(message.embeds[0].title);
                    }, 1000);
                }

                setTimeout(function() {
                    playlist.push(song);
                    channel.join()

                    .then(connection => {
                        console.log('Connected!')
                        var stream = ytdl(song, {filter : 'audioonly'});
                        dispatcher = connection.playStream(stream, streamOptions);
                    })
                    .catch(console.error);
                    index++;

                    message.channel.send('Playing **' + songlist[songlist.length-1] + '**');
                    bot.user.setGame(songlist[songlist.length-1]);

                    var p = message.delete();
                    p.catch(() => {}); // add an empty catch handler
                    return p;

                }, 1000);
            }
        }
        else
        {
            message.channel.send('Overriding songs disabled in radio mode');
            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if (message.content.includes('!queue ') && message.member.voiceChannel != null && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        if(!playingRadio)
        {
            noSong = 0;
            var channel = message.member.voiceChannel;
            var song = message.content.substring(7);
            if(song.substring(0,4) != 'http')
            {
                console.log(song);
                search(song, opts, function(err, results)
                {
                    if(err) return console.log(err);
                    if(results.length != 0)
                    {song = results[0].link;
                    songlist.push(results[0].title);}
                    else
                    {noSong = 1;
                    message.channel.send("No result found for **" + song + "**");}
                });
            }
            else
            {
                setTimeout(function() {
                    songlist.push(message.embeds[0].title);
                }, 1000);
            }

            if(noSong == 0)
            {
                anchortime = bot.uptime;
                if(bot.voiceConnections.last() == null || bot.voiceConnections.last().speaking === 0)
                {
                    setTimeout(function() {
                        playlist.push(song);
                        channel.join()
                        .then(connection => {
                            console.log('Connected!')
                            var stream = ytdl(song, {filter : 'audioonly'});
                            dispatcher = connection.playStream(stream, streamOptions);
                        })
                        .catch(console.error);
                        index++;

                        message.channel.send('No songs in queue, playing **' + songlist[songlist.length-1] + '**');
                        bot.user.setGame(songlist[songlist.length-1]);

                        var p = message.delete();
                        p.catch(() => {}); // add an empty catch handler
                        return p;
                    }, 1000);
                }
                else
                {
                    setTimeout(function() {
                        playlist.push(song);

                        message.channel.send('Queued **' + songlist[songlist.length-1] + '**');

                        var p = message.delete();
                        p.catch(() => {}); // add an empty catch handler
                        return p;
                    }, 1000);
                }
            }
        }
        else
        {
            message.channel.send('Queueing songs disabled in radio mode');
            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if(message.content === '!radio' && message.member.voiceChannel != null && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        if(!playingRadio)
        {
            message.channel.send('Enabled radio mode. Most music commands will be disabled.');
            playingRadio = true;
            var channel = message.member.voiceChannel;
            nextRadio(channel);
            console.log('Enabled Radio');
        }
        else
        {
            message.channel.send('Disabled radio mode');
            playingRadio = false;
            console.log('Disabled Radio');
        }
        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if(message.content === '!dislike' && message.member.voiceChannel != null && playingRadio && message.member.id == chris)
    {
        pandora.login(function(err) {
            if (err) throw err;
            pandora.request("station.addFeedback", {"stationToken": station.stationToken, "trackToken": track.trackToken, "isPositive": false}, function(err, result) {
                if (err) throw err;
                console.log(result);
                //console.log(track.trackToken)
                console.log('Disliked ' + track.songName);
            });
        });

        message.channel.send('Disliked ' + track.songName);
        nextRadio(message.member.voiceChannel);

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if (message.content === '!next' && message.member.voiceChannel != null && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        if(!playingRadio)
        {
            if (playlist[index] != null)
            {
                anchortime = bot.uptime;
                var channel = message.member.voiceChannel;
                song = playlist[index];

                dispatcher.end('next');

                setTimeout(function() {
                    channel.join()
                    .then(connection => {
                        console.log('Connected!')
                        var stream = ytdl(song, {filter : 'audioonly'});
                        dispatcher = connection.playStream(stream, streamOptions);
                    })
                    .catch(console.error);
                }, 5);

                index++;

                setTimeout(function() {
                    message.channel.send('Playing next song: **' + songlist[index-1] + '**');
                    bot.user.setGame(songlist[index-1]);

                    var p = message.delete();
                    p.catch(() => {}); // add an empty catch handler
                    return p;
                }, 1000);
            }
            else
            {
                message.channel.send('No following song!');
                var p = message.delete();
                p.catch(() => {}); // add an empty catch handler
                return p;
            }
        }
        else
        {
            nextRadio(message.member.voiceChannel);
            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if (message.content === '!prev' && message.member.voiceChannel != null && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        if(!playingRadio)
        {
            if (playlist[index-2] != null)
            {
                anchortime = bot.uptime;
                var channel = message.member.voiceChannel;
                song = playlist[index-2];

                dispatcher.end('prev');

                setTimeout(function() {
                    channel.join()
                    .then(connection => {
                        console.log('Connected!')
                        var stream = ytdl(song, {filter : 'audioonly'});
                        dispatcher = connection.playStream(stream, streamOptions);
                    })
                    .catch(console.error);
                }, 5);

                index = index - 1;

                setTimeout(function() {
                    message.channel.send('Playing previous song: **' + songlist[index-1] + '**');
                    bot.user.setGame(songlist[index-1]);

                    var p = message.delete();
                    p.catch(() => {}); // add an empty catch handler
                    return p;
                }, 1000);
            }
            else
            {
                message.channel.send('No previous song!');
                var p = message.delete();
                p.catch(() => {}); // add an empty catch handler
                return p;
            }
        }
        else
        {
            message.channel.send('Backwards navigation disabled in radio mode');
            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if (message.content === '!spacejam' && message.member.voiceChannel != null && playing != 'spacejam' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'spacejam';
        bot.user.setGame('Space Jam Remix');
        playlist.push('https://www.youtube.com/watch?v=qH4NbO74A1k');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!')
                var stream = ytdl('https://www.youtube.com/watch?v=qH4NbO74A1k', {filter : 'audioonly'});
                dispatcher = connection.playStream(stream, streamOptions);
            })
            .catch(console.error);
            index++;
        }, 5);
    }

    if (message.content === '!dingdingdong' && message.member.voiceChannel != null && playing != 'dingdingdong' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'dingdingdong';
        bot.user.setGame('You Touch My Tralala');
        playlist.push('https://www.youtube.com/watch?v=z13qnzUQwuI');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!')
                var stream = ytdl('https://www.youtube.com/watch?v=z13qnzUQwuI', {filter : 'audioonly'});
                dispatcher = connection.playStream(stream, streamOptions);
            })
            atch(console.error);
            index++;
        }, 5);
    }

    if (message.content === '!himehime' && message.member.voiceChannel != null && playing != 'himehime' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'himehime';
        bot.user.setGame('Hime Hime');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!')
                dispatcher = connection.playFile(__dirname + '/../himehime.m4a', {seek: 0, volume: vol/50, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if (message.content === '!jack' && message.member.voiceChannel != null && playing != 'jack' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'jack';
        bot.user.setGame('jack');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!');
                dispatcher = connection.playFile(__dirname + '/../jack.mp3', {seek: 0, volume: 4, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if (message.content === '!emile' && message.member.voiceChannel != null && playing != 'emile' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'emile';
        bot.user.setGame('emile');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!');
                dispatcher = connection.playFile(__dirname + '/../emile.mp3', {seek: 0, volume: .5, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if (message.content === '!jdonn' && message.member.voiceChannel != null && playing != 'jdonn' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'jdonn';
        bot.user.setGame('jdonn');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!');
                dispatcher = connection.playFile(__dirname + '/../jdonn.mp3', {seek: 0, volume: .5, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if (message.content === '!o_o' && message.member.voiceChannel != null && playing != 'o_o' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'o_o';
        bot.user.setGame('o_o');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!');
                dispatcher = connection.playFile(__dirname + '/../o_o.mp3', {seek: 0, volume: 1, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if (message.content === '!godaddy' && message.member.voiceChannel != null && playing != 'godaddy' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'godaddy';
        bot.user.setGame('go daddy');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!');
                dispatcher = connection.playFile(__dirname + '/../godaddy.mp3', {seek: 0, volume: 1, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if (message.content === '!hohoho' && message.member.voiceChannel != null && playing != 'hohoho' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'hohoho';
        bot.user.setGame('hohoho');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!');
                dispatcher = connection.playFile(__dirname + '/../hohoho.mp3', {seek: 0, volume: 1, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if (message.content === '!stan' && message.member.voiceChannel != null && playing != 'stan' && !playingRadio && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        anchortime = bot.uptime;
        var channel = message.member.voiceChannel;
        playing = 'stan';
        bot.user.setGame('stan');

        setTimeout(function() {
            channel.join()
            .then(connection => {
                console.log('Connected!');
                dispatcher = connection.playFile(__dirname + '/../stan.mp3', {seek: 0, volume: 1, passes: 1});
            })
            .catch(console.error);
        }, 5);
    }

    if(message.content === '!resume' && !bot.speaking && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        dispatcher.resume();
        paused = false;
        message.channel.send('Resuming');
        bot.user.setGame(wasPlaying);

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if(message.content === '!pause' && bot.voiceConnections.last() != null && bot.voiceConnections.last().channel === message.member.voiceChannel && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        dispatcher.pause();
        paused = true;
        playing = 0;

        message.channel.send('Paused');
        wasPlaying = bot.user.presence.game;
        bot.user.setGame(null);

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if(message.content === '!stop' && bot.voiceConnections.last() != null && bot.voiceConnections.exists('channel', message.member.voiceChannel) && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        message.member.voiceChannel.leave();
        bot.user.setGame(null);
        playing = '0';

        if(playingRadio)
        {
            message.channel.send('Stopped playback and disabled radio mode');
            playingRadio = false;
        }
        else
        {message.channel.send('Stopped playback');}

        setTimeout(function() {
            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }, 1000);
    }

    if(message.content === '!clear' && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        playlist = [];
        songlist = [];
        index = 0;

        message.channel.send('Cleared queue');

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if((message.content === '!volume' || message.content === '!vol') && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        message.channel.send('Volume is currently **' + vol*100 + "**");

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if((message.content.includes('!volume ' ) || message.content.includes('!vol ')) && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        if(message.content.includes('!volume '))
        {
            if(message.content.substring(8) === 'up')
            {vol = vol*1.5;}
            else if (message.content.substring(8) === 'down')
            {vol = vol*.67;}
            else if (isNumeric(message.content.substring(8)))
            {vol = message.content.substring(8)/100;}
        }

        if(message.content.includes('!vol '))
        {
            if(message.content.substring(5) === 'up')
            {vol = vol*1.5;}
            else if (message.content.substring(5) === 'down')
            {vol = vol*.67;}
            else if (isNumeric(message.content.substring(5)))
            {vol = message.content.substring(5)/100;}
        }

        if(!playingRadio)
        {
            message.channel.send('Volume is now **' + vol*100 + "**");

            if(bot.voiceConnections.last() != null)
            {
                resumeTime = resumeTime + dispatcher.time;
                console.log(resumeTime);
                dispatcher.end('volume changed to ' + vol*100);
                anchortime = bot.uptime;

                var channel = message.member.voiceChannel;
                song = playlist[index-1];

                setTimeout(function() {
                    channel.join()
                    .then(connection => {
                        console.log('Connected!');
                        var stream = ytdl(song, {filter : 'audioonly'});
                        dispatcher = connection.playStream(stream, { seek: resumeTime/1000, volume: vol/50 });
                    })
                    .catch(console.error);
                }, 100);
            }
        }
        else
        {message.channel.send('Volume is now **' + vol*100 + "**. Effects take place next song in radio mode.");}

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if(message.content === '!blacklist' && !userblacklist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        var blacklistString = ''
        for(var i = 0; i < userblacklist.length; i++)
        {
            blacklistString = blacklistString.concat('**' + userblacklist[i] + '**')
            if(i+1 < userblacklist.length)
            {blacklistString = blacklistString.concat(', ')}
        }

        message.channel.send('Blacklisted users: ' + blacklistString);

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if(message.content.includes('!blacklist ') && blacklistWhitelist.includes(message.member.displayName) && message.guild.id == matinche)
    {
        /*var searchName = message.content.substring(11);
        console.log(bot.guilds.get(matinche).members);
        user = bot.guilds.get(matinche).members.find(checkName);
        fs.appendFile(__dirname + '/../data/blacklist.csv', ',' + user.id, function(err){
            if (err) throw err;
        });

        csv.parseCSV(__dirname + '/../data/whitelist.csv', function(data){
            //console.log(JSON.stringify(data));
            blacklistWhitelist = JSON.stringify(data);
        }, false);*/

        var user = message.content.substring(11);
        userblacklist.push(user);

        message.channel.send('Blacklisted **' + user + "**");

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if(message.content.includes('!unblacklist ') && blacklistWhitelist.includes(message.member.displayName) && message.content.substring(13) != 'anti-flake enforcer' && message.guild.id == matinche)
    {
        var user = message.content.substring(13);
        var userindex = userblacklist.indexOf(user.id)

        if (userindex != -1)
        {userblacklist.splice(userindex, 1);}

        /*fs.writeFile(__dirname + '/../data/blacklist.csv', blacklist, function(err){
            if (err) throw err;
        });*/

        message.channel.send('Unblacklisted **' + user + "**");

        var p = message.delete();
        p.catch(() => {}); // add an empty catch handler
        return p;
    }

    if(message.content === '!save' && playingRadio && message.author.id == chris && message.guild.id == matinche)
    {
        download(track.additionalAudioUrl, __dirname + '/../saved', {filename: track.songName +'.mp3'}).then(() => {
                    console.log('Saved ' + track.songName);
        });
        message.channel.send('Saved copy of **' + track.songName + '** to folder')
    }

    if(message.content.includes('!delete ') && message.author.id == chris && message.guild.id == matinche)
    {
        if(isNumeric(message.content.substring(8)))
        {
            deleteNumber = 1 + parseInt(message.content.substring(8));
            if(deleteNumber > deleteThreshold)
            {
                message.channel.send('Confirm deletion of **' + parseInt(deleteNumber - 1) + '** messages? (Y/N)');
                deleting = true;
            }
            else
            {message.channel.bulkDelete(deleteNumber);}
        }
        else
        {
            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if(message.author.id == chris && deleting == true && message.guild.id == matinche)
    {
        if(message.content === 'Y' || message.content === 'y')
        {
            message.channel.bulkDelete(deleteNumber + 2);
            deleting = false;
        }
        if(message.content === 'N' || message.content === 'n')
        {
            message.channel.bulkDelete(3);
            deleting = false;
        }
    }

    if(message.content === '!text' && message.author.id == chris)
    {
        if(message.channel.type == 'dm')
        {
            bot.channels.get(xd).send('B A S I C   T E X T   R E C O G N I T I O N')
        }
        else
        {
            message.channel.send('B A S I C   T E X T   R E C O G N I T I O N');

            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if(message.content.includes('!say ') && message.author.id == chris)
    {
        if(message.channel.type == 'dm')
        {
            bot.channels.get(xd).send(message.content.substring(5));
        }
        else
        {
            message.channel.send(message.content.substring(5));
            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if(message.content.includes('!space ') && message.author.id == chris)
    {
        var tempstring = message.content.substring(7);
        var tempstring2 = '';

        for (i = 0; i < tempstring.length - 1; i++)
        {
            tempstring2 = tempstring2 + tempstring.substring(i,i+1) + ' ';
        }
        tempstring2 = tempstring2 + tempstring.substring(tempstring.length-1);
        tempstring2 = tempstring2.toUpperCase();

        if(message.channel.type == 'dm')
        {
            bot.channels.get(xd).send(tempstring2);
        }
        else
        {
            message.channel.send(tempstring2);

            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    if(message.content.includes('!mock ') && message.author.id == chris)
    {
        var tempstring = message.content.substring(6);
        var tempstring2 = '';
        var capital = false;

        for (i = 0; i < tempstring.length; i++)
        {
            if(tempstring.substring(i,i+1) == ' ')
            {
                tempstring2 = tempstring2 + tempstring.substring(i,i+1);
                capital = false;
            }
            else if(capital)
            {
                tempstring2 = tempstring2 + tempstring.substring(i,i+1).toUpperCase();
                capital = false;
            }
            else
            {
                tempstring2 = tempstring2 + tempstring.substring(i,i+1).toLowerCase();
                capital = true;
            }
        }

        if(message.channel.type == 'dm')
        {
            bot.channels.get(xd).send(tempstring2);
        }
        else
        {
            message.channel.send(tempstring2);

            var p = message.delete();
            p.catch(() => {}); // add an empty catch handler
            return p;
        }
    }

    /*if(message.author.id == emile && message.content.includes('@'))
    {
        if(message.content.includes('@everyone') || Math.random()*100 < emileDeleteChance)
        {
            setTimeout(function() {
                var p = message.delete();
                p.catch(() => {}); // add an empty catch handler
                return p;
            }, 10000);
        }
    }*/

    if(message.content.includes("!pull ") && message.member.voiceChannel != null && message.author.id == chris)
    {
        var user = message.content.substring(6);
        var guild = bot.guilds.get(matinche)
        if(guild.members.get(eval(user)).voiceChannel != guild.members.get(chris).voiceChannel)
        {
            guild.members.get(eval(user)).setVoiceChannel(guild.members.get(chris).voiceChannel)
        }
        
    }

    if(message.content.includes("!push ") && message.member.voiceChannel != null && message.author.id == chris)
    {
        var user = message.content.substring(6);
        var guild = bot.guilds.get(matinche);

        if(guild.members.get(eval(user)).voiceChannel == guild.members.get(chris).voiceChannel)
        {
            if(guild.members.get(eval(user)).voiceChannel.name == "graviton surge")
            {
                guild.members.get(eval(user)).setVoiceChannel(ownly);
            }
            else
            {
                guild.members.get(eval(user)).setVoiceChannel(sammyslincrofts);
            }
            
        }
        
    }
});
