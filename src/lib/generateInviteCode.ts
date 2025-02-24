export const generateInviteCode = () : string => {
  const inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return inviteCode;
}