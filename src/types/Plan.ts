export interface Plan {
    tierCode:    string;
    tierName:    string;
    description: string;
    productId:   string;
    pricings:    Pricing[];
}

export interface Pricing {
    id:        string;
    currency:  string;
    amount:    number;
    product:   string;
    recurring: Recurring;
}

export interface Recurring {
    interval:      string;
    intervalCount: number;
    usageType:     string;
}
