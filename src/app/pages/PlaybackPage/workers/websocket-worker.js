let websocket;
let retrievedTimestamps;
let vesselParticipants = [];

self.addEventListener("message", function() {

});

function initWebsocket(URL) {
    websocket = new WebSocket(URL);

    websocket.onopen = function () {

    }

    websocket.onmessage = function (message) {
        if (!message?.data) return;
        const wsData = JSON.parse(message.data);
        
        if (wsData?.type !== "data" && wsData?.dataType !== "position") return;

        const data = { ...wsData.data };
        const raceTime = raceTimeRef.current;
    
        if (!Object.keys(vesselParticipants)?.length || !data?.raceData?.vesselParticipantId || !raceTime.start) return;
    
        const currentVesselParticipantId = data?.raceData?.vesselParticipantId;
        if (!vesselParticipants[currentVesselParticipantId]) return;
    
        const selectedVesselParticipant = { ...vesselParticipants[currentVesselParticipantId] };
    
        data.raceData = undefined;
        data.timestamp = data.timestamp - raceTime.start;
    
        if (selectedVesselParticipant.positions?.length) {
          const similarTimestampPosition = selectedVesselParticipant.positions.filter(
            (position) => position.timestamp === data.timestamp
          );
          if (similarTimestampPosition.length) return;
        }
    
        selectedVesselParticipant.positions.push(data);
        selectedVesselParticipant.positions.sort((posA, posB) => posA.timestamp - posB.timestamp);
    
        vesselParticipants[currentVesselParticipantId] = selectedVesselParticipant;
    }

    websocket.onclose = function () {

    }

    websocket.onerror = function () {

    }
}