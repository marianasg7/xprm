
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

/**
 * Returns the appropriate badge variant for a payment status
 */
export const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return "success";
    case 'pending':
      return "warning";
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
      return "success";
    case 'pending':
      return "warning";
    case 'failed':
      return "destructive";
    default:
      return "default";
  }
};

