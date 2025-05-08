"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotaFor = exports.prices = exports.QUOTA_LIMITS = exports.subscriptionTiers = void 0;
exports.subscriptionTiers = {
    FREE: "FREE",
    BASIC: "BASIC",
    PREMIUM: "PREMIUM",
};
exports.QUOTA_LIMITS = {
    [exports.subscriptionTiers.FREE]: {
        WORKSPACES: 2,
        LINKS: 5,
        EVENT_CAPTURE: 3000,
        PEOPLE: 10,
    },
    [exports.subscriptionTiers.BASIC]: {
        WORKSPACES: 4,
        LINKS: 7,
        EVENT_CAPTURE: 10000,
        PEOPLE: 10,
    },
    [exports.subscriptionTiers.PREMIUM]: {
        WORKSPACES: 7,
        LINKS: 12,
        EVENT_CAPTURE: 30000,
        PEOPLE: 10,
    },
};
exports.prices = {
    [exports.subscriptionTiers.FREE]: [
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
    [exports.subscriptionTiers.BASIC]: [
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
    [exports.subscriptionTiers.PREMIUM]: [
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
};
/**
 *
 * @param entity
 * @param tier - optional, defaults to FREE
 * @returns
 */
const getQuotaFor = (entity, tier) => exports.QUOTA_LIMITS[tier || "FREE"][entity];
exports.getQuotaFor = getQuotaFor;
