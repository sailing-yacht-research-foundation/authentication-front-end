
/* eslint-disable */
// worker.js
const workercode = () => {
    let ws = null;
    let wsURL = '';
    let raceTime;
    let vesselParticipants = [];
    let retrievedTimestamps = [];
    let competitionUnitId = '';
    let elapsedTime = 0;
    let playbackSpeed = 1;
    const timeToLoad = 50;
    let lastRetrievedTimestamp = 0;
    let canRequestMore = true;

    self.addEventListener('message', function (e) {
        const data = e.data;
        if (data.action === 'initWS') {
            initWS(data);
        } else if (data.action === 'SendWSMessage') {
            try {
                ws.send(JSON.stringify(data.data));
            } catch (e) {
                console.warn(e);
            }
        } else if (data.action === 'SendDataToWorker') {
            if (data?.data?.vesselParticipants) {
                vesselParticipants = data?.data?.vesselParticipants;
            }
            if (data?.data?.raceTime) {
                raceTime = data?.data?.raceTime;
            }

            if (data?.data?.competitionUnitId) {
                competitionUnitId = data?.data?.competitionUnitId;
            }

            if (data?.data?.retrievedTimestamps) {
                retrievedTimestamps = data?.data?.retrievedTimestamps;
            }

            if (data?.data?.elapsedTime) {
                elapsedTime = data?.data?.elapsedTime;
            }

            if (data?.data?.playbackSpeed) {
                playbackSpeed = data?.data?.playbackSpeed;
            }
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
                action: 'SetConnectionStatus',
                data: 'open'
            });
        }
        ws.onclose = (e) => {
            self.postMessage({
                action: 'SetConnectionStatus',
                data: 'closed'
            });
            handleReconnect();
        }
        ws.onerror = (e) => {
            self.postMessage({
                action: 'SetConnectionStatus',
                data: 'closed'
            });
            handleReconnect();
        }
        ws.onmessage = (message) => {
            if (!message?.data) return;
            const wsData = JSON.parse(message?.data);
            if (wsData?.type === "data" && wsData?.dataType === "position") processData(wsData.data);
        }
    }

    function handleReconnect() {
        ws = new WebSocket(wsURL);
        initWebsocketEvents(ws);
    }

    setInterval(function () {
        requestMoreDataIfNeeded();
        self.postMessage({
            action: 'UpdateWorkerDataToMainThread',
            data: {
                vesselParticipants: vesselParticipants,
                retrievedTimestamps: retrievedTimestamps
            }
        });
    }, 1000);

    function processData(source) {
        const data = Object.assign({}, source);

        if (!Object.keys(vesselParticipants)?.length || !data?.raceData?.vesselParticipantId || !raceTime.start) return;

        const currentVesselParticipantId = data?.raceData?.vesselParticipantId;
        if (!vesselParticipants[currentVesselParticipantId]) return;

        const selectedVesselParticipant = Object.assign({}, vesselParticipants[currentVesselParticipantId]);

        data.raceData = undefined;
        data.timestamp = data.timestamp - raceTime.start;
        lastRetrievedTimestamp = data.timestamp;

        if (selectedVesselParticipant.positions?.length) {
            const similarTimestampPosition = selectedVesselParticipant.positions.filter(
                (position) => position.timestamp === data.timestamp
            );
            if (similarTimestampPosition.length) return;
        }

        selectedVesselParticipant.positions.push(data);
        selectedVesselParticipant.positions.sort((posA, posB) => posA.timestamp - posB.timestamp);

        vesselParticipants[currentVesselParticipantId] = selectedVesselParticipant;

        mapRetrievedTimestamps();

        if (((lastRetrievedTimestamp - elapsedTime) / 1000) > timeToLoad) {
            canRequestMore = true;
        }
    }

    function mapRetrievedTimestamps() {
        const vesselParticipants = Object.assign({}, vesselParticipants);
        const vesselParticipantsArray = Object.keys(vesselParticipants).map((key) => vesselParticipants[key]);
        const generatedRetrievedTimestamps = generateRetrievedTimestamp(vesselParticipantsArray);

        if (generatedRetrievedTimestamps.length === retrievedTimestamps.length) return;

        retrievedTimestamps = generatedRetrievedTimestamps;
    }

    function requestMoreDataIfNeeded() {
        if (!lastRetrievedTimestamp || !raceTime || playbackSpeed > 5 || !canRequestMore) return;
        let timeToLoadAt = lastRetrievedTimestamp + raceTime.start;
        ws.send(JSON.stringify({
            action: "playback",
            data: {
                competitionUnitId: competitionUnitId,
                startTimeFetch: timeToLoadAt,
                timeToLoad: timeToLoad,
            },
        }));
        canRequestMore = false;
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
    };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const websocketWorker = URL.createObjectURL(blob);

export default websocketWorker;
