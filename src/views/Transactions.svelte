<script lang="ts">
  import { derived } from "svelte/store";
  import type { Readable } from "svelte/store";

  import { latestHeader, currentWalletName, melwalletdClient } from "../stores";
  import { TransactionBubble } from "components";
  const dateToTxhash: Readable<
    { [key: string]: [string, number][] } | undefined
  > = derived(
    [currentWalletName, latestHeader],
    ([name, netStatus], set) => {
      if (!name || !netStatus) {
        return;
      }

      const heightToString = (height: number) => {
        const latestHeight = netStatus ? Number(netStatus.height) : 1000000;
        const heightDifference = latestHeight - height;
        let heightTime = new Date(Date.now() - heightDifference * 30000);
        if (height < 0) {
          heightTime = new Date(Date.now());
          console.error("subzero", heightTime);
        }
        heightTime.setHours(0, 0, 0, 0);
        return heightTime.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      (async () => {
        let res = await melwalletdClient.dump_transactions(name);
        let toret: { [key: string]: [string, number][] } = {};
        res.forEach(([txhash, height]) => {
              const real_height = height ? Number(height) : -1;
              const key = heightToString(real_height);
              if (!(key in toret)) {
                toret[key] = [];
              }
              toret[key].push([txhash, real_height]);
            });
        set(toret)
      })();
    }
  );

  const keyify = (x: number) => (x < 0 ? 1e1000 : x);
</script>

<div>
  <div class="main">
    {#if $dateToTxhash}
      {#each Object.entries($dateToTxhash).sort((x, y) => Date.parse(y[0]) - Date.parse(x[0])) as [date, batch]}
        <div class="dateline">{date}</div>
        {#each batch.sort((x, y) => keyify(y[1]) - keyify(x[1])) as [txhash, height] ($currentWalletName + txhash)}
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
