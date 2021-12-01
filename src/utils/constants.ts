
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
    'unstructured_text'
];

export const formatterSupportedSearchCriteria = [
    'Name:',
    'Start City:',
    'Start Country:',
    'Boat Names:',
    'Boat Models:',
    'Handicap Rules;',
    'Source:',
    'Unstructured Text:'
];

export const enum GroupMemberStatus {
    invited = 'INVITED',
    requested = 'REQUESTED',
    accepted = 'ACCEPTED',
    declined = 'DECLINED'
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
    connecting = "connecting",
    open = "open",
    closing = "closing",
    closed = "closed",
    uninstantiated = "uninstantiated",
    error = "error"
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
    ping = 'ping',
    zoom_to_location = 'zoom-to-location',
    sequenced_courses_update = 'sequenced-courses-update',
    track_update = 'track-update',
    render_legs = 'render-legs',
    leg_update = 'leg-update',
}

export const DEFAULT_GROUP_AVATAR = '/default-avatar.jpeg';