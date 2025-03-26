// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref, watch, WatchStopHandle} from "vue";
import axios from "axios";
import {Timestamp} from "@/utils/Timestamp";
import {TopicMessageByTimestampCache} from "@/utils/cache/TopicMessageByTimestampCache.ts";
import {AssetCache} from "@/utils/cache/AssetCache.ts";
import {blob2URL} from "@/utils/URLUtils.ts";
import {HCSAssetCache} from "@/utils/cache/HCSAssetCache.ts";
import {HCSURI} from "@/utils/HCSURI.ts";
import {base64Decode, utf8Encode} from "@/utils/B64Utils.ts";

export interface NftAttribute {
    trait_type: string
    display_type?: string
    value: string | number | boolean
    max_value?: string | number
}

export interface NftFile {
    uri: string                       // "uri to file - REQUIRED",
    url: string                       // we compute this
    checksum: string | undefined      // "cryptographic hash of the representation of the resource the author expects to load - OPTIONAL",
    type: string                      // "mime type - REQUIRED",
    is_default_file: boolean | undefined
    metadata: string | undefined      // "metadata object - OPTIONAL",
    metadata_uri: string | undefined  // "uri to metadata - OPTIONAL"
}

export class TokenMetadataAnalyzer {

    private watchHandle: WatchStopHandle | null = null
    private metadataContentRef = ref<any>(null)

    //
    // Public
    //

    public readonly rawMetadata: Ref<string>
    public readonly ipfsGatewayPrefix: string | null
    public readonly arweaveServer: string | null

    public constructor(rawMetadata: Ref<string>, ipfsGatewayPrefix: string | null, arweaveServer: string | null = null) {
        this.rawMetadata = rawMetadata
        this.ipfsGatewayPrefix = ipfsGatewayPrefix
        this.arweaveServer = arweaveServer
    }

    public mount(): void {
        this.watchHandle = watch(
            this.rawMetadata,
            (value) => this.metadataDidChange(value),
            {
                immediate: true
            }
        )
    }

    public unmount() {
        if (this.watchHandle !== null) {
            this.watchHandle()
            this.watchHandle = null
        }
    }

    public loadSuccess = computed(() => this.loadSuccessRef.value)
    public loadError = computed(() => this.loadErrorRef.value)

    public readonly metadata = ref('')

    public metadataInfo = computed(() => {
        let result: string | null
        if (!this.loadSuccess.value && !this.loadError.value) {
            result = 'The NFT metadata property is not usable.'
        } else if (this.loadSuccess.value && !this.isHIP412.value) {
            result = 'The metadata content does not follow the schema defined in HIP 412.'
        } else {
            result = null
        }
        return result
    })

    public metadataWarning = computed(() => {
        let result: string | null
        if (this.loadError.value) {
            result = 'The metadata content could not be loaded. '
            if (this.metadata.value.startsWith('ipfs://')) {
                result += 'This might be transient due to the nature of the IPFS network. ' +
                    'Try to reload the page in a few moments.'
            }
        } else {
            result = null
        }
        return result
    })

    public isHIP412 = computed<boolean>(
        () => (this.format.value && this.format.value?.startsWith('HIP412@2'))
            || (this.name.value != null && this.image.value != null && this.type.value != null)
    )

    public metadataContent = computed<any>(() => this.metadataContentRef.value)

    public metadataString = computed<string | null>(
        () => this.metadataContent.value !== null
            ? JSON.stringify(this.metadataContent.value)
            : null
    )

    public metadataKeys = computed(
        () => this.metadataContent.value !== null
            ? Object.keys(this.metadataContent.value)
            : []
    )

    public name = computed<string | null>(() => this.getProperty('name'))
    public creator = computed<string | null>(() => this.getProperty('creator'))
    public creatorDID = computed<string | null>(() => this.getProperty('creatordid'))
    public description = computed<string | null>(() => this.getProperty('description'))
    public image = computed<string | null>(() => this.getProperty('image'))
    public checksum = computed<string | null>(() => this.getProperty('checksum'))
    public type = computed<string | null>(() => this.getProperty('type'))
    public format = computed<string | null>(() => this.getProperty('format'))

    public properties = computed<string | null>(() => {
        let result = this.getProperty('properties')
        if (result != null) {
            result = JSON.stringify(result)
            if (result === '{}') {
                result = null
            }
        }
        return result
    })

    public files = computed<NftFile[]>(() => {
        const result: NftFile[] = []
        const files = this.getProperty('files')
        if (Array.isArray(files)) {
            for (const file of files) {
                if (file.uri && file.type) { // both required by HIP-412
                    const url = blob2URL(file.uri, this.ipfsGatewayPrefix, this.arweaveServer) ?? file.uri
                    result.push({
                        uri: file.uri,
                        url: url,
                        checksum: file.checksum,
                        type: file.type,
                        is_default_file: file.is_default_file,
                        metadata: file.rawMetadata,
                        metadata_uri: file.metadata_uri
                    })
                }
            }
        }
        return result
    })

    public attributes = computed<NftAttribute[]>(() => {
        const result: NftAttribute[] = []
        const attributes = this.getProperty('attributes')
        if (Array.isArray(attributes)) {
            for (const attr of attributes) {
                if (attr.trait_type != undefined && attr.value != undefined) {
                    result.push({
                        trait_type: attr.trait_type,
                        display_type: attr.display_type,
                        value: attr.value,
                        max_value: attr.max_value
                    })
                }
            }
        }
        return result
    })

    public imageUrl = ref<string | null>(null)

    //
    // Private
    //

    private loadSuccessRef = ref(false)
    private loadErrorRef = ref(false)

