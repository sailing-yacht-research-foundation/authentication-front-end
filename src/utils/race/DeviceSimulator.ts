import { EventEmitter } from "events";
import RaceDirector from "./RaceDirector";

class DeviceSimulator {
    private track;
    private raceId;
    private deviceId;
    private raceDirector: RaceDirector;
    private eventEmitter: EventEmitter;
    private type;
    private playerData;
    private color;

    constructor(track, raceId, deviceId, type, playerData, raceDirector, eventEmitter) {
        this.track = track
        this.raceId = raceId
        this.deviceId = deviceId
        this.raceDirector = raceDirector;
        this.eventEmitter = eventEmitter;
        this.type = type;
        this.playerData = playerData;
        this.color = stringToColour(deviceId);
    }

    waitAndPing(index, elapsedTime) {
        if (index == this.track.length - 1) {
            console.log('Device Finished: ' + this.deviceId)
            return
        }

        let trackPoint = this.track[index]
        let message = {
            type: 'ping',
            id: this.raceId,
            deviceId: this.deviceId,
            pointId: trackPoint[2],
            deviceType: this.type,
            content: {
                lon: trackPoint[0],
                lat: trackPoint[1],
                time: trackPoint[3]
            },
            playerData: this.playerData,
            color: this.color ? this.color : 'white'
        }

        setTimeout(() => {
            this.ping(message, trackPoint[2])
            this.waitAndPing(++index, trackPoint[3])
        }, (trackPoint[3] - elapsedTime))

    }

    ping(message, messageId) {
        message.sentTime = (new Date()).getTime()
        message.messageId = messageId
        this.raceDirector.onPingMessage(message);
        this.eventEmitter.emit('ping', JSON.stringify(message));
    }
}

var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
  

export default DeviceSimulator;