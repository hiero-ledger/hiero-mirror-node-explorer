// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="entity-link h-is-numeric">

    <template v-if="route === null">
      <slot/>
    </template>

    <template v-else>
      <router-link :to="route">
        <span class="hoverable">
          <slot/>
        </span>
      </router-link>
    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent, PropType} from "vue";
import {RouteLocationRaw} from "vue-router";

export default defineComponent({
  name: "EntityLink",
  components: {},
  props: {
    route: {
      type: Object as PropType<RouteLocationRaw | null>,
      default: null
    },
  },
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.entity-link {
  display: inline-block;

}

</style>

