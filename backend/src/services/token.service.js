
import prisma from "../prisma.js";
 
/**
 * Store a new refresh token record
 */
export const saveRefreshToken = async ({ userId, tokenHash, csrfToken, userAgent, ipAddress }) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
 
    return prisma.refreshToken.create({
        data: {
            tokenHash,
            userId,
            csrfToken,
            expiresAt,
            userAgent,
            ipAddress,
        },
    });
};
 
/**
 * Find a refresh token record by its hash
 */
export const findRefreshToken = async (tokenHash) => {
    return prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
    });
};
 
/**
 * Delete a single refresh token (logout)
 */
export const deleteRefreshToken = async (tokenHash) => {
    return prisma.refreshToken.deleteMany({
        where: { tokenHash },
    });
};
 
/**
 * Delete ALL refresh tokens for a user (logout everywhere)
 */
export const deleteAllUserRefreshTokens = async (userId) => {
    return prisma.refreshToken.deleteMany({
        where: { userId },
    });
};
 
/**
 * Rotate: delete old token hash, save new one atomically
 */
export const rotateRefreshToken = async ({ oldTokenHash, userId, newTokenHash, csrfToken, userAgent, ipAddress }) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
 
    return prisma.$transaction([
        prisma.refreshToken.deleteMany({ where: { tokenHash: oldTokenHash } }),
        prisma.refreshToken.create({
            data: {
                tokenHash: newTokenHash,
                userId,
                csrfToken,
                expiresAt,
                userAgent,
                ipAddress,
            },
        }),
    ]);
};
 
/**
 * Cleanup: remove expired tokens (run as a cron job)
 * Note: for maning clean up need to implement some logic on the app.js for auto cleanup.
 * when the db and other services are running properly. 
 */
export const deleteExpiredTokens = async () => {
    return prisma.refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });
};