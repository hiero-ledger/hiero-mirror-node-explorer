// SPDX-License-Identifier: Apache-2.0

import axios from "axios";

export namespace Portal {

    //
    // Public (interface)
    //

    export enum UserRole {
        Developer = "developer",
        Partner = "partner",
        CouncilMember = "council_member",
    }

    export interface UserProfile {
        firstName: string;
        lastName: string;
        role: UserRole;
    }

    export interface User {
        userId: string;
        email: string;
        profile?: UserProfile;
    }

    export interface Session {
        user: User;
    }

    export interface NewSession extends Session {
        token: string;
    }

    export class IncorrectEmailOrPasswordError extends Error {}


    //
    // Public (Client)
    //

    export class Client {

        public constructor(private readonly portalURL: string) {}


        public async fetchCurrentSession() : Promise<Session> {
            const r = await privateAxios.get<Session>(this.portalURL + "api/session/current");
            return r.data;
        }

        public async createSession(email: string, password: string, recaptchaToken: string): Promise<NewSession> {
            let result: NewSession
            try {
                const r = await privateAxios.post<NewSession>(
                    this.portalURL + "api/session",
                    { email, password, token: recaptchaToken }
                )
                result = r.data
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    throw new IncorrectEmailOrPasswordError();
                } else {
                    throw error
                }
            }

            return result
        }

        public async destroyCurrentSession(): Promise<void> {
            await privateAxios.delete<Session>(this.portalURL + "api/session/current")
        }

    }

    //
    // Private
    //

    const privateAxios = axios.create()

}

