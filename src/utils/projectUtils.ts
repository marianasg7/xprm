
/**
 * Utility functions for projects
 */

/**
 * Returns the appropriate badge variant for a project status
 */
export const getStatusBadge = (status: 'planned' | 'in-progress' | 'completed') => {
  switch (status) {
    case 'planned':
      return "secondary";
    case 'in-progress':
      return "warning";
    case 'completed':
      return "success";
    default:
      return "default";
  }
};
