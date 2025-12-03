// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="props.hook" class="card-root">

    <div :class="{'split-content': isMediumScreen}">

      <div class="left-content">
        <Property id="hook-id">
          <template #name>Hook ID</template>
          <template #value>{{ props.hook.hook_id }}</template>
        </Property>
        <Property id="hook-contract-id">
          <template #name>Contract</template>
          <template #value>
            <ContractLink :contract-id="props.hook.contract_id"/>
          </template>
        </Property>
        <Property id="hook-owner-id">
          <template #name>Owner</template>
          <template #value>
            <AccountLink :account-id="props.hook.owner_id"/>
          </template>
        </Property>
        <Property id="hook-extension-point">
          <template #name>Extension Point</template>
          <template #value>{{ displayExtensionPoint(props.hook.extension_point) }}</template>
        </Property>
        <Property id="hook-type">
          <template #name>Hook Type</template>
          <template #value>{{ displayHookType(props.hook.type) }}</template>
        </Property>
      </div>

      <div :class="{'split-separator': isMediumScreen}" class="right-content">
        <Property id="hook-admin-key">
          <template #name>Admin Key</template>
          <template #value>
            <KeyValue
                :key-bytes="props.hook.admin_key?.key"
                :key-type="props.hook.admin_key?._type"
                :show-none="true"
            />
          </template>
        </Property>
        <Property id="hook-created-at">
          <template #name>Created</template>
          <template #value>
            <TimestampValue
                :show-none="true"
                :timestamp="props.hook.created_timestamp"
            />
          </template>
        </Property>
        <Property id="hook-deleted">
          <template #name>Deleted</template>
          <template #value>
            <span :class="{'h-is-low-contrast': !props.hook.deleted}">{{ props.hook.deleted }}</span>
          </template>
        </Property>
      </div>

    </div>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {inject, PropType} from "vue";
import Property from "@/components/Property.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import ContractLink from "@/components/values/link/ContractLink.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {ExtensionPoint, Hook, HookType} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  hook: {
    type: Object as PropType<Hook | null>,
    default: null
  },
})

const isMediumScreen = inject('isMediumScreen', true)

const displayExtensionPoint = (extensionPoint: ExtensionPoint) => {
  let result: string
  switch (extensionPoint) {
    case ExtensionPoint.ACCOUNT_ALLOWANCE_HOOK:
      result = 'Account Allowance Hook'
      break
    default:
      result = extensionPoint
  }
  return result
}

const displayHookType = (hookType: HookType) => {
  let result: string
  switch (hookType) {
    case HookType.LAMBDA:
      result = 'Lambda'
      break
    default:
      result = hookType
  }
  return result
}
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.card-root {
  background-color: var(--background-primary);
  border: 1px solid var(--table-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  padding: 16px;
}

@media (min-width: 1080px) {
  div.card-root {
    gap: 32px;
    padding: 32px;
  }
}

@media (min-width: 1080px) {
  div.card-header {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }
}

div.split-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

div.left-content {
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div.right-content {
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div.split-separator {
  border-left: 1px solid var(--border-secondary);
  padding-left: 24px;
}

</style>
