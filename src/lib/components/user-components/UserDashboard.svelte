<script lang="ts">
	export let profileImageUrl: string;
	export let fName: string;
	export let lName: string;
	export let blogName: string;
	export let bio: string;
</script>

<div class="flex flex-col items-center">
	<div
		class="card bg-white w-4/5 max-w-2xl mx-auto my-4 flex flex-row items-center"
		style="height: fit-content; max-height: 50%"
	>
		<div class="flex flex-col justify-center items-center w-1/4 h-full my-3 mx-2">
			<img
				src={profileImageUrl}
				alt="User Photo"
				class="user-photo rounded-full mb-3"
				style="width: 70%; height: auto; max-height: 70%;"
				aria-hidden="true"
			/>
			<div>
				<h2 class="text-black text-lg font-semibold text-center">{fName} {lName}</h2>
			</div>
		</div>
		<div class="flex flex-col justify-center w-3/4 h-full py-3 px-2">
			<div
				class="flex flex-row bg-slate-50 rounded-lg justify-center text-center py-1 drop-shadow-xl min-w-max"
			>
				<h3 class="text-black text-xl font-semibold m-2 text-center">{blogName}</h3>
			</div>
			<div class="bio text-sm text-center">
				<p class="text-slate-950 font-semibold text-lg p-1">{bio}</p>
			</div>
		</div>
	</div>
</div>
