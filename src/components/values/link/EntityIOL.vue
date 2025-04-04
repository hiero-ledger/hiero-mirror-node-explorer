// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="is-inline-block">

    <template v-if="label">
      <PublicLabel :label-definition="label" compact/>
    </template>

    <template v-else-if="domainName">
      <DomainLabel :domain-name="domainName" :provider-name="providerName" compact/>
    </template>

    <template v-else-if="entityId !== null">
      <span class="h-is-numeric">
        {{ entityId ?? "" }}
      </span>
    </template>

    <template v-else-if="!initialLoading">
      <span class="h-is-low-contrast">
        {{ nullLabel ?? "None" }}
      </span>
    </template>

    <template v-else>
      <!-- Nothing because entityId is null and (showNone=false or initialLoading is true) -->
    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, inject, onBeforeUnmount, onMounted, PropType, ref} from "vue";
import {initialLoadingKey} from "@/AppKeys";
import {LabelByIdCache} from "@/utils/cache/LabelByIdCache.ts";
import PublicLabel from "@/components/values/PublicLabel.vue";
import DomainLabel from "@/components/values/DomainLabel.vue";

const DEFAULT_LABEL_SIZE = 30

const props = defineProps({
  entityId: {
    type: String as PropType<string | null>,
    default: null
  },
  domainName: {
    type: String as PropType<string | null>,
    default: null
  },
  providerName: {
    type: String as PropType<string | null>,
    default: null
  },
  nullLabel: {
    type: String,
    default: null
  },
})

const initialLoading = inject(initialLoadingKey, ref(false))

const entityId = computed(() => props.entityId)

const domainName = computed(() => slice(props.domainName))

const labelLookup = LabelByIdCache.instance.makeLookup(entityId)
onMounted(() => labelLookup.mount())
onBeforeUnmount(() => labelLookup.unmount())
const label = labelLookup.entity

const slice = (label: string | null) => {
  let result = label
  if (result && result.length > DEFAULT_LABEL_SIZE) {
    result = result.slice(0, DEFAULT_LABEL_SIZE) + '…'
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

