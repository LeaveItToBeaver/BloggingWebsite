<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { writable } from 'svelte/store';

	let validationError = writable('');
	let email: string = '';
	let password: string = '';
	let secondPassword: string = '';
	let formSubmitted: boolean = false;
	let registrationSuccessful = writable(false);
	let confirmationSent = writable(false);

	function isValidEmail(email: string) {
		const regex = /^\S+@\S+\.\S+$/;
		return regex.test(email);
	}

	async function signUp() {
		formSubmitted = true;

		if (!isValidEmail) {
			validationError.set('Please enter a valid email.');
			return;
		}

		if (password !== secondPassword) {
			validationError.set('Passwords do not match');
			return;
		}

		if (password.length < 6) {
			validationError.set('Password must be at least 6 characters');
			return;
		}

		if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
			validationError.set('Password must contain at least one uppercase letter and one number');
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password
		});

		if (error) {
			validationError.set(error.message);
			return;
		}

		registrationSuccessful.set(true);
		confirmationSent.set(true);

		formSubmitted = false;
		validationError.set('');
	}


</script>

<div class="flex w-full h-screen bg-transparent justify-center items-center text-white">
    <div class="card w-auto h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
        <div class="card-body flex flex-col items-center">
            <h2 class="text-2xl font-bold mb-6 text-center">Hey, Nice to meet you!</h2>
            <input type="text" bind:value={email} placeholder="Email" class="input input-bordered input-primary w-full max-w-sm text-white" on:input={() => (formSubmitted = false)} />
            <input type="password" bind:value={password} placeholder="Password" class="input input-bordered input-primary w-full max-w-sm text-white" />
            <input type="password" bind:value={secondPassword} placeholder="Confirm Password" class="input input-bordered input-primary w-full max-w-sm text-white" />
            <div class="h-4"></div> <!-- This is the spacer div -->
			<div class="flex flex-row min-w-full justify-around">
				<button class="btn btn-outline btn-primary" on:click={signUp}>Sign In</button>
				<a href="/login" class="btn btn-outline btn-primary">Back</a>
			</div>
            <p class="text-red-500">{$validationError}</p>

            {#if $registrationSuccessful}
                <div class="mt-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-green-500">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p class="ml-2">Registration successful! A confirmation email is on its way.</p>
                </div>
            {/if}

        </div>
    </div>
</div>
