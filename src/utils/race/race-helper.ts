const turf = require('@turf/turf');

export const calculateTrackPingTime = (tracks: any[]) => {
    const timeOffset = tracks[0].first_ping_time;
    let pingIndex = 0;
    for (let trackIndex in tracks) {
        const track = tracks[trackIndex];
        track.first_ping_time = track.first_ping_time - timeOffset;
        for (let positionIndex in track.track) {
            track.track[positionIndex][3] = track.track[positionIndex][3] - timeOffset;
            track.track[positionIndex][2] = pingIndex;
            pingIndex++;
        }
    }
}

export const getLastTrackPingTime = (tracks: any[]) => {
    let lastTrack = tracks[tracks.length - 1];
    let greatestPingTime = 0;

    for (let positionIndex in lastTrack.track) {
        if (lastTrack.track[positionIndex][3] > greatestPingTime) {
            greatestPingTime = lastTrack.track[positionIndex][3];
        }
    }

    return greatestPingTime;
}

export const collectTrackDataFromGeoJson = (trackData, markData) => {
    const tracks: any[] = [];

    trackData.default.features.forEach(boatFeature => {
        if (boatFeature.geometry.coordinates.length > 0) {
            tracks.push({
                type: 'boat',
                id: boatFeature.properties.competitor_id,
                first_ping_time: boatFeature.geometry.coordinates[0][3],
                track: boatFeature.geometry.coordinates,
                competitor_name: boatFeature.properties.competitor_name,
                competitor_sail_number: boatFeature.properties.competitor_sail_number
            })
        }
    })

    markData.default.features.forEach(markFeature => {
        if (markFeature.geometry.coordinates.length > 0) {
            tracks.push({ type: 'mark', id: markFeature.properties.mark_id, first_ping_time: markFeature.geometry.coordinates[0][3], track: markFeature.geometry.coordinates })
        }
    })

    return tracks;
}

export const toSimplifiedGeoJson = (message) => {
    return {
        'type': 'FeatureCollection',
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'EPSG:3857',
            },
        },
        'features': [
            {
                'type': 'Feature',
                'geometry': message.simplified?.geometry ? message.simplified?.geometry : {}
            }]
    }
}

export const simplifiedGeoJsonTrackToLastHeading = (geojson) => {
    if (!geojson.features[0].geometry.coordinates) return;

    let lastIndex = geojson.features[0].geometry.coordinates.length - 1;
    let lastPoint = geojson.features[0].geometry.coordinates[lastIndex];
    let secondLastPoint = geojson.features[0].geometry.coordinates[lastIndex - 1];

    let point1 = turf.point(lastPoint);
    let point2 = turf.point(secondLastPoint);

    let bearing = turf.bearing(point2, point1);
    
    return bearing;
}

export const generateLastHeading = (coordinate1, coordinate2) => {
    const point1 = turf.point(coordinate1);
    const point2 = turf.point(coordinate2);

    return turf.bearing(point1, point2);
}

export const simulateThirdParameter = (geojson) => {
    let coords: any[] = [];
    let index = 0;

    if (geojson.features[0].geometry.coordinates)
        geojson.features[0].geometry.coordinates.forEach(point => {
            let p = [point[1], point[0], index % 360]
            index += 10
            coords.push(p)
        });

    return coords;
}

export const simulateThirdParameterForCourse = (coordinates) => {
    let coords: any[] = [];
    let index = 0;

    if (coordinates.length > 2) {
        coordinates.forEach(point => {
            let p = [point[1], point[0], index % 360]
            index += 10
            coords.push(p)
        });
    } else {
        let p = [coordinates[1], coordinates[0], index % 360]
        index += 10
        coords.push(p)
    }


    return coords;
}

export const sortTrackFirstPingTime = (tracks: any[]) => {
    tracks.sort(function (a, b) {
        if (a.first_ping_time === b.first_ping_time) return 0;
        return a.first_ping_time < b.first_ping_time ? -1 : 1;
    });
}

