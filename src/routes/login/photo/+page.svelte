<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { storage, db, user, userData } from "$lib/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

    let previewURL: string;
    let uploading = false;

    let uploadSuccess = false;

    async function upload(e: any) {
        uploadSuccess = false;
        uploading = true;

        try {
            const file = e.target.files[0];
            previewURL = URL.createObjectURL(file);
            const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
            const result = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(result.ref);

            await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
            uploadSuccess = true;
        } catch (error) {
            console.error('an error occurred while attempting to upload the file: ', error);
        } finally {
            uploading = false;
        }
    }

</script>

<AuthCheck>
    <h2 class="card-title">upload pfp</h2>

    <form class="max-w-screen-md w-full">
        <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
            <img 
                src="{previewURL ?? $userData?.photoURL ?? "/sonic.jpeg"}" 
                alt="photoURL"
                width="256"
                height="256"
                class="mx-auto"
            />
            <label for="photoURL" class="label">
                <span class="label-text"></span>
            </label>
            <input
                on:change={upload}
                name="photoURL"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs"
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
            {#if uploading}
                <p class="text-info-content mt-6">uploading...</p>
                <progress class="progress progress-secondary w-56 mt-2 m-auto" />
            {/if}
            {#if uploadSuccess}
                <div class="bg-success rounded-md p-2 mt-6 w-3/4 m-auto">
                    <p class="text-success-content">uploaded successfully</p>
                </div>
            {/if}
            <a class="btn btn-secondary w-3/5 m-auto mt-6" href="/login/theme">choose theme <span class="text-[2rem]">👉</span></a>


        </div>
    </form>
</AuthCheck>




