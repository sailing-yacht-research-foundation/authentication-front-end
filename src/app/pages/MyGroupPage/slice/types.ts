/* --- STATE --- */
export interface GroupState {
    groupCurrentPage: number;
    groupTotalPage: number;
    groupPageSize: number;
    invitationsCurrentPage: number;
    invitationsTotalPage: number;
    invitationPageSize: number;
    invitations: any[];
    groups: any[];
    isChangingPage: boolean;
    isLoading: boolean;
    searchKeyword: string;
    groupResults: any[];
    groupSearchCurrentPage: number;
    groupSearchTotalPage: number;
    groupSearchPageSize: number;
    requestedGroups: any[];
    requestedGroupsCurrentPage: number;
    requestedGroupTotalPage: number;
    requestedGroupPageSize: number;
    isGettingRequestedGroups: boolean;
    isModalLoading: boolean;
    performedSearch: boolean;
  }
  
  export type ContainerState = GroupState;
  