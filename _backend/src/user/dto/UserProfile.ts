// SPDX-License-Identifier: Apache-2.0

export enum UserRole {
  Developer = "developer",
  Partner = "partner",
  CouncilMember = "council_member",
}

export interface UserProfile {
  firstName: string
  lastName: string
  role: UserRole | null
}
