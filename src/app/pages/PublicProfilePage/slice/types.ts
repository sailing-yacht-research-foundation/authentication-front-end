/* --- STATE --- */
export interface PublicProfileState {
    followers: any[];
    following: any[];
    events: any;
    currentFollowerPage: number;
    currentFollowingPage: number;
    followerTotalRecords: number;
    followingTotalRecords: number;
    followerTotalPage: number;
    followingTotalPage: number;
    profile: any;
    isModalLoading: boolean;
    getProfileFailed: boolean;
    isLoadingProfile: boolean;
    followerPageSize: number;
    followingPageSize: number;
}

export type ContainerState = PublicProfileState
