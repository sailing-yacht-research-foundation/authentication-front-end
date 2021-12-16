/* --- STATE --- */
export interface PublicProfileState {
    followers: any[];
    following: any[];
    currentFollowerPage: number;
    currentFollowingPage: number;
    followerTotalRecords: number;
    followingTotalRecords: number;
    followerTotalPage: number;
    followingTotalPage: number;
    profile: any;
    isModalLoading: boolean;
}

export type ContainerState = PublicProfileState
