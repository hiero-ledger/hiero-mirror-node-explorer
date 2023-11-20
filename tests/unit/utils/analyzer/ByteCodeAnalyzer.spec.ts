// noinspection DuplicatedCode

/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {describe, test, expect} from 'vitest'
import {ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import {ByteCodeAnalyzer} from "@/utils/analyzer/ByteCodeAnalyzer";
import {IPFSCache} from "@/utils/cache/IPFSCache";

describe("ByteCodeAnalyzer.spec.ts", () => {

    test("basic flow", async () => {

        const mock = new MockAdapter(IPFSCache.instance.privateAxios)
        mock.onGet(BYTECODE1_IPFS_URL).reply(200, BYTECODE1_METADATA)

        // 1) new
        const bytecode = ref<string|null>(null)
        const analyzer = new ByteCodeAnalyzer(bytecode)
        expect(analyzer.byteCode.value).toBeNull()
        expect(analyzer.solcVersion.value).toBeNull()
        expect(analyzer.ipfsHash.value).toBeNull()
        expect(analyzer.ipfsURL.value).toBeNull()
        expect(analyzer.swarmHash.value).toBeNull()
        expect(analyzer.ipfsMetadata.value).toBeNull()

        // 2) setup with BYTECODE1
        bytecode.value = BYTECODE1
        await flushPromises()
        expect(analyzer.byteCode.value).toBe(BYTECODE1)
        expect(analyzer.solcVersion.value).toBe(BYTECODE1_COMPILER_VERSION)
        expect(analyzer.ipfsHash.value).toBe(BYTECODE1_IPFS_HASH)
        expect(analyzer.ipfsURL.value).toBe(BYTECODE1_IPFS_URL)
        expect(analyzer.swarmHash.value).toBeNull()
        expect(analyzer.ipfsMetadata.value).toBeNull()  // Because not mounted

        // 3) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.byteCode.value).toBe(BYTECODE1)
        expect(analyzer.solcVersion.value).toBe(BYTECODE1_COMPILER_VERSION)
        expect(analyzer.ipfsHash.value).toBe(BYTECODE1_IPFS_HASH)
        expect(analyzer.ipfsURL.value).toBe(BYTECODE1_IPFS_URL)
        expect(analyzer.swarmHash.value).toBeNull()
        expect(analyzer.ipfsMetadata.value).toStrictEqual(JSON.parse(BYTECODE1_METADATA))


        // 4) setup with BYTECODE2
        bytecode.value = BYTECODE2
        await flushPromises()
        expect(analyzer.byteCode.value).toBe(BYTECODE2)
        expect(analyzer.solcVersion.value).toBe(BYTECODE2_COMPILER_VERSION)
        expect(analyzer.ipfsURL.value).toBeNull()
        expect(analyzer.swarmHash.value).toBe(BYTECODE2_SWARM_HASH)
        expect(analyzer.ipfsMetadata.value).toBeNull()

        // 5) unmount
        analyzer.unmount()
        expect(analyzer.byteCode.value).toBe(BYTECODE2)
        expect(analyzer.solcVersion.value).toBe(BYTECODE2_COMPILER_VERSION)
        expect(analyzer.ipfsURL.value).toBeNull()
        expect(analyzer.swarmHash.value).toBe(BYTECODE2_SWARM_HASH)
        expect(analyzer.ipfsMetadata.value).toBeNull()

        mock.restore()
    })

})


const BYTECODE1 = "0x608060405234801561001057600080fd5b50600436106100885760003560e01c80634753b51b1161005b5780634753b51b146101135780637f6314d01461012f5780639b23d3d91461014b578063eac6f3fe1461017b57610088565b806311e1fc071461008d57806315dacbea146100bd578063341fa473146100ed5780633a04033c146100f7575b600080fd5b6100a760048036038101906100a29190610b50565b6101ab565b6040516100b49190610bd3565b60405180910390f35b6100d760048036038101906100d29190610b50565b6102c7565b6040516100e49190610bd3565b60405180910390f35b6100f56103e5565b005b610111600480360381019061010c9190610c1a565b610420565b005b61012d60048036038101906101289190610c81565b61047d565b005b61014960048036038101906101449190610c81565b6104d6565b005b61016560048036038101906101609190610b50565b61052f565b6040516101729190610bd3565b60405180910390f35b61019560048036038101906101909190610b50565b61064d565b6040516101a29190610bd3565b60405180910390f35b600080600061016773ffffffffffffffffffffffffffffffffffffffff16639b23d3d960e01b888888886040516024016101e89493929190610cdf565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516102529190610d95565b600060405180830381855af49150503d806000811461028d576040519150601f19603f3d011682016040523d82523d6000602084013e610292565b606091505b5091509150816102a35760156102b8565b808060200190518101906102b79190610de5565b5b60030b92505050949350505050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff166315dacbea60e01b888888886040516024016103049493929190610cdf565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161036e9190610d95565b6000604051808303816000865af19150503d80600081146103ab576040519150601f19603f3d011682016040523d82523d6000602084013e6103b0565b606091505b5091509150816103c15760156103d6565b808060200190518101906103d59190610de5565b5b60030b92505050949350505050565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161041790610e6f565b60405180910390fd5b600061042e85858585610769565b9050601660030b8114610476576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161046d90610edb565b60405180910390fd5b5050505050565b60006104898383610887565b9050601660030b81146104d1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c890610f47565b60405180910390fd5b505050565b60006104e2838361099f565b9050601660030b811461052a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161052190610fb3565b60405180910390fd5b505050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff16639b23d3d960e01b8888888860405160240161056c9493929190610cdf565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516105d69190610d95565b6000604051808303816000865af19150503d8060008114610613576040519150601f19603f3d011682016040523d82523d6000602084013e610618565b606091505b50915091508161062957601561063e565b8080602001905181019061063d9190610de5565b5b60030b92505050949350505050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff166315dacbea60e01b8888888860405160240161068a9493929190610cdf565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516106f49190610d95565b600060405180830381855af49150503d806000811461072f576040519150601f19603f3d011682016040523d82523d6000602084013e610734565b606091505b50915091508161074557601561075a565b808060200190518101906107599190610de5565b5b60030b92505050949350505050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff1663eca3691760e01b888888886040516024016107a69493929190610fd3565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516108109190610d95565b6000604051808303816000865af19150503d806000811461084d576040519150601f19603f3d011682016040523d82523d6000602084013e610852565b606091505b509150915081610863576015610878565b808060200190518101906108779190610de5565b5b60030b92505050949350505050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff1663099794e860e01b86866040516024016108c0929190611018565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161092a9190610d95565b6000604051808303816000865af19150503d8060008114610967576040519150601f19603f3d011682016040523d82523d6000602084013e61096c565b606091505b50915091508161097d576015610992565b808060200190518101906109919190610de5565b5b60030b9250505092915050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff166349146bde60e01b86866040516024016109d8929190611018565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050604051610a429190610d95565b6000604051808303816000865af19150503d8060008114610a7f576040519150601f19603f3d011682016040523d82523d6000602084013e610a84565b606091505b509150915081610a95576015610aaa565b80806020019051810190610aa99190610de5565b5b60030b9250505092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610ae782610abc565b9050919050565b610af781610adc565b8114610b0257600080fd5b50565b600081359050610b1481610aee565b92915050565b6000819050919050565b610b2d81610b1a565b8114610b3857600080fd5b50565b600081359050610b4a81610b24565b92915050565b60008060008060808587031215610b6a57610b69610ab7565b5b6000610b7887828801610b05565b9450506020610b8987828801610b05565b9350506040610b9a87828801610b05565b9250506060610bab87828801610b3b565b91505092959194509250565b60008160070b9050919050565b610bcd81610bb7565b82525050565b6000602082019050610be86000830184610bc4565b92915050565b610bf781610bb7565b8114610c0257600080fd5b50565b600081359050610c1481610bee565b92915050565b60008060008060808587031215610c3457610c33610ab7565b5b6000610c4287828801610b05565b9450506020610c5387828801610b05565b9350506040610c6487828801610b05565b9250506060610c7587828801610c05565b91505092959194509250565b60008060408385031215610c9857610c97610ab7565b5b6000610ca685828601610b05565b9250506020610cb785828601610b05565b9150509250929050565b610cca81610adc565b82525050565b610cd981610b1a565b82525050565b6000608082019050610cf46000830187610cc1565b610d016020830186610cc1565b610d0e6040830185610cc1565b610d1b6060830184610cd0565b95945050505050565b600081519050919050565b600081905092915050565b60005b83811015610d58578082015181840152602081019050610d3d565b60008484015250505050565b6000610d6f82610d24565b610d798185610d2f565b9350610d89818560208601610d3a565b80840191505092915050565b6000610da18284610d64565b915081905092915050565b60008160030b9050919050565b610dc281610dac565b8114610dcd57600080fd5b50565b600081519050610ddf81610db9565b92915050565b600060208284031215610dfb57610dfa610ab7565b5b6000610e0984828501610dd0565b91505092915050565b600082825260208201905092915050565b7f5468697320646973736f63696174652069732062726f6b656e00000000000000600082015250565b6000610e59601983610e12565b9150610e6482610e23565b602082019050919050565b60006020820190508181036000830152610e8881610e4c565b9050919050565b7f5472616e73666572204661696c65640000000000000000000000000000000000600082015250565b6000610ec5600f83610e12565b9150610ed082610e8f565b602082019050919050565b60006020820190508181036000830152610ef481610eb8565b9050919050565b7f446973736f6369617465204661696c6564000000000000000000000000000000600082015250565b6000610f31601183610e12565b9150610f3c82610efb565b602082019050919050565b60006020820190508181036000830152610f6081610f24565b9050919050565b7f4173736f6369617465204661696c656400000000000000000000000000000000600082015250565b6000610f9d601083610e12565b9150610fa882610f67565b602082019050919050565b60006020820190508181036000830152610fcc81610f90565b9050919050565b6000608082019050610fe86000830187610cc1565b610ff56020830186610cc1565b6110026040830185610cc1565b61100f6060830184610bc4565b95945050505050565b600060408201905061102d6000830185610cc1565b61103a6020830184610cc1565b939250505056fea264697066735822122044cb0d8cd4389a1498cf6bd7d112216a1538790b483bed3d627b71b7426e795e64736f6c63430008110033"
const BYTECODE1_COMPILER_VERSION = "0.8.17"
const BYTECODE1_IPFS_HASH = "QmSyC1mSMgNhNZuYLzMybLx1xDgpBQ9w5o2haSaMg71jQ1"
const BYTECODE1_IPFS_URL = "https://ipfs.io/ipfs/" + BYTECODE1_IPFS_HASH
const BYTECODE1_METADATA = '{"compiler":{"version":"0.8.17+commit.8df45f5f"},"language":"Solidity","output":{"abi":[{"inputs":[],"name":"brokenDissociate","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"delegateTransferFrom","outputs":[{"internalType":"int64","name":"responseCode","type":"int64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"serialNumber","type":"uint256"}],"name":"delegateTransferFromNFT","outputs":[{"internalType":"int64","name":"responseCode","type":"int64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"tokenAssociate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"tokenDissociate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenId","type":"address"},{"internalType":"address","name":"fromAccountId","type":"address"},{"internalType":"address","name":"toAccountId","type":"address"},{"internalType":"int64","name":"tokenAmount","type":"int64"}],"name":"tokenTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"int64","name":"responseCode","type":"int64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"serialNumber","type":"uint256"}],"name":"transferFromNFT","outputs":[{"internalType":"int64","name":"responseCode","type":"int64"}],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"kind":"dev","methods":{"delegateTransferFrom(address,address,address,uint256)":{"params":{"amount":"The amount of tokens to transfer from `from` to `to`","from":"The account address of the owner of the token, on the behalf of which to transfer `amount` tokens","to":"The account address of the receiver of the `amount` tokens","token":"The address of the fungible Hedera token to transfer"},"returns":{"responseCode":"The response code for the status of the request. SUCCESS is 22."}},"delegateTransferFromNFT(address,address,address,uint256)":{"params":{"from":"The account address of the owner of `serialNumber` of `token`","serialNumber":"The NFT serial number to transfer","to":"The account address of the receiver of `serialNumber`","token":"The address of the non-fungible Hedera token to transfer"},"returns":{"responseCode":"The response code for the status of the request. SUCCESS is 22."}},"transferFrom(address,address,address,uint256)":{"params":{"amount":"The amount of tokens to transfer from `from` to `to`","from":"The account address of the owner of the token, on the behalf of which to transfer `amount` tokens","to":"The account address of the receiver of the `amount` tokens","token":"The address of the fungible Hedera token to transfer"},"returns":{"responseCode":"The response code for the status of the request. SUCCESS is 22."}},"transferFromNFT(address,address,address,uint256)":{"params":{"from":"The account address of the owner of `serialNumber` of `token`","serialNumber":"The NFT serial number to transfer","to":"The account address of the receiver of `serialNumber`","token":"The address of the non-fungible Hedera token to transfer"},"returns":{"responseCode":"The response code for the status of the request. SUCCESS is 22."}}},"version":1},"userdoc":{"kind":"user","methods":{"delegateTransferFrom(address,address,address,uint256)":{"notice":"Only applicable to fungible tokens"},"delegateTransferFromNFT(address,address,address,uint256)":{"notice":"Transfers `serialNumber` of `token` from `from` to `to` using the allowance mechanism. Only applicable to NFT tokens"},"transferFrom(address,address,address,uint256)":{"notice":"Only applicable to fungible tokens"},"transferFromNFT(address,address,address,uint256)":{"notice":"Transfers `serialNumber` of `token` from `from` to `to` using the allowance mechanism. Only applicable to NFT tokens"}},"version":1}},"settings":{"compilationTarget":{"HTSv2.sol":"HTS"},"evmVersion":"london","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":false,"runs":200},"remappings":[]},"sources":{"HTSv2.sol":{"keccak256":"0xd2e8a58e779fa39eae7fb463637069f25b96bf076d50d234e3c30d3874c6d3a1","license":"Apache-2.0","urls":["bzz-raw://0c73187c03bffbe5dab6f33beb9fdaf50b9e69b526bc56b73e0393b75b965997","dweb:/ipfs/QmWQNaXji5qCgaC6SXbcgbW6RR8zHChqQtT9bB5Sn5m5Bk"]},"HederaResponseCodes.sol":{"keccak256":"0x0361e18efdf43d6b5ac136b6beaa4c943d7fe5e9b8515e5605e3a13b3e3a8177","license":"Apache-2.0","urls":["bzz-raw://d8bc2fcf2c308293f8ba791184080ab67406e973d2e3f1c70976a77f26a41752","dweb:/ipfs/QmQrC4wQ1z7GiC79FLa2rbJDqDNCqkHVf3xLq2stFtpema"]},"HederaTokenService.sol":{"keccak256":"0x49e7beb1242fe0cb86c9a8d9f8203f5129bf67da0202d9a6d6d2befa836bfe3b","license":"Apache-2.0","urls":["bzz-raw://2a913eef60a88889edeb25eafeb60b83e3a1a5d6f1e26a1f8db4177e4124adf5","dweb:/ipfs/Qmck14PhfWDM7vkebqQL9UErQYNENV7FYhyLLQbq8qigXH"]},"IHederaTokenService.sol":{"keccak256":"0x8510798a2ed2d4cfba89eb624fcdda0c69d637c5512c4386628512798c72132b","license":"Apache-2.0","urls":["bzz-raw://4b511edd0e89f39ef5c274ec30ea1d524043c9f4d349394265c69eee745c06b5","dweb:/ipfs/QmNr2VMMLrtfz5bEbwb9gAKcyvj7qRqwacErRFsDuxRUbb"]}},"version":1}'

const BYTECODE2 = "0x6080604052600436106101815760003560e01c806372f702f3116100d1578063b66503cf1161008a578063e70b9e2711610064578063e70b9e271461053e578063e9fad8ee14610579578063efa2681a1461058e578063f1229777146105cf57610181565b8063b66503cf146104bd578063bcd11014146104f6578063d07e5b281461052957610181565b806372f702f31461041557806379ba50971461042a5780637bb7bed11461043f5780638da5cb5b1461046957806391b4ded91461047e578063a694fc3a1461049357610181565b80633d18b9121161013e5780635c975abb116101185780635c975abb1461034b578063638634ee146103745780637035ab98146103a757806370a08231146103e257610181565b80633d18b912146102a757806348e5d9f8146102bc57806353a47bb71461031a57610181565b80631627540c1461018357806316c38b3c146101b657806318160ddd146101e2578063211dc32d146102095780632378bea6146102445780632e1a7d4d1461027d575b005b34801561018f57600080fd5b50610181600480360360208110156101a657600080fd5b50356001600160a01b0316610602565b3480156101c257600080fd5b50610181600480360360208110156101d957600080fd5b5035151561065e565b3480156101ee57600080fd5b506101f76106d8565b60408051918252519081900360200190f35b34801561021557600080fd5b506101f76004803603604081101561022c57600080fd5b506001600160a01b03813581169160200135166106de565b34801561025057600080fd5b506101816004803603604081101561026757600080fd5b506001600160a01b038135169060200135610791565b34801561028957600080fd5b50610181600480360360208110156102a057600080fd5b50356108b1565b3480156102b357600080fd5b50610181610afe565b3480156102c857600080fd5b506102ef600480360360208110156102df57600080fd5b50356001600160a01b0316610dd4565b6040805195865260208601949094528484019290925260608401526080830152519081900360a00190f35b34801561032657600080fd5b5061032f610e03565b604080516001600160a01b039092168252519081900360200190f35b34801561035757600080fd5b50610360610e12565b604080519115158252519081900360200190f35b34801561038057600080fd5b506101f76004803603602081101561039757600080fd5b50356001600160a01b0316610e1b565b3480156103b357600080fd5b506101f7600480360360408110156103ca57600080fd5b506001600160a01b0381358116916020013516610e47565b3480156103ee57600080fd5b506101f76004803603602081101561040557600080fd5b50356001600160a01b0316610e64565b34801561042157600080fd5b5061032f610e7f565b34801561043657600080fd5b50610181610e8e565b34801561044b57600080fd5b5061032f6004803603602081101561046257600080fd5b5035610f4a565b34801561047557600080fd5b5061032f610f71565b34801561048a57600080fd5b506101f7610f80565b34801561049f57600080fd5b50610181600480360360208110156104b657600080fd5b5035610f86565b3480156104c957600080fd5b50610181600480360360408110156104e057600080fd5b506001600160a01b038135169060200135611210565b34801561050257600080fd5b506101f76004803603602081101561051957600080fd5b50356001600160a01b03166114bf565b34801561053557600080fd5b5061032f6114f1565b34801561054a57600080fd5b506101f76004803603604081101561056157600080fd5b506001600160a01b0381358116916020013516611505565b34801561058557600080fd5b50610181611522565b34801561059a57600080fd5b50610181600480360360608110156105b157600080fd5b506001600160a01b0381351690602081013515159060400135611545565b3480156105db57600080fd5b506101f7600480360360208110156105f257600080fd5b50356001600160a01b0316611623565b61060a6116d4565b600280546001600160a01b0383166001600160a01b0319909116811790915560408051918252517f906a1c6bd7e3091ea86693dd029a831c19049ce77f1dce2ce0bab1cacbabce229181900360200190a150565b6106666116d4565b60045460ff161515811515141561067c576106d5565b6004805460ff1916821515179081905560ff161561069957426003555b6004546040805160ff90921615158252517f8fb6c181ee25a520cf3dd6565006ef91229fcfe5a989566c2a3b8c115570cec59181900360200190a15b50565b600a5490565b6001600160a01b038083166000818152600960209081526040808320948616808452948252808320549383526008825280832094835293905291822054610788919061077c90670de0b6b3a7640000906107709061074b9061073f89611623565b9063ffffffff61171d16565b6001600160a01b0389166000908152600b60205260409020549063ffffffff61177a16565b9063ffffffff6117d316565b9063ffffffff61183d16565b90505b92915050565b6107996116d4565b6001600160a01b0382166000908152600660205260409020544211610805576040805162461bcd60e51b815260206004820152601a60248201527f52657761726420706572696f64207374696c6c20616374697665000000000000604482015290519081900360640190fd5b6000811161085a576040805162461bcd60e51b815260206004820181905260248201527f526577617264206475726174696f6e206d757374206265206e6f6e2d7a65726f604482015290519081900360640190fd5b6001600160a01b038216600081815260066020908152604091829020600201849055815184815291517fad2f86b01ed93b4b3a150d448c61a4f5d8d38075d3c0c64cc0a26fd6e1f495459281900390910190a25050565b600080546001018082559033905b6007548110156109a4576000600782815481106108d857fe5b6000918252602090912001546001600160a01b031690506108f881611623565b6001600160a01b03821660009081526006602052604090206004015561091d81610e1b565b6001600160a01b0380831660009081526006602052604090206003019190915583161561099b5761094e83826106de565b6001600160a01b0380851660008181526009602090815260408083209487168084529482528083209590955560068152848220600401549282526008815284822093825292909252919020555b506001016108bf565b50600083116109ee576040805162461bcd60e51b8152602060048201526011602482015270043616e6e6f74207769746864726177203607c1b604482015290519081900360640190fd5b600a54610a01908463ffffffff61171d16565b600a55336000908152600b6020526040902054610a24908463ffffffff61171d16565b336000818152600b6020526040902091909155600554610a50916001600160a01b039091169085611897565b336000818152600b602090815260409182902054600a548351888152928301919091528183015290517f75e161b3e824b114fc1a33274bd7091918dd4e639cede50b78b15a4eea956a219181900360600190a2506000548114610afa576040805162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015290519081900360640190fd5b5050565b600080546001018082559033905b600754811015610bf157600060078281548110610b2557fe5b6000918252602090912001546001600160a01b03169050610b4581611623565b6001600160a01b038216600090815260066020526040902060040155610b6a81610e1b565b6001600160a01b03808316600090815260066020526040902060030191909155831615610be857610b9b83826106de565b6001600160a01b0380851660008181526009602090815260408083209487168084529482528083209590955560068152848220600401549282526008815284822093825292909252919020555b50600101610b0c565b5060005b600754811015610d7c57600060078281548110610c0e57fe5b60009182526020808320909101543383526009825260408084206001600160a01b03909216808552919092529120549091508015610d72573360009081526009602090815260408083206001600160a01b0386811680865291909352908320929092556004546101009004161415610d2657600460019054906101000a90046001600160a01b03166001600160a01b0316632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b158015610cdb57600080fd5b505af1158015610cef573d6000803e3d6000fd5b505060405133925083156108fc02915083906000818181858888f19350505050158015610d20573d6000803e3d6000fd5b50610d31565b610d31823383611897565b6040805182815290516001600160a01b0384169133917f540798df468d7b23d11f156fdb954cb19ad414d150722a7b6d55ba369dea792e9181900360200190a35b5050600101610bf5565b505060005481146106d5576040805162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015290519081900360640190fd5b600660205260009081526040902080546001820154600283015460038401546004909401549293919290919085565b6002546001600160a01b031681565b60045460ff1681565b6001600160a01b038116600090815260066020526040812054610e3f904290611a01565b90505b919050565b600860209081526000928352604080842090915290825290205481565b6001600160a01b03166000908152600b602052604090205490565b6005546001600160a01b031681565b6002546001600160a01b03163314610ed75760405162461bcd60e51b8152600401808060200182810382526035815260200180611d3a6035913960400191505060405180910390fd5b600154600254604080516001600160a01b03938416815292909116602083015280517fb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c9281900390910190a160028054600180546001600160a01b03199081166001600160a01b03841617909155169055565b60078181548110610f5757fe5b6000918252602090912001546001600160a01b0316905081565b6001546001600160a01b031681565b60035481565b600080546001019081905560045460ff1615610fd35760405162461bcd60e51b815260040180806020018281038252603c815260200180611de2603c913960400191505060405180910390fd5b3360005b6007548110156110bc57600060078281548110610ff057fe5b6000918252602090912001546001600160a01b0316905061101081611623565b6001600160a01b03821660009081526006602052604090206004015561103581610e1b565b6001600160a01b038083166000908152600660205260409020600301919091558316156110b35761106683826106de565b6001600160a01b0380851660008181526009602090815260408083209487168084529482528083209590955560068152848220600401549282526008815284822093825292909252919020555b50600101610fd7565b5060008311611103576040805162461bcd60e51b815260206004820152600e60248201526d043616e6e6f74207374616b6520360941b604482015290519081900360640190fd5b600a54611116908463ffffffff61183d16565b600a55336000908152600b6020526040902054611139908463ffffffff61183d16565b336000818152600b6020526040902091909155600554611166916001600160a01b03909116903086611a17565b336000818152600b602090815260409182902054600a548351888152928301919091528183015290517fb4caaf29adda3eefee3ad552a8e85058589bf834c7466cae4ee58787f70589ed9181900360600190a2506000548114610afa576040805162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015290519081900360640190fd5b6112186116d4565b6000805b6007548110156113015760006007828154811061123557fe5b6000918252602090912001546001600160a01b0316905061125581611623565b6001600160a01b03821660009081526006602052604090206004015561127a81610e1b565b6001600160a01b038083166000908152600660205260409020600301919091558316156112f8576112ab83826106de565b6001600160a01b0380851660008181526009602090815260408083209487168084529482528083209590955560068152848220600401549282526008815284822093825292909252919020555b5060010161121c565b5061130e83333085611a17565b6001600160a01b038316600090815260066020526040902054421061137b576001600160a01b03831660009081526006602052604090206002015461135a90839063ffffffff6117d316565b6001600160a01b038416600090815260066020526040902060010155611427565b6001600160a01b0383166000908152600660205260408120546113a4904263ffffffff61171d16565b6001600160a01b038516600090815260066020526040812060010154919250906113d590839063ffffffff61177a16565b6001600160a01b03861660009081526006602052604090206002015490915061140890610770868463ffffffff61183d16565b6001600160a01b03861660009081526006602052604090206001015550505b6001600160a01b0383166000908152600660205260409020426003820181905560029091015461145d919063ffffffff61183d16565b6001600160a01b038416600081815260066020908152604091829020938455600290930154815186815293840152805191927f6a6f77044107a33658235d41bedbbaf2fe9ccdceb313143c947a5e76e1ec8474929081900390910190a2505050565b6001600160a01b03811660009081526006602052604081206002810154600190910154610e3f9163ffffffff61177a16565b60045461010090046001600160a01b031681565b600960209081526000928352604080842090915290825290205481565b336000908152600b602052604090205461153b906108b1565b611543610afe565b565b61154d6116d4565b6001600160a01b0383166000908152600660205260409020600201541561157357600080fd5b60078054600181019091557fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c6880180546001600160a01b0319166001600160a01b038516908117909155600090815260066020526040902060020181905581156115df576115df83611b74565b6040805182815290516001600160a01b038516917fb699c308f630d19d8c99ef42ca60f48923a95b6a97304530785ab018de813f44919081900360200190a2505050565b6000600a546000141561165257506001600160a01b038116600090815260066020526040902060040154610e42565b600a546001600160a01b03831660009081526006602052604090206001810154600390910154610e3f926116ac92909161077091670de0b6b3a7640000916116a09190829061073f8b610e1b565b9063ffffffff61177a16565b6001600160a01b0384166000908152600660205260409020600401549063ffffffff61183d16565b6001546001600160a01b031633146115435760405162461bcd60e51b815260040180806020018281038252602f815260200180611d6f602f913960400191505060405180910390fd5b600082821115611774576040805162461bcd60e51b815260206004820152601e60248201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604482015290519081900360640190fd5b50900390565b6000826117895750600061078b565b8282028284828161179657fe5b04146107885760405162461bcd60e51b8152600401808060200182810382526021815260200180611d9e6021913960400191505060405180910390fd5b6000808211611829576040805162461bcd60e51b815260206004820152601a60248201527f536166654d6174683a206469766973696f6e206279207a65726f000000000000604482015290519081900360640190fd5b600082848161183457fe5b04949350505050565b600082820183811015610788576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b178152925182516000946060949389169392918291908083835b602083106119145780518252601f1990920191602091820191016118f5565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611976576040519150601f19603f3d011682016040523d82523d6000602084013e61197b565b606091505b50915091508180156119a95750805115806119a957508080602001905160208110156119a657600080fd5b50515b6119fa576040805162461bcd60e51b815260206004820152601e60248201527f4d554c54495f524557415244533a205452414e534645525f4641494c45440000604482015290519081900360640190fd5b5050505050565b6000818310611a105781610788565b5090919050565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180516001600160e01b03166323b872dd60e01b17815292518251600094606094938a169392918291908083835b60208310611a9c5780518252601f199092019160209182019101611a7d565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611afe576040519150601f19603f3d011682016040523d82523d6000602084013e611b03565b606091505b5091509150818015611b31575080511580611b315750808060200190516020811015611b2e57600080fd5b50515b611b6c5760405162461bcd60e51b8152600401808060200182810382526023815260200180611dbf6023913960400191505060405180910390fd5b505050505050565b604080513060248201526001600160a01b03831660448083019190915282518083039091018152606490910182526020810180516001600160e01b031663248a35ef60e11b17815291518151600093606093610167939092909182918083835b60208310611bf35780518252601f199092019160209182019101611bd4565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611c55576040519150601f19603f3d011682016040523d82523d6000602084013e611c5a565b606091505b509150915081611cb1576040805162461bcd60e51b815260206004820152601e60248201527f48545320507265636f6d70696c653a2043414c4c5f455843455054494f4e0000604482015290519081900360640190fd5b6000818060200190516020811015611cc857600080fd5b505190506016600382900b1480611ce257508060030b60a7145b611d33576040805162461bcd60e51b815260206004820152601a60248201527f48545320507265636f6d70696c653a2043414c4c5f4552524f52000000000000604482015290519081900360640190fd5b5050505056fe596f75206d757374206265206e6f6d696e61746564206265666f726520796f752063616e20616363657074206f776e6572736869704f6e6c792074686520636f6e7472616374206f776e6572206d617920706572666f726d207468697320616374696f6e536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f774d554c54495f524557415244533a205452414e534645525f46524f4d5f4641494c45445468697320616374696f6e2063616e6e6f7420626520706572666f726d6564207768696c652074686520636f6e747261637420697320706175736564a265627a7a723158204dc2b7376386b22f92d73b9bc3fb82c8be46043738263e48098519a4a3a9a8b464736f6c63430005110032"
const BYTECODE2_COMPILER_VERSION = "0.5.17"
const BYTECODE2_SWARM_HASH = "0x4dc2b7376386b22f92d73b9bc3fb82c8be46043738263e48098519a4a3a9a8b4"
