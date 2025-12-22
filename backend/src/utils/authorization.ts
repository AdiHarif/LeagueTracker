import { prisma } from '../config.js';
import type { UserPrivileges } from '../generated/prisma/enums.js';

/**
 * Check if the current user is an admin or the owner of a specific league
 * @param userId - The ID of the user to check
 * @param userPrivileges - The privileges of the user
 * @param leagueId - The ID of the league to check ownership
 * @returns Promise<boolean> - true if user is admin or league owner
 */
export const isAdminOrLeagueOwner = async (
  userId: number,
  userPrivileges: UserPrivileges,
  leagueId: number
): Promise<boolean> => {
  // Admins can do anything
  if (userPrivileges === 'ADMIN') {
    return true;
  }

  // Check if user owns the league
  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    select: { ownerId: true },
  });

  return league?.ownerId === userId;
};
