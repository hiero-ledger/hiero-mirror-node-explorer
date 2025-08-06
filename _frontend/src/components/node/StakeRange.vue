// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="stake-range-root">
    <div class="mini-bar" :style="{'width': progressSize+'px'}">
      <div
          class="mini-bar-progress plain-range"
          :style="{'left': 0, 'width': '100%'}"
      />
      <div
          class="mini-bar-progress unrewarded-range"
          :style="{'left': 0, 'width': (stakeRewardedProgress + stakeNotRewardedProgress)+'%'}"
      />
      <div
          v-if="stakeRewardedProgress > 2"
          class="mini-bar-progress"
          :class="{'rewarded-range': isPastRewardThreshold, 'unrewarded-range': !isPastRewardThreshold}"
          :style="{'left': 0, 'width': stakeRewardedProgress+'%'}"
      />
    </div>

    <div class="stake-range-marks">
      <span class="stake-mark" :style="{'margin-left': minStakePix}">
        min
      </span>
      <span class="stake-mark" :style="{'margin-left': maxStakePix}">
        max
      </span>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer";

const progressSize = 180 // size (width) of progress in pixels

const props = defineProps({
  node: Object as PropType<NetworkNode | undefined>,
  networkAnalyzer: {
    type: Object as PropType<NetworkAnalyzer>,
    required: true
  }
})

const minStake = computed(
    () => props.node?.min_stake ?? null)
const maxStake = computed(
    () => props.node?.max_stake ?? null)

const unclampedStake = computed(
    () => (props.node?.stake_rewarded ?? 0) + (props.node?.stake_not_rewarded ?? 0))

const progressScale = computed(
    () => props.networkAnalyzer.stakeScaleEnd.value)

const stakeRewardedProgress = computed(() => {
  let result
  if (progressScale.value) {
    if ((props.node?.stake_rewarded ?? 0) < progressScale.value) {
      result = (props.node?.stake_rewarded ?? 0) / progressScale.value * 100
    } else {
      result = 100
    }
  } else {
    result = 0
  }
  return result
})

const stakeNotRewardedProgress = computed(() => {
  let result
  if (progressScale.value) {
    if (unclampedStake.value < progressScale.value) {
      result = (props.node?.stake_not_rewarded ?? 0) / progressScale.value * 100
    } else {
      result = 100 - stakeRewardedProgress.value
    }
  } else {
    result = 0
  }
  return result
})

const isPastRewardThreshold = computed(() =>
    minStake.value !== null && unclampedStake.value >= minStake.value
)

const minStakePercent = computed(() =>
    minStake.value && progressScale.value ? minStake.value / progressScale.value * 100 : 0)
const minStakePix = computed(() => {
  const pixels = Math.round(minStakePercent.value / 100 * progressSize)
  return pixels.toString() + 'px'
})

const maxStakePercent = computed(() =>
    maxStake.value && progressScale.value ? maxStake.value / progressScale.value * 100 : 0)
const maxStakePix = computed(() => {
  const pixels = Math.round((maxStakePercent.value - minStakePercent.value) / 100 * progressSize - 20)
  return pixels.toString() + 'px'
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>

div.stake-range-root {
  display: flex;
  flex-direction: column;
}

div.mini-bar-progress {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
}

div.mini-bar {
  height: 8px;
  position: relative;
  margin-bottom: 1px;
}

div.rewarded-range {
  border: 1px solid var(--text-success);
  background-color: var(--text-success);
}

div.unrewarded-range {
  border: 1px solid var(--text-accent2);
  background-color: var(--text-accent2)
}

div.plain-range {
  border: 1px solid var(--border-secondary);
  background-color: var(--border-secondary)
}

div.stake-range-marks {
  display: flex;
}

span.stake-mark {
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 400;
  height: 12px;
}

</style>
