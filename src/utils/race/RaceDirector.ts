import { EventEmitter } from "events";

const turf = require('@turf/turf');

const {
    v4: uuidv4,
} = require('uuid');

type Distance = {
    course_element: any;
    distance: any;
}

type CourseGeometry = {
    type: string;
    properties: any;
    geometry: any;
}

const geometryType = {
    point: 'point',
    line: 'line'
}

export default class RaceDirector {
    private eventEmitter: EventEmitter;
    private course: any;
    private boatTracks: any;
    private cousePoints: any;
    private deviceLegs: any;
    private trackInteractions: any;
    private raceStartTime: any;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    setUpRace(message) {
        message = JSON.parse(message);
        this.raceStartTime = message.startTime;
        this.course = message.course;
        this.boatTracks = {};
        this.cousePoints = {};
        let pointsToGeometry = {};
        this.deviceLegs = {};
        message.devices.forEach(deviceId => {
            this.deviceLegs[deviceId] = { 'legs': {}, 'currentLegId': '' }
        });
        this._initCourseSequencedPartsAndPointsGeometry(message, pointsToGeometry);
        this.cousePoints = pointsToGeometry;
    }

    onPingMessage(message) {
        message.receievedTime = (new Date()).getTime();
        if (this.cousePoints[message.deviceId] !== null
            && this.cousePoints[message.deviceId] !== undefined) {
            this._setLocationForEachCoursePoint(message);

            //update course & legs
            const legs: any[] = []
            const courseGeometries: CourseGeometry[] = [];
            this._drawLegs(legs);
            this._initCouseGeometries(courseGeometries);
            this._sendCourseAndLegGeometryToConsumer(message, legs, courseGeometries);
        } else {
            let point = turf.point([message.content.lon, message.content.lat]);
            let track = null;
            const distances: Distance[] = [];
            this._setBoatTracksLongLatsPointsWhenPinging(message, track);
            this._handleLegEvents(message, distances, track, point);
        }
    }

    _initCourseSequencedPartsAndPointsGeometry(message, pointsToGeometry) {
        message.course.sequenced.forEach(part => {
            let lastKnownLats = {};
            let lastKnownLons = {};
            let lastKnownTimes = {};
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

            Object.keys(this.deviceLegs).forEach(device => {
                this.deviceLegs[device]['legs'][part.uuid] = { startTime: 0, stopTime: 0, averageCourseTWA: 0, legDistance: 0 }
            })
        })
    }

    _setLocationForEachCoursePoint(message) {
        this.cousePoints[message.deviceId].forEach(part => {
            part.lastKnownLats[message.deviceId] = message.content.lat;
            part.lastKnownLons[message.deviceId] = message.content.lon;
            part.lastKnownTimes[message.deviceId] = message.content.time;
            if (Object.keys(part.lastKnownLats).length === part.points.length) {
                part.hasFirstPosition = true;
            }
        })
    }

    _drawLegs(legs) {
        for (let courseIndexInString in this.course.sequenced) {
            let courseIndex = Number(courseIndexInString);
            if (courseIndex <= this.course.sequenced.length - 2) {
                const part1 = this.course.sequenced[courseIndex];
                const part2 = this.course.sequenced[courseIndex + 1];

                if (part1.hasFirstPosition && part2.hasFirstPosition) {
                    let part1Point = {};
                    let part2Point = {};

                    if (part1.geometry_type === geometryType.point) {
                        part1Point = turf.point([part1.lastKnownLons[part1.points[0]], part1.lastKnownLats[part1.points[0]]]);
                        part1.geometry = part1Point;
                    } else {
                        let first = turf.point([part1.lastKnownLons[part1.points[0]], part1.lastKnownLats[part1.points[0]]]);
                        let second = turf.point([part1.lastKnownLons[part1.points[1]], part1.lastKnownLats[part1.points[1]]]);

                        part1.geometry = turf.greatCircle(first, second);
                        part1Point = turf.midpoint(first, second);
                    }
                    if (part2.geometry_type === geometryType.point) {
                        part2Point = turf.point([part2.lastKnownLons[part2.points[0]], part2.lastKnownLats[part2.points[0]]]);
                        if ((courseIndex + 1) === (this.course.sequenced.length - 1)) {
                            part2.geometry = part2Point;
                        }
                    } else {
                        let first = turf.point([part2.lastKnownLons[part2.points[0]], part2.lastKnownLats[part2.points[0]]]);
                        let second = turf.point([part2.lastKnownLons[part2.points[1]], part2.lastKnownLats[part2.points[1]]]);

                        if ((courseIndex + 1) === (this.course.sequenced.length - 1)) {
                            part2.geometry = turf.greatCircle(first, second);
                        }
                        part2Point = turf.midpoint(first, second);
                    }

                    // TODO - put these in a better structure, use legs to calculate distance/speed
                    let leg = turf.greatCircle(part1Point, part2Point);
                    legs.push(leg);
                }
            }
        }
    }

    _initCouseGeometries(courseGeometries) {
        for (let courseIndex in this.course.sequenced) {
            let course: any = this.course.sequenced[courseIndex];
            if (course.geometry !== null && course.geometry !== undefined) {
                courseGeometries.push(course.geometry);
            }
        }
    }

    _sendCourseAndLegGeometryToConsumer(message, legs, courseGeometries) {
        // The course is "frozen" 15 seconds before start up to 5 seconds after start.
        if ((message.receievedTime <= this.raceStartTime - 15000)
            || (message.receievedTime >= this.raceStartTime + 5000)) {
            this.eventEmitter.emit('leg-update', JSON.stringify({ legs: legs }));
            this.eventEmitter.emit('geometry', JSON.stringify({ geometry: courseGeometries }));
        }
    }

    _handleLegEvents(message, distances, track, point) {
        for (let courseIndex in this.course.sequenced) {
            let course = this.course.sequenced[courseIndex];
            if (course.geometry !== null
                && course.geometry !== undefined) {
                if (course.geometry_type === geometryType.point) {
                    distances.push({ course_element: course, distance: turf.distance(point, course.geometry) });
                } else {
                    if (track !== null
                        && !this.trackInteractions[message.deviceId].includes(course.uuid)) {
                        if (turf.lineIntersect(track, course.geometry).features.length > 0) {
                            this.trackInteractions[message.deviceId].push(course.uuid);
                            console.log('Boat crossed line!');
                        }
                    }
                    distances.push({ course_element: course, distance: turf.pointToLineDistance(point, course.geometry) });
                }
            }
        }
    }

    _setBoatTracksLongLatsPointsWhenPinging(message, track) {
        if (this.boatTracks[message.deviceId] === null
            || this.boatTracks[message.deviceId] === undefined) {
            this.boatTracks[message.deviceId] = [];
        }

        this.boatTracks[message.deviceId] = message.content.previousLatLong;

        if (this.boatTracks[message.deviceId].length > 1) {
            track = turf.lineString(this.boatTracks[message.deviceId]);
        }

        if (this.trackInteractions === null
            || this.trackInteractions === undefined) {
            this.trackInteractions = {};
        }

        if (this.trackInteractions[message.deviceId] === null
            || this.trackInteractions[message.deviceId] === undefined) {
            this.trackInteractions[message.deviceId] = [];
        }

        if (track !== null) {
            let options = { mutate: false, highQuality: true, tolerance: 0.00005 };
            let simplified = turf.simplify(track, options);
            message.simplified = simplified;

        }
    }
}