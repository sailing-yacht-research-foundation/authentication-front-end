
/* eslint-disable */
// playback oldrace worker mapping & processing heavy data.

// have to refined because worker does not support module import.

const workercode = () => {
    const workerEvent = {
        MAP_DATA: 'MapData',
        UPDATE_DATA_TO_MAIN_THREAD: 'UpdateWorkerDataToMainThread',
    };

    self.addEventListener('message', function (e) {
        const data = e.data.data;
        const workerEventData = e.data;
        if (workerEventData.action === workerEvent.MAP_DATA) {
            self.postMessage({
                action: workerEvent.UPDATE_DATA_TO_MAIN_THREAD,
                data: {
                    mappedVesselParticipants: generateVesselParticipantsLastPosition(data.vesselParticipants, data.elapsedTime, data.retrievedTimestamps),
                    mappedMarks: generateCourseGeometriesBaseOnCoursePointTrack(data.coursePoints, data.elapsedTime, data.retrievedTimestamps, data.courseGeometries)
                }
            });
        }
    }, false);

    function normalizeSequencedGeometries(sequencedGeometries) {
        return sequencedGeometries.map((sG) => {
            const coordinates = sG.points.map((point) => point.position);
            return {
                id: sG.id,
                geometryType: sG.geometryType,
                coordinates: coordinates,
                properties: sG.properties,
                points: sG.points
            };
        });
    }

    function generateCourseGeometriesBaseOnCoursePointTrack(coursePoints, selectedTimestamp, retrievedTimestamps, sequencedGeometries) {

        if (!sequencedGeometries) return [];

        sequencedGeometries = JSON.parse(JSON.stringify(sequencedGeometries));

        const coursePointsArray = Object.keys(coursePoints).map(
            (key) => coursePoints[key]
        );

        const points = coursePointsArray.map((point) => {
            const filteredPositions = point.tracks.filter((pos) => pos.timestamp <= selectedTimestamp);
            filteredPositions.sort((a, b) => b.timestamp - a.timestamp);

            const lastPosition = filteredPositions[0];

            if (!lastPosition) // eslint-disable-next-line
                return;

            return Object.assign({}, point, { position: [lastPosition.lat, lastPosition.lon] });
        }).filter(Boolean);

        sequencedGeometries.forEach(geometry => {
            geometry.points.forEach(geometryPoint => {
                points.forEach(point => {
                    if (geometryPoint.id === point.pointId) {
                        geometryPoint.position = point.position;
                    }
                })
            })
            geometry.points.sort((pointA, pointB) => pointA.order - pointB.order);
        });

        return normalizeSequencedGeometries(sequencedGeometries);
    }

    function generateVesselParticipantsLastPosition(vesselParticipantsObject, selectedTimestamp, retrievedTimestamps) {
        const vesselParticipants = Object.keys(vesselParticipantsObject).map(
            (key) => vesselParticipantsObject[key]
        );

        const updatedVPs = vesselParticipants.map((vP) => {
            const filteredPositions = vP.positions.filter((pos) => pos.timestamp <= selectedTimestamp);
            filteredPositions.sort((a, b) => b.timestamp - a.timestamp);

            const lastPosition = filteredPositions[0];

            if (!lastPosition) // eslint-disable-next-line
                return;

            const isRetrievedTimestampExist = retrievedTimestamps.includes(selectedTimestamp);
            if (!isRetrievedTimestampExist) {
                // Only interpolate when no timestamp available
                const nearestPos = findNearestPositions(vP.positions, selectedTimestamp, 1000, { excludeSelectedTimestamp: true });
                const interpolatedPosition = interpolateNearestPositions(nearestPos, selectedTimestamp);

                if (interpolatedPosition) {
                    lastPosition.lat = interpolatedPosition.lat;
                    lastPosition.lon = interpolatedPosition.lon;
                }
            }

            const currentCoordinateForHeading = [lastPosition.lon, lastPosition.lat];
            const previousCoordinateForHeading =
                filteredPositions[1]?.lon && filteredPositions[1]?.lat
                    ? [filteredPositions[1].lon, filteredPositions[1].lat]
                    : currentCoordinateForHeading;
            const heading = generateLastHeading(previousCoordinateForHeading, currentCoordinateForHeading);
            lastPosition.heading = heading;

            return Object.assign({}, vP, { positions: filteredPositions, lastPosition });
        });

        return updatedVPs.filter(Boolean);
    };


    function findNearestPositions(
        positions,
        selectedTimestamp,
        rangeLimit,
        opt) {
        let previousPos = positions.filter((pos) => {
            return pos.timestamp >= selectedTimestamp - rangeLimit && pos.timestamp <= selectedTimestamp;
        });

        previousPos.sort((a, b) => a.timestamp - b.timestamp);

        let nextPos = positions.filter((pos) => {
            return pos.timestamp >= selectedTimestamp && pos.timestamp <= selectedTimestamp + rangeLimit;
        });

        nextPos.sort((a, b) => a.timestamp - b.timestamp);

        if (opt?.excludeSelectedTimestamp) {
            previousPos = previousPos.filter((pos) => pos.timestamp !== selectedTimestamp);
            nextPos = nextPos.filter((pos) => pos.timestamp !== selectedTimestamp);
        }

        return { previous: previousPos, next: nextPos };
    };

    function interpolateNearestPositions(
        nearestPositions,
        selectedTimestamp
    ) {
        // If we could find the previous and the next position
        // example:
        // nearestPosition: [5, 6] and the selectedTimeStamp: 5.5

        if (nearestPositions.previous.length && nearestPositions.next.length) {
            const mostPreviousPos = nearestPositions.previous[nearestPositions.previous.length - 1];

            const earliestNext = nearestPositions.next[0];

            const gap = {
                timestamp: earliestNext.timestamp - mostPreviousPos.timestamp,
                lat: earliestNext.lat - mostPreviousPos.lat,
                lon: earliestNext.lon - mostPreviousPos.lon,
            };

            const normalizedTs = selectedTimestamp - mostPreviousPos.timestamp;
            const interpolatedLat = (normalizedTs / gap.timestamp) * gap.lat;
            const interpolatedLon = (normalizedTs / gap.timestamp) * gap.lon;

            return { lat: interpolatedLat + mostPreviousPos.lat, lon: interpolatedLon + mostPreviousPos.lon };
        }

        return false;
    };

    // Converts from degrees to radians.
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    };

    // Converts from radians to degrees.
    function toDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    function generateLastHeading(coordinate1, coordinate2) {
        startLat = toRadians(coordinate1[1]);
        startLng = toRadians(coordinate1[0]);
        destLat = toRadians(coordinate2[1]);
        destLng = toRadians(coordinate2[0]);

        y = Math.sin(destLng - startLng) * Math.cos(destLat);
        x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        bearing = Math.atan2(y, x);
        bearing = toDegrees(bearing);
        return (bearing) % 360;
    };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const mapFrameDataWorker = URL.createObjectURL(blob);

export default mapFrameDataWorker;