/* --- STATE --- */
export interface GroupDetailState {
    adminCurrentPage: number;
    adminTotal: number;
    memberCurrentPage: number;
    memberTotal: number;
    admins: any[];
    members: any[];
    isGettingAdmins: boolean;
    isGettingMembers: boolean;
    group: any;
    isGettingGroup: boolean;
    getGroupDetailFailed: boolean;
    acceptedMemberResults: any[];
  }
  
  export type ContainerState = GroupDetailState;
  