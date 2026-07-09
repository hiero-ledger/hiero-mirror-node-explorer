<script lang="ts" setup>
import {computed, useAttrs} from 'vue'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  Eye,
  EyeOff,
  Info,
  TriangleAlert
} from 'lucide-vue-next'

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  icon: string | [string, string]
}>()

const attrs = useAttrs()

const icons: Record<string, unknown> = {
  check: Check,

  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,

  eye: Eye,
  'eye-off': EyeOff,

  info: Info,
  'triangle-alert': TriangleAlert,
  'circle-alert': CircleAlert,
}

const lucideIconName = computed(
    () => Array.isArray(props.icon) ? props.icon[1] : props.icon
)

const lucideSize = computed(() => {
  const size = attrs.size

  if (typeof size === 'number') {
    return size
  }

  switch (size) {
    case 'large':
      return 24
    case 'medium':
      return 20
    case 'small':
    default:
      return 16
  }
})

const component = computed(() => {
  console.log(lucideIconName.value)
  return icons[lucideIconName.value] ?? Check
})
</script>

<template>
  <component
      :is="component"
      :class="attrs.class"
      :size="lucideSize"
  />
</template>
