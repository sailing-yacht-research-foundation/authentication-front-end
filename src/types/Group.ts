export interface Group {
    id: string;
    groupName: string;
    groupType?: string;
    visibility: string;
    description?: string;
    createdById: string;
    groupImage?: string;
    stripeConnectedAccountId: string;
    stripeChargesEnabled?: any;
    stripePayoutsEnabled?: any;
    tosAcceptance?: any;
    createdAt: Date;
    updatedAt: Date;
    memberCount: number;
    groupMemberId: string;
    status: string;
    isAdmin: boolean;
}

export interface GroupMember {
    id: string;
    groupId: string;
    userId: string;
    joinDate: Date;
    isAdmin: boolean;
    email: string;
    status: string;
    invitorId?: string;
    createdAt: Date;
    updatedAt: Date;
    member: Member;
}

export interface Member {
    id: string;
    name: string;
    avatar?: string;
}
