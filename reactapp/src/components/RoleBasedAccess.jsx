import React from 'react';

const RoleBasedAccess = ({ allowedRoles, userRole, children, fallback = null }) => {
  const hasAccess = () => {
    if (!userRole) return false;
    if (userRole === 'ADMIN') return true;
    return allowedRoles.includes(userRole);
  };

  return hasAccess() ? children : fallback;
};

export default RoleBasedAccess;