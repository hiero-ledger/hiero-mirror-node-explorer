// SPDX-License-Identifier: Apache-2.0

import axios, {AxiosResponse} from "axios";
import type { Hbar } from "@hashgraph/sdk";

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
        role: UserRole|null;
    }

    export interface User {
        userId: string;
        email: string;
        profile: UserProfile|null;
    }

    export interface Session {
        user: User;
    }

    export interface NewSession extends Session {
        token: string;
    }

    export enum AccountNetwork {
        Testnet = "testnet",
        Previewnet = "previewnet",
    }

    export enum AccountKeyType {
        Ed25519 = "ed25519",
        Ecdsa = "ecdsa",
    }

    export interface Account {
        realm: string;
        shard: string;
        accountNum?: string;

        keyType: AccountKeyType;
        privateKey: string;
        publicKey: string;

        network: AccountNetwork;

        /**
         * Timestamp (UNIX nano) of the last time
         * this account was disbursed HBAR.
         * NULL until initial disbursement.
         */
        lastDisbursementAt?: string;

        /** Whether this account is scheduled to be disbursed. */
        scheduledForDisbursement?: boolean;
        autoScheduledForDisbursement?: true;

        balanceLimit: string;
        balance?: Hbar;
    }

    export interface ListAccountResponse {
        accounts: Account[];
        // NOTE: no next link because users may only have a maximum
        //  of 4 accounts at this time
    }

    export interface NewEntityBookmark {
        name: string;
        type: string | null;
        description: string | null;
        website: string | null;

        networkEpoch: string;
        entityType: string;
        publicKey: string | null;
    }

    export interface EntityBookmark extends NewEntityBookmark {
        entityId: string;
        createdAt: string;
        updatedAt: string;
    }


    export class IncorrectEmailOrPasswordError extends Error {}


    //
    // Public (Client)
    //

    export class Client {

        private readonly privateAxios = axios.create({withCredentials: true})


        public constructor(private readonly portalURL: string) {}


        //
        // Session
        //

        public async fetchCurrentSession() : Promise<Session> {
            const r = await this.privateAxios.get<Session>(
                this.portalURL + "api/session/current",
            {withCredentials: true});
            return r.data;
        }

        public async createSession(email: string, password: string, recaptchaToken: string): Promise<NewSession> {
            let result: NewSession
            try {
                const r = await this.privateAxios.post(
                    this.portalURL + "api/session",
                    { email, password, recaptchaToken }
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
            await this.privateAxios.delete<Session>(this.portalURL + "api/session/current")
        }

        //
        // Accounts
        //

        public async listAccounts(): Promise<Account[]> {
            const r = await this.privateAxios.get<ListAccountResponse>(
                this.portalURL + "api/account",
                {withCredentials: true})
            return r.data.accounts
        }

        //
        // Bookmarks
        //

        public async listEntityBookmarks(network: string): Promise<EntityBookmark[]> {
            const r = await this.privateAxios.get<EntityBookmark[]>(
                this.portalURL + "api/bookmark/" + network,
                {withCredentials: true})
            return r.data;
        }

        public async writeBookmark(network: string, entityId: string, newBookmark: NewEntityBookmark): Promise<EntityBookmark> {
            const r = await this.privateAxios.put<NewEntityBookmark, AxiosResponse<EntityBookmark>>(
                this.portalURL + "api/bookmark/" + network + "/" + entityId,
                newBookmark,
                {withCredentials: true})
            return Promise.resolve(r.data)
        }

        public async clearBookmark(network: string, entityId: string): Promise<void> {
            await this.privateAxios.delete(this.portalURL + "api/bookmark/" + network + "/" + entityId)
        }
    }

}

