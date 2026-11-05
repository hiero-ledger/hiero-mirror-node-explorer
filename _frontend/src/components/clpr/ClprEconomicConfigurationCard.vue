// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Economic Configuration
    </template>
    <template #right-control>
      <span class="h-is-secondary-text">version {{ economics.version }}</span>
    </template>
    <template #content>
      <Property id="minLockedStake" full-width>
        <template #name>Minimum Locked Stake</template>
        <template #value>
          <HbarAmount :amount="economics.minLockedStake" :decimals="2"/>
        </template>
      </Property>
      <Property id="basePenalty" full-width>
        <template #name>Base Penalty</template>
        <template #value>
          <HbarAmount :amount="economics.basePenalty" :decimals="2"/>
        </template>
      </Property>
      <Property id="penaltyMultiplier" full-width>
        <template #name>Penalty Multiplier</template>
        <template #value>
          <StringValue :string-value="'×' + economics.penaltyMultiplier"/>
        </template>
      </Property>
      <Property id="slashBanThreshold" full-width>
        <template #name>Slash Ban Threshold</template>
        <template #value>
          <StringValue :string-value="economics.slashBanThreshold + ' slashes'"/>
        </template>
      </Property>
      <Property id="endpointMargin" full-width>
        <template #name>Endpoint Margin</template>
        <template #value>
          <StringValue :string-value="economics.endpointMarginPercent + ' %'"/>
        </template>
      </Property>
      <Property id="queueQuota" full-width>
        <template #name>Connector Queue Quota</template>
        <template #value>
          <StringValue :string-value="economics.connectorQueueQuotaPercent + ' % of max queue depth'"/>
        </template>
      </Property>
      <Property id="economicsSince" full-width>
        <template #name>In Effect Since</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="economics.since"/>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        These are the numbers every connector page compares against. Penalty for the n-th slash is
        base penalty × multiplier<sup>n−1</sup>. They are not provided by the mirror node: the Explorer holds them as
        constants.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {CLPR_ECONOMICS} from "@/components/clpr/ClprEconomics.ts";

const economics = CLPR_ECONOMICS

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.note {
  color: var(--text-secondary);
  font-size: 12px;
}

</style>
