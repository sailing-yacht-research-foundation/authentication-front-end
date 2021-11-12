
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
    date_text: 'MMM. D, YYYY'
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