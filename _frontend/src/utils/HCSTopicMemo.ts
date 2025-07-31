// SPDX-License-Identifier: Apache-2.0

export class HCSTopicMemo {
    public constructor(
        public readonly hash: string,
        public readonly algo: string,
        public readonly encoding: string
    ) {
    }

    public static parse(memo: string): HCSTopicMemo | null {
        const SHA256_REGEX = /^[A-Fa-f0-9]{64}$/;

        let result: HCSTopicMemo | null
        if (memo !== "") {
            const parts = memo.split(':')
            if (
                parts.length === 3
                && parts[0].length > 0
                && parts[1].length > 0
                && parts[2].length > 0
                && parts[0].match(SHA256_REGEX)
            ) {
                result = new HCSTopicMemo(parts[0], parts[1], parts[2],)
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    }
}
