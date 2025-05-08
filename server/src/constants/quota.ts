export const subscriptionTiers = {
    FREE: "FREE",
    BASIC: "BASIC",
    PREMIUM: "PREMIUM",
} as const;

export type SubscriptionTiers =
    (typeof subscriptionTiers)[keyof typeof subscriptionTiers];

export const QUOTA_LIMITS = {
    [subscriptionTiers.FREE]: {
        WORKSPACES: 2,
        LINKS: 5,
        EVENT_CAPTURE: 3000,
        PEOPLE: 10,
    },
    [subscriptionTiers.BASIC]: {
        WORKSPACES: 4,
        LINKS: 7,
        EVENT_CAPTURE: 10000,
        PEOPLE: 10,
    },
    [subscriptionTiers.PREMIUM]: {
        WORKSPACES: 7,
        LINKS: 12,
        EVENT_CAPTURE: 30000,
        PEOPLE: 10,
    },
} as const;

export const prices = {
    [subscriptionTiers.FREE]: [
        {
            currency: "USD",
            amount: 0,
            per: "month",
        },
        {
            currency: "INR",
            amount: 0,
            per: "month",
        },
    ],
    [subscriptionTiers.BASIC]: [
        {
            currency: "USD",
            amount: 3.99,
            per: "month",
        },
        {
            currency: "INR",
            amount: 129.0,
            per: "month",
        },
    ],
    [subscriptionTiers.PREMIUM]: [
        {
            currency: "USD",
            amount: 5.49,
            per: "month",
        },
        {
            currency: "INR",
            amount: 189.0,
            per: "month",
        },
    ],
} as const;

/**
 * 
 * @param entity 
 * @param tier - optional, defaults to FREE
 * @returns 
 */
export const getQuotaFor = (entity: keyof typeof QUOTA_LIMITS[SubscriptionTiers], tier?: SubscriptionTiers) => QUOTA_LIMITS[tier || "FREE"][entity];