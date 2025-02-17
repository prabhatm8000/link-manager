// jwt
export const jwtConfig = {
    jwtTokenExpires: 3 * 24 * 60 * 60 * 1000, // 3 days
};

// cookies
export const authCookieConfig = {
    authCookieName: "auth-cookie",
    httpOnly: true,
    secure: true,
    sameSite: "strict" as "strict" | "lax" | "none",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};

export const otpCookieConfig = {
    otpCookieName: "otp-cookie",
    httpOnly: true,
    secure: true,
    sameSite: "strict" as "strict" | "lax" | "none",
    maxAge: 5 * 60 * 1000, // 5 minutes
}

// otp
export const otpConfig = {
    size: 6,
    expiresAt: 5 * 60 * 1000, // 5 minutes
};
