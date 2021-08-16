import { EventEmitter } from "events";

const turf = require('@turf/turf');

const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

const messageType = {
    ping: 'ping',
    consumer: 'consumer',
    setup: 'setup'
}

type Distance = {
    course_element: any;
    distance: any;
}

type CourseGeometry = {
    type: string;
    properties: any;
    geometry: any;
}

export default class RaceDirector {
    private eventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    // TODO: average points in time windows for boat devices.
    // TODO: handle updates and re-sorting.
    // TODO: "Framify"
    // TODO: Update boat stats when course stats come in.
    /**
     * Boats have 
     * - distance sailed
     * - course distance sailed
     * - distance sailed w/o current
     * - course distance sailed w/o current
     * 
     * 
     */

    // inputs and outputs.
    private raceIdToConsumers = {}

    // data model
    private raceIdToCourse = {}
    //const raceIdToLegs = {}
    private raceIdToBoatTracks = {}
    private raceIdToCoursePoints = {}
    private raceIdToDeviceLegs = {}
    private raceIdToTrackInteractions = {}
    private raceIdToStartTimes = {}


    // add polygons
    // add timing windows
    // better leg graph treatment
    // average multiple inputs per boat
    // better legs (current leg vs next leg)
    // pcs scoring (polars, wind, etc)
    // mark roundings
    // laylines

    setUpRace(message) {
        message = JSON.parse(message);
        this.raceIdToStartTimes[message.id] = message.startTime
        this.raceIdToCourse[message.id] = message.course
        this.raceIdToBoatTracks[message.id] = {}
        this.raceIdToCoursePoints[message.id] = {}
        let pointsToGeometry = {}
        this.raceIdToDeviceLegs[message.id] = {}
        message.devices.forEach(deviceId => {
            this.raceIdToDeviceLegs[message.id][deviceId] = { 'legs': {}, 'currentLegId': '' }
        })
        message.course.sequenced.forEach(part => {
            let lastKnownLats = {}
            let lastKnownLons = {}
            let lastKnownTimes = {}
            part.uuid = uuidv4()
            part.lastKnownLats = lastKnownLats
            part.lastKnownLons = lastKnownLons
            part.lastKnownTimes = lastKnownTimes
            part.points.forEach(point => {
                if (pointsToGeometry[point] === null || pointsToGeometry[point] === undefined) {
                    pointsToGeometry[point] = [part]
                } else {
                    pointsToGeometry[point].push(part)
                }
            })

            Object.keys(this.raceIdToDeviceLegs[message.id]).forEach(device => {
                this.raceIdToDeviceLegs[message.id][device]['legs'][part.uuid] = { startTime: 0, stopTime: 0, averageCourseTWA: 0, legDistance: 0 }
            })
        })
        this.raceIdToCoursePoints[message.id] = pointsToGeometry
    }

