export interface OrganizationPayout {
    stripeConnectedAccountId: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    tosAcceptance: TosAcceptance;
}

export interface TosAcceptance {
    date: number;
}