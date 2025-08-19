// SPDX-License-Identifier: Apache-2.0

export interface User {
    userId: string
    email: string
    firstName: string
    lastName: string
    role?: UserRole
}

export const enum UserRole {
    Developer,
    Partner,
    CouncilMember,
}
