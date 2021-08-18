import { EventEmitter } from "events";
import DeviceSimulator from "./DeviceSimulator";
import { getLastTrackPingTime } from "./race-helper";
import RaceDirector from "./RaceDirector";

type DeviceID = {
    id: string;
}
class OuroborosRace {
    private devices: DeviceSimulator[];
    private raceLength: number = 0;
    private isPlaying = false;

    constructor(raceInformation, raceDirector: RaceDirector, eventEmiter: EventEmitter) {
        this.devices = [];
        this.raceLength = getLastTrackPingTime(raceInformation.tracks);

        new Promise(function (resolve, reject) {
            let deviceIds: DeviceID[] = []
            raceInformation.tracks.forEach(track => {
                deviceIds.push(track.id);
            })
            const startTime = 2000;
            raceDirector.setUpRace(JSON.stringify({ type: 'setup', id: raceInformation.id, course: raceInformation.course, devices: deviceIds, startTime: startTime }));
            resolve('');
        }).then(() => {
            const devices: DeviceSimulator[] = []
            raceInformation.tracks.forEach(track => {
                devices.push(new DeviceSimulator(track.track, raceInformation.id, track.id, track.type, {
                    competitor_name: track.competitor_name,
                    competitor_sail_number: track.competitor_sail_number
                }, raceDirector, eventEmiter))
            })
            devices.forEach(device => {
                device.waitAndPing(0, 0);
            });
            this.devices = devices;
            this.isPlaying = true;
        })
    }

    pauseUnpauseAllPing(elapsedTime) {
        this.setIsPlaying(!this.isPlaying);

        if (!this.isPlaying) {
            this.devices.forEach(device => {
                device.stop();
            })
        } else {
            if (elapsedTime >= this.raceLength) {
                this.setIsPlaying(false);
                return;
            }

            this.devices.forEach(device => {
                device.play();
            })
        }
    }

    backward(milliseconds) {
        this.setIsPlaying(true);

        if (milliseconds < 0) milliseconds = 0;

        this.devices.forEach(device => {
            device.backward(milliseconds);
        });
    }

    forward(milliseconds) {
        this.setIsPlaying(true);

        if (milliseconds > this.raceLength)
            milliseconds = this.raceLength;

        this.devices.forEach(device => {
            device.forward(milliseconds);

            if (milliseconds >= this.raceLength)
                device.stop();
        });
    }

    playAt(milliseconds) {
        this.setIsPlaying(true);

        this.devices.forEach(device => {
            device.pingAtTime(milliseconds);
        });
    }

    setIsPlaying(status: boolean) {
        this.isPlaying = status;
    }

    getIsPlaying() {
        return this.isPlaying;
    }
}

export default OuroborosRace;