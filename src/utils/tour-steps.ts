export enum TourStepClassName {
    SEARCH = 'search-step',
    CREATE_EVENT_BUTTON = 'create-event-button',
    TRACKS_PAGE = 'my-track-page',
    MY_EVENTS_PAGE = 'my-events-page',
    GROUPS_PAGE = 'groups-page',
    BOATS_PAGE = 'boats-page',
    DISCOVER_FRIENDS_PAGE = 'discover-friends-page',
    MY_ACCOUNT_PAGE = 'my-account-page',
    NOTIFICATIONS =  'notifications-icon'
}

export const steps = [
    {
        selector: `.${TourStepClassName.SEARCH}`,
        content: 'Find races and events in the discovery area.'
    },
    {
        selector: `.${TourStepClassName.CREATE_EVENT_BUTTON}`,
        content: 'Create a new event at any time by clicking this button.',
    },
    {
        selector: `.${TourStepClassName.TRACKS_PAGE}`,
        content: 'Re-watch all of your LivePing tracks here.'
    },
    {
        selector: `.${TourStepClassName.MY_EVENTS_PAGE}`,
        content: 'Quickly find your events in the My Events section.'
    },
    {
        selector: `.${TourStepClassName.GROUPS_PAGE}`,
        content: 'Use groups to conveniently manage invitations and permissions, or collect payment for your organization.'
    },
    {
        selector: `.${TourStepClassName.BOATS_PAGE}`,
        content: 'Enter your boat details once so you never have to do it again.'
    },
    {
        selector: `.${TourStepClassName.DISCOVER_FRIENDS_PAGE}`,
        content: 'Find the people you sail with.'
    },
    {
        selector: `.${TourStepClassName.MY_ACCOUNT_PAGE}`,
        content: 'Manage your account and profile settings.'
    },
    {
        selector: `.${TourStepClassName.NOTIFICATIONS}`,
        content: 'View or clear recent notifications.'
    }
]
