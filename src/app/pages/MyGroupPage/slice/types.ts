/* --- STATE --- */
export interface GroupState {
    groupCurrentPage: number;
    groupTotalPage: number;
    invitationsCurrentPage: number;
    invitationsTotalPage: number;
    invitations: any[];
    groups: any[];
    isChangingPage: boolean;
    memberCurrentPage: number;
    memberTotalPage: number;
    members: any[];
    isLoading: boolean;
    searchKeyword: string;
    groupResults: any[];
    groupSearchCurrentPage: number;
    groupSearchTotalPage: number;
  }
  
  export type ContainerState = GroupState;
  