// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TopicMessage :message="topicMessage"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import TopicMessage from "@/components/topic/TopicMessage.vue";
import {TopicMessageByTimestampCache} from "@/utils/cache/TopicMessageByTimestampCache.ts";
import {TransactionLocParser} from "@/utils/parser/TransactionLocParser";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer";

const props = defineProps({
  transactionLoc: String,
  network: String
})

const transactionLoc = computed(() => props.transactionLoc ?? null)
const transactionLocParser = new TransactionLocParser(transactionLoc)
onMounted(() => transactionLocParser.mount())
onBeforeUnmount(() => transactionLocParser.unmount())

const transactionAnalyzer = new TransactionAnalyzer(transactionLocParser.transaction)
onMounted(() => transactionAnalyzer.mount())
onBeforeUnmount(() => transactionAnalyzer.unmount())

const messageTimestamp = computed(() =>
    (transactionAnalyzer.isSubmitMessage.value)
        ? transactionAnalyzer.consensusTimestamp.value ?? ""
        : ""
)
const topicMessageLookup = TopicMessageByTimestampCache.instance.makeLookup(messageTimestamp)
onMounted(() => topicMessageLookup.mount())
onBeforeUnmount(() => topicMessageLookup.unmount())

const topicMessage = topicMessageLookup.entity

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
