import { EventEmitter } from "events";
import { stringToColour } from "utils/helpers";
import RaceDirector from "./RaceDirector";


const deviceType = {
    boat: 'boat',
    mark: 'mark'
}
class DeviceSimulator {
    private tracks: any;
    private raceId: string;
    private deviceId: string;
    private raceDirector: RaceDirector;
    private eventEmitter: EventEmitter;
    private type: string;
    private playerData: any;
    private color: string;
    private currentIndex: number;
    private elapsedTime: number;
    private pingTimeout: any;
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
        if (index === this.tracks.length - 1) {
            console.log('Device Finished: ' + this.deviceId);
            return;
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
            color: this.color ? this.color : '#ff0000'
        };

        for (let i = index; i > (index - 70); i--) {
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

    stop() {
        clearTimeout(this.pingTimeout);
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
        this._findTrackIndexByTimeAndPing(minusElapsedTime);
    }

    pingAtTime(seconds) {
        clearTimeout(this.pingTimeout);
        this._findTrackIndexByTimeAndPing(seconds);
    }

    forward(milliSeconds) {
        let plusElapsedTime = this.elapsedTime + milliSeconds;
        clearTimeout(this.pingTimeout);
        this._findTrackIndexByTimeAndPing(plusElapsedTime);
    }

    _getClosetTimeAndIndexBaseOnRaceTime(time) {
        let greatestTimeButSmallerThanInputTime = 0;
        let pingIndex = 0;

        for (let [index, trackPoint] of this.tracks.entries()) {
            if (trackPoint[3] > greatestTimeButSmallerThanInputTime && time > trackPoint[3]) {
                greatestTimeButSmallerThanInputTime = trackPoint[3];
                pingIndex = index;
            }

            if (trackPoint[3] >= time) {
                break;
            }
        }

        return [pingIndex, greatestTimeButSmallerThanInputTime];
    }

    _findTrackIndexByTimeAndPing(time) {
        let success = false;

        for (let [index, trackPoint] of this.tracks.entries()) {
            if (Number(trackPoint[3]) === time
                || Number(trackPoint[3]) === (time + 1000)
                || Number(trackPoint[3]) === (time - 1000)) {
                this.waitAndPing(index, trackPoint[3]);
                success = true;
                break;
            }
        }

        if (!success && this.type === deviceType.boat) {
            let [pingIndex, pingTime] = this._getClosetTimeAndIndexBaseOnRaceTime(time);
            this.waitAndPing(pingIndex, pingTime);
        }
    }
}

export default DeviceSimulator;