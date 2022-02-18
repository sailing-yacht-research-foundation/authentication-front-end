import { Profile } from "./Profile";

export interface Vessel {
    id: string;
    vesselId: string;
    globalId: string;
    lengthInMeters: number;
    publicName: string;
    orcJsonPolars?: any;
    scope?: any;
    bulkCreated: boolean;
    model: string;
    widthInMeters?: number;
    draftInMeters?: number;
    handicap: any;
    source?: any;
    vesselType: string;
    photo?: any;
    hullsCount: number;
    hullDiagram: any;
    deckPlan: any;
    sailNumber: string;
    callSign: string;
    mmsi: string;
    onboardPhone: string;
    isVerifiedOnboardPhone: boolean;
    satelliteNumber: string;
    isVerifiedSatelliteNumber: boolean;
    onboardEmail: string;
    isVerifiedOnboardEmail: boolean;
    ssbTransceiver: string;
    deckColor: string;
    hullColorAboveWaterline: string;
    hullColorBelowWaterline: string;
    hullNumber: string;
    rigging: string;
    homeport: string;
    marinaPhoneNumber: string;
    epirbHexId: string;
    equipmentManualPdfs: Vessel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdById: string;
    updatedById: string;
    developerId: string;
    editors: Profile[];
    groupEditors: any[];
    createdBy: Profile;
    updatedBy: Profile;
}

export interface VesselPDF {
    radar?: string;
    instrumentSystem?: string;
    edcis?: string;
    ssb?: string;
    vhf?: string;
    pactorModem?: string;
    waterMaker?: string;
    generator?: string;
    electricalDistributionSystem?: string;
    engine?: string;
}