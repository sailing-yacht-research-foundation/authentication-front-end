
/* eslint-disable */
// playback oldrace worker.

// have to refined because worker does not support module import.

const workercode = () => {
    const workerEvent = {
        SEND_DATA_TO_WORKER: 'SendDataToWorker',
        SEND_WS_MESSAGE: 'SendWSMessage',
        INIT_WS: 'initWS',
        SET_CONNECTION_STATUS: 'SetConnectionStatus',
        UPDATE_DATA_TO_MAIN_THREAD: 'UpdateWorkerDataToMainThread',
        COURSE_MARK_UPDATE: 'CourseMarkUpdate',
        UPDATE_WORKER_DATA_TO_MAIN_THREAD: 'UpdateWorkerDataToMainThread',
        NEW_PARTICIPANT_JOINED: 'NewParticipantJoined',
        VESSEL_PARTICIPANT_REMOVED: 'VesselParticipantRemoved'
    };

    const wsMessageDataType = {
        POSITION: 'position',
        VIEWER_COUNT: 'viewers-count',
        NEW_PARTICIPANT_JOINED: 'new-participant-joined',
        VESSEL_PARTICIPANT_REMOVED: 'vessel-participant-removed',
        MARK_TRACK: 'mark-track'
    }

    let ws = null;
    let wsURL = '';
    let raceTime;
    let vesselParticipants = [];
    let retrievedTimestamps = [];
    let competitionUnitId = '';
    let elapsedTime = 0;
    let playbackSpeed = 1;
    const timeToLoad = 100;
    let lastRetrievedTimestamp = 0;
    let receivedTimestamps = [];
    let receivingData = false;
    let lastTimeReceivedMessageFromWS = new Date();
    let hasMoreData = true;
    let elapsedTimeHasBeenChanged = false;

    self.addEventListener('message', function (e) {
        const data = e.data;
        if (data.action === workerEvent.INIT_WS) {
            initWS(data);
        } else if (data.action === workerEvent.SEND_WS_MESSAGE) {
            try {
                ws.send(JSON.stringify(data.data));
            } catch (e) {
                console.warn(e);
            }
        } else if (data.action === workerEvent.SEND_DATA_TO_WORKER) {
            vesselParticipants = data?.data?.vesselParticipants ?? vesselParticipants;
            raceTime = data?.data?.raceTime ?? raceTime;
            competitionUnitId = data?.data?.competitionUnitId ?? competitionUnitId;
            retrievedTimestamps = data?.data?.retrievedTimestamps ?? retrievedTimestamps;
            playbackSpeed = data?.data?.playbackSpeed ?? playbackSpeed;
            let newElapsedTime = data?.data?.elapsedTime ?? elapsedTime;
            if (newElapsedTime < elapsedTime) {
                elapsedTimeHasBeenChanged = true;
                lastRetrievedTimestamp = newElapsedTime;
            }
            elapsedTime = newElapsedTime;
        }
    }, false);

    function initWS(data) {
        const url = data.url;
        wsURL = url;
        ws = new WebSocket(url);
        initWebsocketEvents(ws);
    }

    function initWebsocketEvents(ws) {
        ws.onopen = () => {
            self.postMessage({
                action: workerEvent.SET_CONNECTION_STATUS,
                data: 'open'
            });
        }
        ws.onclose = (e) => {
            self.postMessage({
                action: workerEvent.SET_CONNECTION_STATUS,
                data: 'closed'
            });
            handleReconnect();
        }
        ws.onerror = (e) => {
            self.postMessage({
                action: workerEvent.SET_CONNECTION_STATUS,
                data: 'closed'
            });
            handleReconnect();
        }
        ws.onmessage = (message) => {
            if (!message?.data) return;

            const wsData = JSON.parse(message?.data);

            if (wsData?.type === 'data') {
                if (wsData?.dataType === wsMessageDataType.POSITION) {
                    processData(wsData.data);
                } else if (wsData?.dataType === wsMessageDataType.MARK_TRACK) {
                    self.postMessage({
                        action: workerEvent.COURSE_MARK_UPDATE,
                        data: wsData.data
                    })
                } else if (wsData?.dataType === wsMessageDataType.NEW_PARTICIPANT_JOINED) {
                    self.postMessage({
                        action: workerEvent.NEW_PARTICIPANT_JOINED,
                        data: wsData.data
                    })
                } else if (wsData?.dataType === wsMessageDataType.VESSEL_PARTICIPANT_REMOVED) {
                    self.postMessage({
                        action: workerEvent.VESSEL_PARTICIPANT_REMOVED,
                        data: wsData.data
                    })
                }
            } else if (wsData?.type === 'command') {
                hasMoreData = wsData?.data?.hasMoreData;
            }
        }
    }

    function handleReconnect() {
        ws = new WebSocket(wsURL);
        initWebsocketEvents(ws);
    }

    setInterval(function () {
        requestMoreDataIfNeeded();
        self.postMessage({
            action: workerEvent.UPDATE_WORKER_DATA_TO_MAIN_THREAD,
            data: {
                vesselParticipants: vesselParticipants,
                retrievedTimestamps: retrievedTimestamps
            }
        });
    }, 1000);

    function processData(source) {
        const data = Object.assign({}, source);

        if (!Object.keys(vesselParticipants)?.length || !data?.vesselParticipantId || !raceTime?.start) return;

        const currentVesselParticipantId = data?.vesselParticipantId;
        if (!vesselParticipants[currentVesselParticipantId]) return;

        const selectedVesselParticipant = Object.assign({}, vesselParticipants[currentVesselParticipantId]);

        const lastTimestampOfTrack = data.tracks[data?.tracks?.length - 1]?.timestamp - raceTime.start;
        if (lastTimestampOfTrack > lastRetrievedTimestamp && !elapsedTimeHasBeenChanged) {
            lastRetrievedTimestamp = lastTimestampOfTrack;
        }

        data?.tracks?.forEach(track => {
            let trackData = Object.assign({}, track);
            trackData.timestamp = track.timestamp - raceTime.start;
            if (selectedVesselParticipant.positions?.length) {
                const similarTimestampPosition = selectedVesselParticipant.positions.filter(
                    (position) => position.timestamp === trackData.timestamp
                );
                if (similarTimestampPosition.length) return;
            }

            selectedVesselParticipant.positions.push(trackData);
            receivedTimestamps.push(trackData.timestamp);
        });
        receivedTimestamps = receivedTimestamps.filter((x, i, a) => a.indexOf(x) == i);
        receivedTimestamps.sort((a, b) => a - b);
        selectedVesselParticipant.positions.sort((posA, posB) => posA.timestamp - posB.timestamp);
        vesselParticipants[currentVesselParticipantId] = selectedVesselParticipant;

        mapRetrievedTimestamps();

        receivingData = true;
        lastTimeReceivedMessageFromWS = new Date();
    }

    function mapRetrievedTimestamps() {
        const vesselParticipants = Object.assign({}, vesselParticipants);
        const vesselParticipantsArray = Object.keys(vesselParticipants).map((key) => vesselParticipants[key]);
        const generatedRetrievedTimestamps = generateRetrievedTimestamp(vesselParticipantsArray);

        if (generatedRetrievedTimestamps.length === retrievedTimestamps.length) return;

        retrievedTimestamps = generatedRetrievedTimestamps;
    }

    function requestMoreDataIfNeeded() {
        const seconds = (((new Date())).getTime() - lastTimeReceivedMessageFromWS.getTime()) / 1000;

        if (seconds > 5) receivingData = false;

        const canRequestMoreData = lastRetrievedTimestamp
            && raceTime
            && playbackSpeed < 5
            && !receivingData
            && hasMoreData;

        if (canRequestMoreData) {
            let timeToLoadAt = 0;
            if (lastRetrievedTimestamp > elapsedTime) {
                timeToLoadAt = lastRetrievedTimestamp + raceTime.start;
            } else {
                timeToLoadAt = elapsedTime + raceTime.start;
            }

            if ((elaspedTimeInReceivedTimestamps(receivedTimestamps, timeToLoadAt + 1500, timeToLoadAt + 2500) && elapsedTime !== 0)) return;

            try {
                ws.send(JSON.stringify({
                    action: "playback_v2",
                    data: {
                        competitionUnitId: competitionUnitId,
                        startTimeFetch: timeToLoadAt,
                        timeToLoad: timeToLoad,
                    },
                }));
                elapsedTimeHasBeenChanged = false;
            } catch (e) {
                console.error(e);
            }
        }
    }

    function generateRetrievedTimestamp(vesselParticipants) {
        const availableTimestamps = [];

        if (!vesselParticipants.length) return [];

        // Get the unique timestamp
        vesselParticipants.forEach((vP) => {
            vP.positions.forEach((pos) => {
                if (!availableTimestamps.includes(pos.timestamp)) availableTimestamps.push(pos.timestamp);
            });
        });

        availableTimestamps.sort((a, b) => a - b);

        return availableTimestamps;
    }

    function elaspedTimeInReceivedTimestamps(array, lower, upper) {
        let result = false;
        for (let i = 0; i < array.length; i++) {
            if (upper > array[i] && lower < array[i]) {
                result = true;
                break;
            }
        }
        return result;
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const websocketWorker = URL.createObjectURL(blob);

export default websocketWorker;