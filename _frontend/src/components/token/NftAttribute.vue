// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Property
      :id="attribute.trait_type"
      :full-width="true"
  >
    <template #name>
      {{ attribute.trait_type }}
    </template>

    <template #value>
      <template v-if="isPercentage">
        {{ attribute.value + '%' }}
      </template>
      <template v-else-if="isDateTime">
        <TimestampValue :timestamp="timestamp"/>
      </template>
      <template v-else>
        {{ attribute.value }}
      </template>
    </template>
  </Property>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">
import {computed, defineComponent, PropType,} from "vue"
import {NftAttribute} from "@/components/token/TokenMetadataAnalyzer";
import Property from "@/components/Property.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";

export default defineComponent({
  name: "NftAttribute",

  components: {TimestampValue, Property},

  props: {
    attribute: {
      type: Object as PropType<NftAttribute>,
      required: true,
    }
  },

  setup(props) {
    const isPercentage = computed(() => props.attribute.display_type === 'percentage')
    const isDateTime = computed(() => props.attribute.display_type === 'datetime')
    const timestamp = computed(
        () => isDateTime.value ? props.attribute.value.toString() + '.000000000' : null
    )
    return {
      isPercentage,
      isDateTime,
      timestamp
    }
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
</style>
