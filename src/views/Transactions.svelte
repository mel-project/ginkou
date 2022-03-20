<script lang="ts">
  import { derived } from "svelte/store";
  import type { Readable } from "svelte/store";

  import WalletSelector from "../components/WalletSelector.svelte";
  import TransactionBubble from "../components/TransactionBubble.svelte";
  import { currentNetworkStatus, currentWalletName } from "../stores";
  import type { WalletDump } from "../utils/types";
  import { list_transactions } from "../utils/utils";
  import { parse } from "json-bigint";

  const dateToTxhash: Readable<
    { [key: string]: [string, number][] } | undefined
  > = derived(
    [currentWalletName, currentNetworkStatus],
    ([name, netStatus], set) => {
      if (!name || !netStatus) {
        return;
      }

      const heightToString = (height: number) => {
        const latestHeight = netStatus ? netStatus.height.toNumber() : 1000000;
        const heightDifference = latestHeight - height;
        let heightTime = new Date(Date.now() - heightDifference * 30000);
        if (height < 0) {
          heightTime = new Date(Date.now());
          console.log("subzero", heightTime);
        }
        heightTime.setHours(0, 0, 0, 0);
        return heightTime.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      (async () => {
        let res = await list_transactions(name);
        let toret: { [key: string]: [string, number][] } = {};
        res
          .ifLeft((err) => alert(err))
          .ifRight((res) => {
            res.forEach(([txhash, height]) => {
              const real_height = height ? height.toNumber() : -1;
              const key = heightToString(real_height);
              if (!(key in toret)) {
                toret[key] = [];
              }
              toret[key].push([txhash, real_height]);
            });
            console.log(toret);
            set(toret);
          });
      })();
    }
  );

  const keyify = (x: number) => (x < 0 ? 1e1000 : x);
</script>

<div>
  <WalletSelector />

  <div class="main">
    {#if $dateToTxhash}
      {#each Object.entries($dateToTxhash).sort((x, y) => Date.parse(y[0]) - Date.parse(x[0])) as [date, batch]}
        <div class="dateline">{date}</div>
        {#each batch.sort((x, y) => keyify(y[1]) - keyify(x[1])) as [txhash, height] (txhash)}
          <div><TransactionBubble {txhash} {height} /></div>
        {/each}
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .main {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
</style>
