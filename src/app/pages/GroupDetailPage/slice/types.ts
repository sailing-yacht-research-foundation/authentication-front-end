import { Group, GroupMember } from "types/Group";

/* --- STATE --- */
export interface GroupDetailState {
    adminCurrentPage: number;
    adminTotal: number;
    memberCurrentPage: number;
    memberTotal: number;
    admins: GroupMember[];
    members: GroupMember[];
    isGettingAdmins: boolean;
    isGettingMembers: boolean;
    group: Partial<Group>;
    isGettingGroup: boolean;
    getGroupDetailFailed: boolean;
    acceptedMemberResults: any[];
    adminPageSize: number;
    memberPageSize: number;
  }
  
  export type ContainerState = GroupDetailState;
  