
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
    DECLINED = 'DECLINED',
    BLOCKED = 'BLOCKED'
};

export const enum GroupVisibility {
    public = 'PUBLIC',
    private = 'PRIVATE',
    moderated = 'MODERATED'
};

export const enum RaceStatus {
    ON_GOING = 'ONGOING',
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    POSTPONED = 'POSTPONED'
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
    UPDATE_COURSE = 'update-course',
    OCS_DETECTED = 'ocs-detected',
    UPDATE_BOAT_COLOR = 'update-boat-color',
    CHANGE_BOAT_COLOR_TO_GRAY = 'CHANGE_BOAT_COLOR_TO_GRAY'
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
    VESSEL_PARTICIPANT_REMOVED = 'VesselParticipantRemoved',
    MAP_DATA = 'MapData'
};

export enum WSMessageDataType {
    POSITION = 'position',
    VIEWER_COUNT = 'viewers-count',
    NEW_PARTICIPANT_JOINED = 'new-participant-joined',
    VESSEL_PARTICIPANT_REMOVED = 'vessel-participant-removed',
    MARK_TRACK = 'mark-track',
    COURSE_UPDATED = 'course-updated',
    EVENT = 'event',
    TRACKING_STATE_UPDATE = 'tracking-state-update'
}

export enum WSTrackingStateUpdate {
    PARTICIPANT_START_TRACKING = 'start_tracking',
    PARTICIPANT_STOP_TRACKING = 'stop_tracking',
    DISCONNECTED = 'disconnected'
}

export enum FollowStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

export enum EventState {
    SCHEDULED = 'SCHEDULED',
    DRAFT = 'DRAFT',
    CANCELED = 'CANCELED',
    COMPLETED = 'COMPLETED',
    ON_GOING = 'ONGOING'
}

export enum ParticipantInvitationStatus {
    BLOCKED = 'BLOCKED',
    INVITED = 'INVITED',
    ACCEPTED = 'ACCEPTED'
}

export enum AdminType {
    GROUP = 'group',
    INDIVIDUAL = 'individual'
}

export enum CompetitorType {
    GROUP = 'group',
    INDIVIDUAL = 'individual'
}

export enum VesselType {
    FOIL_BOARD = 'FOIL_BOARD',
    BOARD = 'BOARD',
    DINGHY = 'DINGHY',
    KEELBOAT = 'KEELBOAT',
    OTHER = 'OTHER'
}

export const WATERSPORTS = [
    "WINGING",
    "CRUISING",
    "HANDICAP",
    "ONEDESIGN",
    "KITESURFING",
    "WINDSURFING"];

export const ownershipArray = [
    'OWNED', 'RENTED'
];

export enum EventTypes {
    ONE_DESIGN = 'ONE_DESIGN',
    HANDICAP_RACE = 'HANDICAP_RACE',
    KITESURFING = 'KITESURFING',
    WINGING = 'WINGING',
    WINDSURFING = 'WINDSURFING',
    CRUISING = 'CRUISING',
    RALLY = 'RALLY',
    TRAINING = 'TRAINING',
    OTHER = 'OTHER'
}

export enum EventParticipatingTypes {
    VESSEL = 'VESSEL',
    PERSON = 'PERSON'
}

export enum ImportTrackType {
    GPX = 'gpx',
    EXPEDITION = 'csv'
}

export const certifications = ['ORC', 'ORR', 'IRC'];

export enum NotificationTypes {
    USER_ADDED_TO_GROUP_ADMIN = 'USER_ADDED_TO_GROUP_ADMIN',
    USER_INVITED_TO_GROUP = 'USER_INVITED_TO_GROUP',
    USER_ADDED_TO_EVENT_ADMIN = 'USER_ADDED_TO_EVENT_ADMIN',
    USER_INVITED_TO_PRIVATE_REGATTA = 'USER_INVITED_TO_PRIVATE_REGATTA',
    USER_NEW_FOLLOWER = 'USER_NEW_FOLLOWER',
    EVENT_INACTIVITY_DELETION = 'EVENT_INACTIVITY_DELETION',
    REQUEST_JOIN_GROUP = 'REQUEST_JOIN_GROUP',
    USER_ACHIEVE_BADGE = 'USER_ACHIEVE_BADGE',
    GROUP_ACHIEVE_BADGE = 'GROUP_ACHIEVE_BADGE',
    OPEN_EVENT_NEARBY_CREATED = 'OPEN_EVENT_NEARBY_CREATED',
    COMPETITION_START_TRACKING = 'COMPETITION_START_TRACKING',
    NEW_COMPETITION_ADDED_TO_EVENT = 'NEW_COMPETITION_ADDED_TO_EVENT',
    KUDOS_RECEIVED = 'KUDOS_RECEIVED',
    EVENT_INACTIVITY_WARNING = 'EVENT_INACTIVITY_WARNING',
    EVENT_MESSAGES_RECEIVED = 'EVENT_MESSAGES_RECEIVED',
    SIMULATION_DELETION = 'SIMULATION_DELETION'
}

export enum UserRole {
    SUPER_ADMIN = 'SUPERADMIN'
}

export enum KudoTypes {
    THUMBS_UP = 'THUMBS_UP',
    APPLAUSE = 'APPLAUSE',
    STAR = 'STAR',
    HEART = 'HEART',
}

export const DEFAULT_PAGE_SIZE = 10;

export enum AuthCode {
    WRONG_CREDENTIALS = 'E012',
    USER_ALREADY_EXISTS = 'E015'
}

export enum WebsocketRaceEvent {
    VESSEL_OCS = 'VesselOCS'
}

export enum GroupTypes {
    ORGANIZATION = 'ORGANIZATION',
    COMMITTEE = 'COMMITTEE',
    TEAM = 'TEAM',
}

export enum RaceSource {
    SYRF = 'SYRF'
}

export const sourcesPreventIframe = ['TACKTRACKER'];
