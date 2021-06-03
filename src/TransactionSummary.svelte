<script lang="typescript">
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label } from '@smui/button';
    import type { Transaction } from './utils';

    // Transaction to display
    export let tx: Transaction;
</script>

<Title id="summary-title">Transation Summary</Title>
<Content>
    <textarea rows="15" cols="50">{JSON.stringify(tx)}</textarea>
</Content>
<Actions>
    <Button>
        <Label>Done</Label>
    </Button>
</Actions>
