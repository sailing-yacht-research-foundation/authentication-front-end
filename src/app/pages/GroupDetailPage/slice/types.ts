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
  }
  
  export type ContainerState = GroupDetailState;
  