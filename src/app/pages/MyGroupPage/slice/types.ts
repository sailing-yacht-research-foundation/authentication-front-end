/* --- STATE --- */
export interface GroupState {
    groupCurrentPage: number;
    groupTotalPage: number;
    invitationsCurrentPage: number;
    invitationsTotalPage: number;
    invitations: any[];
    groups: any[];
    isChangingPage: boolean;
    isLoading: boolean;
    searchKeyword: string;
    groupResults: any[];
    groupSearchCurrentPage: number;
    groupSearchTotalPage: number;
    requestedGroups: any[];
    requestedGroupsCurrentPage: number;
    requestedGroupTotalPage: number;
    isGettingRequestedGroups: boolean;
    isModalLoading: boolean;
  }
  
  export type ContainerState = GroupState;
  