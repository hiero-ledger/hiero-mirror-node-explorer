// SPDX-License-Identifier: Apache-2.0

import axios from "axios";

import {User} from "@common/user/User.ts";

export class BackendClient {

    private readonly privateAxios = axios.create({withCredentials: true})


    public constructor(private readonly backendURL: string) {}


    //
    //
    //

    public async fetchCurrentUser() : Promise<User> {
        const r = await this.privateAxios.get<User>(
            this.backendURL + "api/v1/user/current",
            {withCredentials: true})
        return Promise.resolve(r.data)
    }

    public async signIn(email: string, password: string): Promise<User> {
        let result: User
        try {
            const r = await this.privateAxios.post<User>(
                this.backendURL + "api/v1/auth/signIn",
                { email, password }
            )
            result = r.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                throw new IncorrectEmailOrPasswordError();
            } else {
                throw error
            }
        }

        return Promise.resolve(result)
    }

    public async signOff(): Promise<void> {
        await this.privateAxios.delete(this.backendURL + "api/v1/auth/signOff")
    }

    //
    // Bookmarks
    //

    // public async listEntityBookmarks(network: string): Promise<EntityBookmark[]> {
    //     const r = await this.privateAxios.get<EntityBookmark[]>(
    //         this.backendURL + "api/bookmark/" + network,
    //         {withCredentials: true})
    //     return r.data;
    // }
    //
    // public async writeBookmark(network: string, entityId: string, newBookmark: NewEntityBookmark): Promise<EntityBookmark> {
    //     const r = await this.privateAxios.put<NewEntityBookmark, AxiosResponse<EntityBookmark>>(
    //         this.backendURL + "api/bookmark/" + network + "/" + entityId,
    //         newBookmark,
    //         {withCredentials: true})
    //     return Promise.resolve(r.data)
    // }
    //
    // public async clearBookmark(network: string, entityId: string): Promise<void> {
    //     await this.privateAxios.delete(this.backendURL + "api/bookmark/" + network + "/" + entityId)
    // }

}

export class IncorrectEmailOrPasswordError extends Error {}