    onPingMessage(message) {
        message.recievedTime = (new Date()).getTime();
        if (this.raceIdToCoursePoints[message.id][message.deviceId] !== null && this.raceIdToCoursePoints[message.id][message.deviceId] !== undefined) {
            // course object
            if ((message.receievedTime <= this.raceIdToStartTimes[message.id] - 15000) || (message.receievedTime >= this.raceIdToStartTimes[message.id] + 5000)) {

            }
            this.raceIdToCoursePoints[message.id][message.deviceId].forEach(part => {
                part.lastKnownLats[message.deviceId] = message.content.lat
                part.lastKnownLons[message.deviceId] = message.content.lon
                part.lastKnownTimes[message.deviceId] = message.content.time
                if (Object.keys(part.lastKnownLats).length === part.points.length) {
                    part.hasFirstPosition = true
                }
            })

            //update course legs
            //console.log(JSON.stringify(raceIdToCourse[message.id]))
            const legs: any[] = []
            const leg_geometry: CourseGeometry[] = [];
            for (let courseIndexString in this.raceIdToCourse[message.id].sequenced) {
                let courseIndex = Number(courseIndexString);
                if (courseIndex <= this.raceIdToCourse[message.id].sequenced.length - 2) {

                    const part1 = this.raceIdToCourse[message.id].sequenced[courseIndex]
                    const part2 = this.raceIdToCourse[message.id].sequenced[courseIndex + 1]

                    if (part1.hasFirstPosition && part2.hasFirstPosition) {
                        var part1Point = {}
                        var part2Point = {}

                        if (part1.geometry_type === 'point') {
                            part1Point = turf.point([part1.lastKnownLons[part1.points[0]], part1.lastKnownLats[part1.points[0]]]);
                            part1.geometry = part1Point

                        } else {
                            var first = turf.point([part1.lastKnownLons[part1.points[0]], part1.lastKnownLats[part1.points[0]]]);
                            var second = turf.point([part1.lastKnownLons[part1.points[1]], part1.lastKnownLats[part1.points[1]]]);
                            part1.geometry = turf.greatCircle(first, second)
                            part1Point = turf.midpoint(first, second);
                        }
                        if (part2.geometry_type === 'point') {
                            part2Point = turf.point([part2.lastKnownLons[part2.points[0]], part2.lastKnownLats[part2.points[0]]]);
                            if (courseIndex + 1 == this.raceIdToCourse[message.id].sequenced.length - 1) {
                                part2.geometry = part2Point
                            }
                        } else {
                            var first = turf.point([part2.lastKnownLons[part2.points[0]], part2.lastKnownLats[part2.points[0]]]);
                            var second = turf.point([part2.lastKnownLons[part2.points[1]], part2.lastKnownLats[part2.points[1]]]);

                            if (courseIndex + 1 == this.raceIdToCourse[message.id].sequenced.length - 1) {
                                part2.geometry = turf.greatCircle(first, second)
                            }
                            part2Point = turf.midpoint(first, second);
                        }

                        // TODO - put these in a better structure, use legs to calculate distance/speed
                        let leg = turf.greatCircle(part1Point, part2Point)

                        legs.push(leg)

                    }
                }
            }

            for (let courseIndex in this.raceIdToCourse[message.id].sequenced) {
                let course: any = this.raceIdToCourse[message.id].sequenced[courseIndex]
                if (course.geometry !== null && course.geometry !== undefined) {
                    leg_geometry.push(course.geometry)
                }
            }

            // The course is "frozen" 15 seconds before start up to 5 seconds after start.
            if ((message.receievedTime <= this.raceIdToStartTimes[message.id] - 15000) || (message.receievedTime >= this.raceIdToStartTimes[message.id] + 5000)) {
                // this.raceIdToConsumers[message.id].forEach(consumer => {
                // consumer.send(JSON.stringify({ type: 'leg-update', leg: legs }))
                // consumer.send(JSON.stringify({ type: 'geometry', geometry: leg_geometry }))
                // fs.writeFileSync('pingfiles/legs.geojson', JSON.stringify(turf.featureCollection(legs)))
                // fs.writeFileSync('pingfiles/leggeometry.geojson', JSON.stringify(turf.featureCollection(leg_geometry)))
                // })
            }


        } else {
            // boat object
            var point = turf.point([message.content.lon, message.content.lat]);
            if (this.raceIdToBoatTracks[message.id][message.deviceId] === null || this.raceIdToBoatTracks[message.id][message.deviceId] === undefined) {
                this.raceIdToBoatTracks[message.id][message.deviceId] = []
            }

            this.raceIdToBoatTracks[message.id][message.deviceId] = message.content.previousLatLong;
            var track = null
            if (this.raceIdToBoatTracks[message.id][message.deviceId].length > 1) {
                track = turf.lineString(this.raceIdToBoatTracks[message.id][message.deviceId])
            }

            if (this.raceIdToTrackInteractions[message.id] === null || this.raceIdToTrackInteractions[message.id] === undefined) {
                this.raceIdToTrackInteractions[message.id] = {}
            }
            if (this.raceIdToTrackInteractions[message.id][message.deviceId] === null || this.raceIdToTrackInteractions[message.id][message.deviceId] === undefined) {
                this.raceIdToTrackInteractions[message.id][message.deviceId] = []
            }

            if (track !== null) {
                var options = { mutate: false, highQuality: true, tolerance: 0.00005 };

                var simplified = turf.simplify(track, options);

                message.simplified = simplified

            }

            const distances: Distance[] = [];
            for (let courseIndex in this.raceIdToCourse[message.id].sequenced) {
                var course = this.raceIdToCourse[message.id].sequenced[courseIndex]
                if (course.geometry !== null && course.geometry !== undefined) {

                    if (course.geometry_type === 'point') {

                        distances.push({ course_element: course, distance: turf.distance(point, course.geometry) });
                    } else {

                        if (track !== null && !this.raceIdToTrackInteractions[message.id][message.deviceId].includes(course.uuid)) {

                            if (turf.lineIntersect(track, course.geometry).features.length > 0) {
                                this.raceIdToTrackInteractions[message.id][message.deviceId].push(course.uuid)
                                console.log('Boat crossed line!');
                            }

                            // var options = { mutate: false, highQuality: true, tolerance: 0.00005 };

                            // var simplified = turf.simplify(track, options);

                            // message.simplified = simplified

                        }
                        distances.push({ course_element: course, distance: turf.pointToLineDistance(point, course.geometry) });
                    }
                }
            }
            // console.log(distances)
            // this.raceIdToConsumers[message.id].forEach(consumer => {

            //     consumer.send(JSON.stringify({ type: 'distance', distances: distances }))
            //     message.replyTime = (new Date()).getTime()

            //     consumer.send(JSON.stringify(message))
            // })

        }
    }
}