    /*

        Content type       | Example syntax                                                       | See token example
        ===================+======================================================================+================================================
        IPFS URI           | "ipfs://QmSoJYWXvds2qcPeRGJdirP7YTCYvZv4fo43TadwmbvV8H"              | https://hashscan.io/mainnet/token/0.0.5679552/1
        -------------------+----------------------------------------------------------------------+------------------------------------------------
        IPFS CID           | "QmSoJYWXvds2qcPeRGJdirP7YTCYvZv4fo43TadwmbvV8H"                     |
        -------------------+----------------------------------------------------------------------+------------------------------------------------
        Arweave URI        | "ar://VkeESz5eDWA6RWn2cOYafGEvZDIgWzHi91GM3X3N7eI"                   | https://hashscan.io/mainnet/token/0.0.6096205/1
        -------------------+----------------------------------------------------------------------+------------------------------------------------
        Arweave CID        | "sFcjESRXMJmSJxuHo4f606jZgSb4Si0IPrIYD9kQfko"                        | https://hashscan.io/mainnet/token/0.0.1518294/1
        -------------------+----------------------------------------------------------------------+------------------------------------------------
        HCS-1 URL          | "hcs://1/0.0.5016827"                                                | https://hashscan.io/mainnet/token/0.0.5016839/1
        -------------------+----------------------------------------------------------------------+------------------------------------------------
        Plain HTTPS URL    | "https://fliggs-nfts-metadata.s3.us-east-2.amazonaws.com/degen.json" | https://hashscan.io/mainnet/token/0.0.6029502/1
                           | (Note this one causes a CORS error)                                  |
        -------------------+----------------------------------------------------------------------+------------------------------------------------

     */

    private async metadataDidChange(value: string | null): Promise<void> {
        const content = this.metadataContentRef
        const metadata = this.metadata
        this.loadSuccessRef.value = false
        this.loadErrorRef.value = false

        try {
            metadata.value = utf8Encode(base64Decode(value ?? ''))
        } catch {
            metadata.value = value ?? ''
        }

        if (metadata.value !== null) {
            const url = blob2URL(metadata.value, this.ipfsGatewayPrefix, this.arweaveServer)
            if (url !== null) {
                content.value = await this.readMetadataFromUrl(url)
            } else {
                const hcsUri = HCSURI.parse(metadata.value)
                if (hcsUri && hcsUri.version === '1') { // HCS-1 topic
                    content.value = await this.readMetadataFromTopic(hcsUri.topicId)
                } else if (Timestamp.parse(metadata.value) !== null) {
                    content.value = await this.readMetadataFromTimestamp(metadata.value)
                } else {
                    content.value = null
                }
            }
        } else {
            content.value = null
        }
        await this.updateImage()
    }

    private async updateImage(): Promise<void> {
        const uri = this.getProperty('image') ?? this.getProperty(('picture'))
        if (uri !== null) {
            let url = blob2URL(uri, this.ipfsGatewayPrefix, this.arweaveServer)
            if (url === null) {
                const hcsUri = HCSURI.parse(uri)
                if (hcsUri && hcsUri.version === '1') { // HCS-1 topic
                    const content = await HCSAssetCache.instance.lookup(hcsUri.topicId)
                    url = content?.getDataURL() ?? uri
                } else {
                    url = uri
                }
            }
            this.imageUrl.value = url
        } else {
            this.imageUrl.value = null
        }
    }

    private async readMetadataFromUrl(url: string): Promise<any> {
        // console.log(`readMetadataFromUrl: ${url}`)
        let result: any
        try {
            result = await AssetCache.instance.lookup(url) as any
            this.loadSuccessRef.value = true
        } catch (reason) {
            console.warn(`Failed to read metadata from URL ${url} - error: ${reason}`)
            if (axios.isAxiosError(reason)) {
                console.warn(`status: ${reason.response?.status}`)
            }
            this.loadErrorRef.value = true
            result = null
        }
        // console.log(`readMetadataFromUrl - result: ${JSON.stringify(result)}`)
        return Promise.resolve(result)
    }

    private async readMetadataFromTopic(id: string): Promise<any> {
        // console.log(`readMetadataFromTopic: ${id}`)
        let result: any
        try {
            const content = await HCSAssetCache.instance.lookup(id)
            this.loadSuccessRef.value = true
            if (content?.content) {
                result = JSON.parse(utf8Encode(new Uint8Array(content.content)))
            } else {
                result = null
            }
        } catch (reason) {
            console.warn(`Failed to read metadata from topic ${id} - reason: ${reason}`)
            this.loadErrorRef.value = true
            result = null
        }
        // console.log(`readMetadataFromTopic - result: ${JSON.stringify(result)}`)
        return Promise.resolve(result)
    }

    private async readMetadataFromTimestamp(timestamp: string): Promise<any> {
        // console.log(`readMetadataFromTimestamp: ${timestamp}`)
        let result: any
        try {
            const topicMessage = await TopicMessageByTimestampCache.instance.lookup(timestamp)
            this.loadSuccessRef.value = true
            if (topicMessage) {
                result = JSON.parse(utf8Encode(base64Decode(topicMessage.message)))
            } else {
                result = null
            }
        } catch (reason) {
            console.warn(`Failed to read metadata from timestamp ${timestamp} - reason: ${reason}`)
            this.loadErrorRef.value = true
            result = null
        }
        // console.log(`readMetadataFromTimestamp - result: ${JSON.stringify(result)}`)
        return Promise.resolve(result)
    }

    private getProperty(name: string): any | null {
        let result: string | null = null
        for (const key of this.metadataKeys.value) {
            if (key.toLowerCase() === name) {
                result = this.metadataContent.value[key]
                break
            }
        }
        return result
    }
}
