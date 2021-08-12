import { EventEmitter } from "events"
import DeviceSimulator from "./DeviceSimulator"
import RaceDirector from "./RaceDirector"

type DeviceID = {
    id: string;
}

class OuroborosRace {
    private devices: DeviceSimulator[];
    constructor(raceInformation, raceDirector: RaceDirector, eventEmiter: EventEmitter) {
        this.devices = [];
        new Promise(function (resolve, reject) {
            let deviceIds: DeviceID[] = []
            raceInformation.tracks.forEach(track => {
                deviceIds.push(track.id)
            })
            const startTime = 2000;
            raceDirector.setUpRace(JSON.stringify({ type: 'setup', id: raceInformation.id, course: raceInformation.course, devices: deviceIds, startTime: startTime }))
            resolve('')
        }).then(() => {
            const devices: DeviceSimulator[] = []
            raceInformation.tracks.forEach(track => {
                devices.push(new DeviceSimulator(track.track, raceInformation.id, track.id, track.type, {
                    competitor_name: track.competitor_name,
                    competitor_sail_number: track.competitor_sail_number
                }, raceDirector, eventEmiter))
            })
            // Wait for all websocket connections to be ready before sending data.
            devices.forEach(device => {
                device.waitAndPing(0, 0);
            });
            this.devices = devices;
        })
    }

    pingDevicesAtTime(pingIndex, elapsedTime) {
        this.devices.forEach(device => {
            device.waitAndPing(pingIndex, elapsedTime);
        });
    }

    pauseUnpauseAllPing() {
        this.devices.forEach(device => {
            device.pauseUnpausePing();
        })
    }

    backward(milliseconds) {
        this.devices.forEach(device => {
            device.backward(milliseconds);
        });
    }

    forward(milliseconds) {
        this.devices.forEach(device => {
            device.forward(milliseconds);
        });
    }

    playAt(milliseconds) {
        this.devices.forEach(device => {
            device.pingAtTime(milliseconds);
        });
    }
}

export default OuroborosRace;