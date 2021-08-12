import { EventEmitter } from "events";
import { stringToColour } from "utils/helpers";
import RaceDirector from "./RaceDirector";

class DeviceSimulator {
    private tracks;
    private raceId;
    private deviceId;
    private raceDirector: RaceDirector;
    private eventEmitter: EventEmitter;
    private type: string;
    private playerData;
    private color: string;
    private currentIndex: number;
    private elapsedTime: number;
    private pingTimeout;
    private pausePing: boolean;

    constructor(tracks, raceId, deviceId, type, playerData, raceDirector, eventEmitter) {
        this.tracks = tracks
        this.raceId = raceId
        this.deviceId = deviceId
        this.raceDirector = raceDirector;
        this.eventEmitter = eventEmitter;
        this.type = type;
        this.playerData = playerData;
        this.color = stringToColour(deviceId);
        this.currentIndex = 0;
        this.elapsedTime = 0;
        this.pingTimeout = null;
        this.pausePing = false;
    }

    waitAndPing(index, elapsedTime) {
        if (index == this.tracks.length - 1) {
            console.log('Device Finished: ' + this.deviceId)
            return
        }

        let trackPoint = this.tracks[index];
        let message: any = {
            type: 'ping',
            id: this.raceId,
            deviceId: this.deviceId,
            pointId: trackPoint[2],
            deviceType: this.type,
            content: {
                lon: trackPoint[0],
                lat: trackPoint[1],
                time: trackPoint[3],
                previousLatLong: []
            },
            playerData: this.playerData,
            color: this.color ? this.color : 'white'
        }

        for(let i = index; i > (index - 70); i--) {
            if (this.tracks[i] !== undefined) {
                message.content.previousLatLong.unshift([this.tracks[i][0], this.tracks[i][1]]);
            }   
        }

        this.pingTimeout = setTimeout(() => {
            this.currentIndex = index;
            this.elapsedTime = elapsedTime;

            this.ping(message, trackPoint[2]);
            this.waitAndPing(++index, trackPoint[3]);
        }, (trackPoint[3] - elapsedTime))

    }

    ping(message, messageId) {
        message.sentTime = (new Date()).getTime();
        message.messageId = messageId;
        this.raceDirector.onPingMessage(message);
        this.eventEmitter.emit('ping', JSON.stringify(message));
    }

    pauseUnpausePing() {
        this.pausePing = !this.pausePing;

        if (this.pausePing) {
            clearTimeout(this.pingTimeout);
        } else {
            this.waitAndPing(this.currentIndex, this.elapsedTime);
        }
    }

    backward(milliSeconds) {
        let minusElapsedTime = this.elapsedTime - milliSeconds;
        clearTimeout(this.pingTimeout);
        this.findTrackIndexByTimeAndPing(minusElapsedTime);
    }

    pingAtTime(seconds) {
        clearTimeout(this.pingTimeout);
        this.findTrackIndexByTimeAndPing(seconds);
    }

    forward(milliSeconds) {
        let plusElapsedTime = this.elapsedTime + milliSeconds;
        clearTimeout(this.pingTimeout);
        this.findTrackIndexByTimeAndPing(plusElapsedTime);
    }

    findTrackIndexByTimeAndPing(time) {
        let success = false;
        for (let [index, trackPoint] of this.tracks.entries()) {
            if (Number(trackPoint[3]) === time || Number(trackPoint[3]) === (time + 1000) || Number(trackPoint[3]) === (time - 1000)) {
                this.waitAndPing(index, trackPoint[3]);
                success = true;
                break;
            }
        }

        if (!success) {
            if (this.type == 'boat') console.log('error', this.deviceId, time);
            this.waitAndPing(0, 0);
        }
    }
}

export default DeviceSimulator;