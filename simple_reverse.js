// Generated by CoffeeScript 1.9.2

(function() {
    this.channels = [];
    this.groups = [];
    this.getUsername;
    var self = this;
  var Slack, autoMark, autoReconnect, slack, token;

  Slack = require('./');

  token = 'xoxb-4625310637-ovmImgs4DMMhSyPxPzJikASY';

  autoReconnect = true;

  autoMark = true;

  slack = new Slack(token, autoReconnect, autoMark);
  this.sData = slack;
  slack.on('open', function() {
    var channel, channels, group, groups, id, messages, unreads;
    channels = [];
    groups = [];
    unreads = slack.getUnreadCount();
    channels = (function() {
      var ref, results;
      ref = slack.channels;
      results = [];
      for (id in ref) {
        channel = ref[id];
        if (channel.is_member) {
          results.push("#" + channel.name);
        }
      }

      return results;
    })();
    groups = (function() {
      var ref, results;
      ref = slack.groups;
      results = [];
      for (id in ref) {
        group = ref[id];
        if (group.is_open && !group.is_archived) {
          results.push(group.name);
        }
      }

      return results;
    })();
    console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name);
    console.log('You are in: ' + channels.join(', '));
    console.log('As well as: ' + groups.join(', '));
    console.log(groups);
      self.channels = channels;
      self.groups = groups;
    messages = unreads === 1 ? 'message' : 'messages';
    return console.log("You have " + unreads + " unread " + messages);
  });
    //slack.groups.leave('G04F4T40L');
  console.log(slack.groups);
  slack.on('message', function(message) {
    var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID(message.channel);
    user = slack.getUserByID(message.user);
    response = '';
    type = message.type, ts = message.ts, text = message.text;
    channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
    userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
    console.log("Received: " + type + " " + channelName + " " + userName + " " + ts + " \"" + text + "\"");
    if (type === 'message' && (text !== null || text !== 'undefined') && (channel != null)){
        var textArr = text.split(' ');
        var prefix,command;
        if (textArr.length >= 2){
            prefix = textArr.shift().toLowerCase();
            command = textArr.shift().toLowerCase();
        }
        var commands = {'help': 'Send "sb help" to get a list of commands. help does not take any parameters',
            'mergesort': '"sb mergesort _Numbers_" every number should be separated by single whitespace',
            'reverse': '"sb reverse _String_" every string you want to reverse should be separated by whitespace. Example: "sb reverse Hello 3 2 1" will return 1 2 3 Hello'};
        var response = '';
        if (prefix !== 'sb')
            return;
        if (prefix.toLowerCase() === 'sb'){
            if (command.toLowerCase() === 'help') {
                response = 'Send the bot a command in the following format: \n ' +
                    'sb *commandName* _parameter_ \n ';
                for (var key in commands)
                    response += "*"+key+"*" + "     \t" + commands[key] + "\n ";
                channel.send(response);
                console.log(response);
            }
            if(command === 'mergesort')
                channel.send(mergeSort(textArr).join(' '));
            if(command === 'reverse')
                channel.send(textArr.reverse().join(' '));
            if(command === 'bootbot')
                return channel.close();
            if(command === 'test') {
                console.log('testing');
            }
            else{}
                //channel.send(command + " is an unknown command.");
        }


    }
    else if (type === 'message' && (text != null) && (channel != null)) {
      response = text.split(' ');
        response = mergeSort(response).join(' ');
      channel.send(response);
      return console.log("@" + slack.self.name + " responded with \"" + response + "\"");
    } else {
      typeError = type !== 'message' ? "unexpected type " + type + "." : null;
      textError = text == null ? 'text was undefined.' : null;
      channelError = channel == null ? 'channel was undefined.' : null;
      errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      return console.log("@" + slack.self.name + " could not respond. " + errors);
    }
  });

  slack.on('error', function(error) {
    return console.error("Error: " + error);
  });

  slack.login();

}).call(this);

//merge sort

function merge(firstHalf, secondHalf) {
    // comparing first index of both halves
    var fhIndex = 0;
    var shIndex = 0;
    var result = [];

    while (fhIndex < firstHalf.length && shIndex < secondHalf.length) {
        if (Number(firstHalf[fhIndex]) < Number(secondHalf[shIndex])) {
            result.push(firstHalf[fhIndex]);
            fhIndex++;
        } else {
            result.push(secondHalf[shIndex]);
            shIndex++;
        }

    }

    if(fhIndex === firstHalf.length)
        while(shIndex < secondHalf.length)
            result = result.concat(secondHalf[shIndex++]);
    else if (shIndex === secondHalf.length)
        while(fhIndex < firstHalf.length)
            result = result.concat(firstHalf[fhIndex++]);
    else
        result = result.concat(firstHalf[fhIndex]).concat(secondHalf[shIndex])
    return result
}



function split(wholeArray) {

    /* your code here to define the firstHalf and secondHalf arrays */
    var half = Math.floor(wholeArray.length/2);
    var firstHalf = wholeArray.slice(0, half);
    var secondHalf = wholeArray.slice(half);

    return [firstHalf, secondHalf];
}

function mergeSort(array) {

    if (array.length <= 1) {
        return array;
    }

    var sortedLists = split(array);
    var firstHalf = mergeSort(sortedLists[0]);
    var secondHalf = mergeSort(sortedLists[1]);

    return merge(firstHalf, secondHalf);

}