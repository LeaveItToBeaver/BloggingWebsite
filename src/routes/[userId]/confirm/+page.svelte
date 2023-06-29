<script lang="ts">
	import { supabase } from "$lib/supabaseClient";

    async function confirm() {
        const { data, error } = await supabase
  .from('Users')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
    }
</script>

<style>
  .checkmark-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 16px solid green;
    color: green;
    font-size: 50px;
  }
</style>

<div class="flex items-center justify-center h-screen bg-gray-100">
  <div class="text-center">
    <div class="checkmark-circle mb-4">
      &#10003;
    </div>
    <h1 class="text-2xl font-bold">Thanks, you're all set!</h1>
  </div>
</div>
