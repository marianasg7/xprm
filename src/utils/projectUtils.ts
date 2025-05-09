
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
      return "secondary"; // Changed from "warning" to "secondary" for compatibility
    case 'completed':
      return "secondary"; // Changed from "success" to "secondary" for compatibility
    default:
      return "default";
  }
};

/**
 * Returns the appropriate badge variant for a payment status
 */
export const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return "secondary"; // Changed from "success" to "secondary" for compatibility
    case 'pending':
      return "secondary";
    case 'failed':
      return "destructive";
    case 'refunded':
      return "outline";
    default:
      return "default";
  }
};

/**
 * Returns the appropriate badge variant for a delivery status
 */
export const getDeliveryStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return "secondary"; // Changed from "success" to "secondary" for compatibility
    case 'pending':
      return "secondary";
    case 'failed':
      return "destructive";
    default:
      return "default";
  }
};
