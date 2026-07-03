// middlewares/role.ts
export const checkCompanyAccess = (user: any, companyId: string) => {
  // Super admin peut accéder à toutes les entreprises
  if (user.role === "super_admin") return true;
  
  // Les autres utilisateurs ne peuvent accéder qu'à leur entreprise
  return user.companyId === companyId;
};

export const checkUserAccess = (user: any, userId: string) => {
  // Super admin peut accéder à tous les utilisateurs
  if (user.role === "super_admin") return true;
  
  // Admin peut accéder aux utilisateurs de son entreprise
  if (user.role === "admin") return user.companyId === user.companyId;
  
  // Un utilisateur ne peut accéder qu'à lui-même
  return user.id === userId;
};