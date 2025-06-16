// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Mirror Explorer Routes">

    <DashboardCardV2>
      <template #title>
        Mirror Explorer Routes
      </template>
      <template #content>
        <div
            class="route"
            v-for="(route, index) of routes"
            :key="index"
            @click="handleClick(index)">
          <div class="trigger">
            <span>{{ route.title }}</span>
            <div class="route-subtitle">
              <StringValue :string-value="route.subtitle"/>
              <ChevronUp v-if="isOpen.includes(index)"/>
              <ChevronDown v-if="!isOpen.includes(index)"/>
            </div>
          </div>
          <hr v-if="isOpen.includes(index)" class="horizontal-line">
          <div v-if="isOpen.includes(index)" class="route-content">
            {{ route.description }}
            <div v-if="route.data" class="route-data">
              Data Displayed:
              <div class="route-data-items">
                <div v-for="d of route.data" :key="d">
                  {{ d }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<script setup lang="ts">

import {ref} from "vue";
import StringValue from "@/components/values/StringValue.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ChevronDown, ChevronUp} from 'lucide-vue-next';

const cryptoName = CoreConfig.inject().cryptoName

const isOpen = ref<number[]>([])

const handleClick = (item: number) => {
  const index = isOpen.value.indexOf(item)
  if (index >= 0) {
    isOpen.value.splice(index, 1)
  } else {
    isOpen.value.push(item)
  }
}

const routes = ref([
  {
    title: "/{network}/home",
    subtitle: "Dashboard",
    description: `Displays general information about ${cryptoName} and tables showing recent transfers, contract calls, and HCS messages.`,
    data: [
      cryptoName + " Price",
      cryptoName + " Market Cap",
      cryptoName + " Released",
      cryptoName + " Total",
      "Recent Cypto Transfers",
      "Recent Smart Contract Calls",
      "Recent HCS Messages",
    ]
  },
  {
    title: "/{network}/transaction/{transactionTimestampOrHash}",
    subtitle: "Transaction details",
    description: "Displays details of transaction with the given timestamp.",
    data: [
      "Type",
      "Consensus at",
      "Transaction Hash",
      "Block",
      "Node Submitted To",
      "Memo",
      "Topic ID",
      "Payer Account",
      "Charged Fee",
      "Max Fee",
      "Valid Duration",
      "Transaction Nonce",
      "Scheduled",
      cryptoName + " Transfers",
      "Additional data is displayed based on transaction type"
    ]
  },
  {
    title: "/{network}/account/{accountId}",
    subtitle: "Account Details",
    description: "Displays details of transaction with the given account ID.",
    data: [
      "Account ID",
      "EVM Address",
      "Balances",
      "Staked To",
      "Pending Rewards",
      "Memo",
      "Create Transaction",
      "Expires at",
      "Auto Renew Period",
      "Max. Auto. Association",
      "Receiver Sig. Required",
      "Admin Key",
      "Ethereum Nonce",
      "Recent Transactions",
      "Allowances",
      "Recent Staking Rewards"
    ]
  },
  {
    title: "/{network}/address/{accountAddress}",
    subtitle: "Account Details by Address",
    description: "Displays details of transaction with the given account address.",
    data: [
      "Account ID",
      "EVM Address",
      "Balances",
      "Staked To",
      "Pending Rewards",
      "Memo",
      "Create Transaction",
      "Expires at",
      "Auto Renew Period",
      "Max. Auto. Association",
      "Receiver Sig. Required",
      "Admin Key",
      "Ethereum Nonce",
      "Recent Transactions",
      "Allowances",
      "Recent Staking Rewards"
    ]
  },
  {
    title: "/{network}/token/{tokenId}",
    subtitle: "Token Details",
    description: "Displays details of token with the given token ID.",
    data: [
      "Token ID",
      "EVM Address",
      "Name",
      "Symbol",
      "Memo",
      "Expires at",
      "Auto Renew Period",
      "Auto Renew Account",
      "Freeze Default",
      "Pause Status",
      "Treasury Account",
      "Created at",
      "Modified at",
      "Total Supply",
      "Initial Supply",
      "Max Supply",
      "Decimals",
      "Admin Key",
      "KYC Key",
      "Freeze Key",
      "Wipe Key",
      "Supply Key",
      "Fee Schedule Key",
      "Pause Key",
      "Balances or NFT Holders table depending on token type",
    ]
  },
  {
    title: "/{network}/contract/{contractId}",
    subtitle: "Contract Details",
    description: "Displays details of NFT with the given contract ID.",
    data: [
      "Contract ID",
      "EVM Address",
      "Balances",
      "Admin Key",
      "Memo",
      "Create Transaction",
      "Expires at",
      "Auto Renew Period",
      "Auto Renew Account",
      "Max. Auto. Association",
      "Obtainer",
      "Proxy Account",
      "Valid From",
      "Valid until",
      "Contract Nonce",
      "File",
      "Verification Status",
      "Contract Name",
      "Compiler Version",
      "IPFS Hash",
      "Runtime Bytecode",
      "Recent Contract Calls"
    ]
  },
  {
    title: "/{network}/block/{blockNumberOrHash}",
    subtitle: "Block Details",
    description: "Displays details of block with the given block number.",
    data: [
      "No. Transactions",
      "Hash",
      "From Timestamp",
      "To Timestamp",
      "Gas Used",
      "Record File Name",
      "Block Transactions",
    ]
  },
])

</script>

<style scoped>

.route {
  border-width: 0;
  border-radius: 8px;
  background-color: var(--background-secondary);
  font-size: 14px;
  font-weight: 600;
  padding: 16px;
}

.trigger {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.route-subtitle {
  align-items: center;
  display: flex;
  gap: 8px;
}

hr.horizontal-line {
  margin: 16px 0;
}

div.route-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div.route-data {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div.route-data-items {
  padding-left: 16px;
  font-weight: 400;
}

</style>
