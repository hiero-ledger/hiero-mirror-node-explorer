// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <Copyable v-if="normByteString"
            :content-to-copy="'0x' + normByteString" :enable-copy="isCopyEnabled">
    <template #content>
      <div class="hexa-dump-value" :class="{'scrollbar': props.scrollBar}">
        {{ flow(isMediumScreen ? wordWrapMedium : wordWrapSmall) }}
      </div>
    </template>
  </Copyable>
  <template v-else-if="showNone && !initialLoading">
    <div class="h-is-low-contrast">None</div>
    <div v-if="noneExtra" class="h-is-low-contrast">{{ noneExtra }}</div>
  </template>
  <template v-else/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType, ref} from "vue";
import {initialLoadingKey} from "@/AppKeys";
import Copyable from "@/elements/Copyable.vue";

const props = defineProps({
  byteString: {
    type: String as PropType<string | null>,
    default: null
  },
  showNone: {
    type: Boolean,
    default: false
  },
  noneExtra: String,
  wordWrapMedium: {
    type: Number,
    default: null
  },
  wordWrapSmall: {
    type: Number,
    default: null
  },
  copyable: {
    type: Boolean,
    default: true
  },
  scrollBar: {
    type: Boolean,
    default: true
  }
})

const isMediumScreen = inject('isMediumScreen', true)

const normByteString = computed((): string | undefined => {
  let result: string | undefined
  if (props.byteString !== null) {
    result = props.byteString.startsWith("0x") ? props.byteString.slice(2) : props.byteString
  } else {
    result = undefined
  }
  return result
})

const flow = (nbWords: number | null): string => {
  return normByteString.value ? makeByteLine(normByteString.value, nbWords) : ""
}

const isCopyEnabled = computed(() => {
  return props.copyable && (normByteString.value?.length ?? 0) >= 1
})

const initialLoading = inject(initialLoadingKey, ref(false))

function makeByteLine(byteString: string, nbWords: number | null): string {
  let result = ""
  const wordCount = byteString.length / 4
  for (let i = 0; i < wordCount; i += 1) {
    if (result != "") {
      if (nbWords && i % nbWords != 0) {
        result += "\u00A0"
      } else {
        result += " "
      }
    }
    result += byteString.substring(4 * i, 4 * (i + 1))
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.hexa-dump-value {
  color: var(--text-secondary);
  font-family: var(--font-family-monospace), sans-serif;
  max-height: 400px;
  word-break: break-word;
}

div.hexa-dump-value.scrollbar {
  overflow-y: auto;
}

</style>
