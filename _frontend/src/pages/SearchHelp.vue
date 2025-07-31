// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Search Help">

    <div class="search-help">

      <div class="search-help-title">
        You can search using one of the expressions below:
      </div>

      <div class="search-help-content">
        <div>
          &bull; a domain name<br/>
          <div class="search-help-example">
            Example:&nbsp;domain1.hbar
          </div>
          <div class="search-help-example">
            or:&nbsp;domain2.hh
          </div>
        </div>
        <div class="mt-3">
          &bull; an entity ID with or without checksum (0.0.x or 0.0.x-abcde)<br/>
          <div class="search-help-example">
            Example:&nbsp;0.0.1484550
          </div>
          <div class="search-help-example">
            or:&nbsp;0.0.1484550-yapfr
          </div>
        </div>
        <div class="mt-3">
          &bull; a transaction ID (0.0.x@seconds.nanoseconds)<br/>
          <div class="search-help-example">
            Example:&nbsp;0.0.1484550@1672860351.268707677
          </div>
        </div>
        <div v-if="false" class="mt-3">
          &bull; a transaction hash (96 characters in hexadecimal notation)<br/>
          <div class="search-help-example">
            Example:&nbsp;0x7b35c2dba2199cea846d96b58d8786132831a3522650bb369899e6fac01933a8ca3d79da0db93cd2bf816c1b97819afa
          </div>
        </div>
        <div class="mt-3">
          &bull; a transaction timestamp (seconds.nanoseconds)<br/>
          <div class="search-help-example">
            Example:&nbsp;1672860361.726937910
          </div>
        </div>
        <div class="mt-3">
          &bull; an account public key (64 or 66 characters in hexadecimal notation)<br/>
          <div class="search-help-example">
            Example:&nbsp;0x0000fc0634e2ab455eff393f04819efa262fe5e6ab1c7ed1d4f85fbcd8e6e296
          </div>
        </div>
        <div class="mt-3">
          &bull; a key alias (string in base 32 or hexadecimal notation)<br/>
          <div class="search-help-example">
            Example:&nbsp;CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ
          </div>
          <div class="search-help-example">
            or:&nbsp;0x12200000fc0634e2ab455eff393f04819efa262fe5e6ab1c7ed1d4f85fbcd8e6e296
          </div>
        </div>
        <div class="mt-3">
          &bull; an evm address alias or account num alias (40 characters in hexadecimal notation)<br/>
          <div class="search-help-example">
            Example:&nbsp;0x00000000000000000000000000000000000b03ae
          </div>
        </div>
        <div class="mt-3">
          &bull; a block hash or hash prefix (resp. 96 or 64 characters in hexadecimal notation)<br/>
          <div class="search-help-example">
            Example:&nbsp;0xd84193b8a421cee8035fccbce280c89f79509aa86969c1a425337b7218e94741
          </div>
        </div>
      </div>

    </div>
  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.search-help {
  text-align: center;
  min-height: 450px;
}

div.search-help-title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 32px;
}

div.search-help-content {
  display: inline-block;
  max-width: 1024px;
  font-size: 14px;
  text-align: left;
}

div.search-help-example {
  color: var(--text-secondary);
  margin-left: 12px;
  word-break: break-word;
}

</style>
