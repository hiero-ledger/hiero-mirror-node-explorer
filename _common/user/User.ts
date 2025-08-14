// SPDX-License-Identifier: Apache-2.0

import {UserProfile} from "./UserProfile";

export interface User {
    userId: string;
    email: string;
    profile: UserProfile|null;
}
