import { apiClient } from "./client.js";

export async function getMyOrganization() {
  const { data } = await apiClient.get("/organizations/me");
  return data.organization;
}

export async function listMembers(orgId) {
  const { data } = await apiClient.get(`/organizations/${orgId}/members`);
  return data.members;
}

export async function addCounselor(orgId, payload) {
  const { data } = await apiClient.post(`/organizations/${orgId}/members`, {
    ...payload,
    role: "org_counselor",
  });
  return data.user;
}

export async function listCounselors(orgId) {
  const { data } = await apiClient.get(`/organizations/${orgId}/members`, {
    params: { role: "org_counselor" },
  });
  return data.members;
}

export async function updateMember(orgId, userId, payload) {
  const { data } = await apiClient.patch(`/organizations/${orgId}/members/${userId}`, payload);
  return data.user;
}

export async function deactivateMember(orgId, userId) {
  const { data } = await apiClient.delete(`/organizations/${orgId}/members/${userId}`);
  return data;
}
