import { EventEmitter } from "events"
import DeviceSimulator from "./DeviceSimulator"
import RaceDirector from "./RaceDirector"

type DeviceID = {
    id: string;
}

class OuroborosRace {

    constructor(raceInformation, raceDirector: RaceDirector, eventEmiter: EventEmitter) {

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
            const connectPromises = []
            raceInformation.tracks.forEach(track => {
                devices.push(new DeviceSimulator(track.track, raceInformation.id, track.id, track.type, {
                    competitor_name: track.competitor_name,
                    competitor_sail_number: track.competitor_sail_number
                }, raceDirector, eventEmiter))
            })
            // Wait for all websocket connections to be ready before sending data.
            Promise.all(connectPromises).then(() => {
                console.log('all devices setup')
                devices.forEach(device => {
                    device.waitAndPing(0, 0);
                })
            });
        })
    }
}

export default OuroborosRace;