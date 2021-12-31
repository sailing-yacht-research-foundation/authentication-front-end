
export const FIELD_VALIDATE = {
    phone: 'phone',
    email: 'email'
}

export const MAP_DEFAULT_VALUE = {
    ZOOM: 11,
    CENTER: {
        lng: -122.4,
        lat: 37.8
    }
}

export const TIME_FORMAT = {
    number: 'YYYY-MM-DD',
    date_text_with_time: 'MMM. D, YYYY [at] h:mm A z',
    date_text: 'MMM. D, YYYY',
    time: 'HH:mm:ss'
}

export const MODE = {
    CREATE: 'create',
    UPDATE: 'update'
};

export const supportedSearchCriteria = [
    'name',
    'start_city',
    'start_country',
    'boat_names',
    'boat_models',
    'handicap_rules',
    'source',
    'unstructured_text',
    'all_fields'
];

export const formattedSupportedSearchCriteria = [
    'Start City',
    'Start Country',
    'Boat Name',
    'Boat Model',
    'Handicap Rule',
    'Source',
    'Unstructured Text',
    'All Fields'
];

export const CRITERIA_TO_RAW_CRITERIA = {
    'Start City': 'start_city',
    'Start Country': 'start_country',
    'Boat Name': 'boat_names',
    'Boat Model': 'boat_models',
    'Handicap Rule': 'handicap_rules',
    'Source': 'source',
    'Unstructured Text': 'unstructured_text',
    'All Fields': 'all_fields'
}

export const RAW_CRITERIA_TO_CRITERIA = {
    'start_city': 'Start City',
    'start_country': 'Start Country',
    'boat_names': 'Boat Name',
    'boat_models': 'Boat Model',
    'handicap_rules': 'Handicap Rule',
    'source': 'Source',
    'unstructured_text': 'Unstructured Text',
    'all_fields': 'All Fields'
}

export const enum GroupMemberStatus {
    INVITED = 'INVITED',
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED'
};

export const enum GroupVisibility {
    public = 'PUBLIC',
    private = 'PRIVATE',
    moderated = 'MODERATED'
};

export const enum RaceStatus {
    ON_GOING = 'ONGOING',
    SCHEDULED = 'SCHEDULED'
}

export const enum WebsocketConnectionStatus {
    CONNECTING = "connecting",
    OPEN = "open",
    CLOSING = "closing",
    CLOSED = "closed",
    UNINSTANTIATED = "uninstantiated",
    ERROR = "error"
}

export const enum PlaybackSpeed {
    speed1X = 1,
    speed2X = 2,
    speed5X = 5,
    speed10X = 10,
    speed20X = 20,
    speed50X = 50,
    speed100X = 100,
    speed200X = 200,
    speed500X = 500,
    speed1000x = 1000
}

export const enum RaceEmitterEvent {
    PING = 'ping',
    ZOOM_TO_LOCATION = 'zoom-to-location',
    RENDER_SEQUENCED_COURSE = 'render-sequenced-courses',
    TRACK_UPDATE = 'track-update',
    RENDER_REGS = 'render-legs',
    LEG_UPDATE = 'leg-update',
    REMOVE_PARTICIPANT = 'remove-vesselparticipant',
    UPDATE_COURSE_MARK = 'update-course-mark',
    ZOOM_TO_PARTICIPANT = 'zoom-to-participant',
    UPDATE_COURSE = 'update-course'
}

export const DEFAULT_GROUP_AVATAR = '/default-avatar.jpeg';

export enum WorkerEvent {
    SEND_DATA_TO_WORKER = 'SendDataToWorker',
    SEND_WS_MESSAGE = 'SendWSMessage',
    INIT_WS = 'initWS',
    SET_CONNECTION_STATUS = 'SetConnectionStatus',
    UPDATE_DATA_TO_MAIN_THREAD = 'UpdateWorkerDataToMainThread',
    COURSE_MARK_UPDATE = 'CourseMarkUpdate',
    UPDATE_WORKER_DATA_TO_MAIN_THREAD = 'UpdateWorkerDataToMainThread',
    NEW_PARTICIPANT_JOINED = 'NewParticipantJoined',
    VESSEL_PARTICIPANT_REMOVED = 'VesselParticipantRemoved'
};

export enum WSMessageDataType {
    POSITION = 'position',
    VIEWER_COUNT = 'viewers-count',
    NEW_PARTICIPANT_JOINED = 'new-participant-joined',
    VESSEL_PARTICIPANT_REMOVED = 'vessel-participant-removed',
    MAKR_TRACK = 'mark-track',
    COURSE_UPDATED = 'course-updated'
}

export enum FollowStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED'
}

export enum EventState {
    SCHEDULED = 'SCHEDULED',
    DRAFT = 'DRAFT',
    CANCELED = 'CANCELED',
    COMPLETED = 'COMPLETED',
    ON_GOING = 'ONGOING'
}