<script lang="ts">
  import type { PageData, ActionData } from './$types'
  
  export let data: PageData
  export let form: ActionData

  let mode: 'view' | 'edit' = 'view'
  let selectedFile: File | null = null
  let previewUrl: string | null = null

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      selectedFile = input.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl = e.target?.result as string
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  function cancelUpload() {
    selectedFile = null
    previewUrl = null
  }
</script>

<div class="profile-container">
  <h1>Min Profil</h1>
  
  <div class="profile-card">
    <div class="profile-image-section">
      {#if previewUrl}
        <img src={previewUrl} alt="Preview" class="profile-image" />
      {:else if data.user?.profileImage}
        <img src={'data:image/jpeg;base64,' + data.user.profileImage} alt="Profile" class="profile-image" />
      {:else}
        <div class="placeholder-image">Ingen bild</div>
      {/if}
      
      {#if !selectedFile}
        <div class="image-actions">
          <form action="?/uploadImage" method="POST" enctype="multipart/form-data">
            <input type="file" name="image" accept="image/*" on:change={handleFileSelect} hidden />
            <button type="button" on:click={() => document.querySelector('input[name="image"]')?.click()}>
              Ladda upp bild
            </button>
          </form>
          
          {#if data.user?.profileImage}
            <form action="?/removeImage" method="POST" style="display: inline;">
              <button type="submit" class="danger">Ta bort bild</button>
            </form>
          {/if}
        </div>
      {:else}
        <div class="image-actions">
          <form action="?/uploadImage" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="image" value={previewUrl} />
            <button type="submit">Spara bild</button>
            <button type="button" on:click={cancelUpload} class="cancel">Avbryt</button>
          </form>
        </div>
      {/if}
    </div>

    <div class="profile-stats">
      <div class="stat">
        <span class="label">Karaktärer:</span>
        <span class="value">{data.stats?.characterCount || 0}</span>
      </div>
      <div class="stat">
        <span class="label">Totala matcher:</span>
        <span class="value">{data.stats?.totalGames || 0}</span>
      </div>
      <div class="stat">
        <span class="label">Vinster:</span>
        <span class="value">{data.stats?.totalWins || 0}</span>
      </div>
      <div class="stat">
        <span class="label">Förluster:</span>
        <span class="value">{data.stats?.totalLosses || 0}</span>
      </div>
    </div>
  </div>

  {#if mode === 'view'}
    <div class="user-info">
      <p><strong>Användarnamn:</strong> {data.user?.username}</p>
      <p><strong>Email:</strong> {data.user?.email}</p>
      <button on:click={() => (mode = 'edit')}>Redigera</button>
    </div>
  {:else}
    <form method="POST" action="?/updateProfile" class="edit-form">
      <div class="form-group">
        <label for="username">Användarnamn</label>
        <input type="text" id="username" name="username" value={data.user?.username} required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" value={data.user?.email} required />
      </div>

      <div class="form-group">
        <label for="password">Nytt lösenord (lämna tomt för att behålla)</label>
        <input type="password" id="password" name="password" />
      </div>

      <div class="button-group">
        <button type="submit">Spara ändringar</button>
        <button type="button" on:click={() => (mode = 'view')}>Avbryt</button>
      </div>
    </form>
  {/if}

  {#if form?.success}
    <div class="success-message">✓ {form.message}</div>
  {/if}
  {#if form?.message && !form?.success}
    <div class="error-message">✗ {form.message}</div>
  {/if}
</div>

<style>
  .profile-container {
    max-width: 640px;
    margin: 0 auto;
    padding: 24px;
  }

  .profile-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    border: 4px solid #ffffff;
    padding: 20px;
    background: #000000;
    margin-bottom: 20px;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .profile-image-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .profile-image,
  .placeholder-image {
    width: 150px;
    height: 150px;
    border: 3px solid #ffffff;
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--pixel-font);
    font-size: 8px;
    color: #ffffff;
  }

  .profile-image {
    object-fit: cover;
  }

  .image-actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
  }

  .image-actions button {
    padding: 8px;
    font-size: 12px;
    cursor: pointer;
    border: 3px solid #ffffff;
    background: #000000;
    color: #fff;
    font-family: var(--pixel-font);
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .image-actions button:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .image-actions button.danger {
    background: #000000;
    color: #ffffff;
    border-color: #ffffff;
  }
  
  .image-actions button.danger:hover {
    background: #222222;
  }

  .image-actions button.cancel {
    background: #000000;
    color: #cccccc;
    border-color: #cccccc;
     box-shadow: 0.2rem 0.2rem 0 #cccccc;
  }
  
  .image-actions button.cancel:hover {
    background: #222222;
    color: #ffffff;
    border-color: #ffffff;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .profile-stats {
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: center;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 3px solid #ffffff;
    background: #000000;
  }

  .stat .label {
    font-weight: bold;
    color: #cccccc;
  }

  .stat .value {
    font-family: var(--pixel-font);
    font-size: 16px;
    color: #ffffff;
  }

  .user-info {
    border: 4px solid #ffffff;
    padding: 20px;
    background: #000000;
    margin-bottom: 20px;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .user-info p {
    margin: 10px 0;
    font-family: var(--pixel-font);
    color: #ffffff;
  }

  .edit-form {
    border: 4px solid #ffffff;
    padding: 20px;
    background: #000000;
    margin-bottom: 20px;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    font-family: var(--pixel-font);
    color: #ffffff;
  }

  .form-group input {
    width: 100%;
    padding: 10px;
    border: 3px solid #ffffff;
    font-family: var(--pixel-font);
    box-sizing: border-box;
    background: #000000;
    color: #ffffff;
  }
  
  .form-group input:focus {
    outline: none;
    background: #111111;
  }

  .button-group {
    display: flex;
    gap: 10px;
  }

  .button-group button {
    flex: 1;
    padding: 10px;
    border: 3px solid #ffffff;
    background: #000000;
    color: #fff;
    cursor: pointer;
    font-family: var(--pixel-font);
    font-weight: bold;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .button-group button:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .success-message {
    background: #000000;
    border: 2px solid #ffffff;
    padding: 10px;
    margin-top: 10px;
    font-family: var(--pixel-font);
    color: #ffffff;
  }

  .error-message {
    background: #000000;
    border: 2px solid #ffffff;
    padding: 10px;
    margin-top: 10px;
    font-family: var(--pixel-font);
    color: #ffffff;
  }
</style>
