<script lang="ts">
  import "./app.css";
  if (!localStorage.getItem("hosts")) {
    localStorage.setItem("hosts", JSON.stringify({}));
  }

  let showModal = false;
  let content: string;

  function toggleModal() {
    showModal = !showModal;
  }

  const getServers = async () => {
    const response = await fetch(
      JSON.parse(sessionStorage.getItem("host")).url + "/api/list/boxes",
      {
        method: "POST",
        body: JSON.stringify({
          passwd: JSON.parse(sessionStorage.getItem("host")).token,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  let serverPromise = getServers();

  let api_token: string, api_url: string;

  let myhosts = JSON.parse(localStorage.getItem("hosts"));

  let editmode = false;
</script>

{#if showModal}
  <div
    class="text-white overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class="relative my-6 mx-auto max-w-sm w-96">
      <!--content-->
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-stone-800 outline-none focus:outline-none"
      >
        <!--header-->
        <div
          class="flex items-start justify-between p-5 border-b border-solid border-emeraldstone-200 rounded-t"
        >
          <h3 class="text-3xl font-semibold">Add Host</h3>
          <button
            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            on:click={toggleModal}
          >
            <span
              class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
            >
              ×
            </span>
          </button>
        </div>
        <div class="relative p-6 flex-auto">
          <span class="my-4 text-emeraldstone-500 text-lg leading-relaxed">
            {#if content === "start"}
              <div class="mb-6">
                <label
                  for="api_url"
                  class="block mb-2 text-sm font-medbind:value={api_url}ium text-white"
                  >API URL</label
                >
                <input
                  type="url"
                  id="api_url"
                  bind:value={api_url}
                  class="border text-sm rounded-lg block w-80 p-2.5 bg-stone-700 border-stone-600 placeholder-stone-400 text-white focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://wake-homelab.jontes.page:1234"
                />
              </div>
              <div class="mb-6">
                <label
                  for="api_token"
                  class="block mb-2 text-sm font-medium text-white">Key</label
                >
                <input
                  type="text"
                  id="api_token"
                  bind:value={api_token}
                  class="border text-sm rounded-lg block w-80 p-2.5 bg-stone-700 border-stone-600 placeholder-stone-400 text-white focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="The one displayed at first launch, not .json"
                />
              </div>
            {:else if content === "select-hosts"}
              {#await serverPromise}
                <b>Loading block</b>
              {:then RESULT_VAR}
                <p>Click on the ones you would like to add.</p>
                {#each Object.entries(RESULT_VAR) as host}
                  <div class="flex items-center mb-4">
                    <button
                      on:click={() => {
                        if (!localStorage.getItem("hosts")) {
                          localStorage.setItem("hosts", JSON.stringify({}));
                        }
                        let before = JSON.parse(localStorage.getItem("hosts"));
                        before[host[0]] = host[1];
                        before[host[0]].token = JSON.parse(
                          sessionStorage.getItem("host")
                        ).token;
                        before[host[0]].url = JSON.parse(
                          sessionStorage.getItem("host")
                        ).url;
                        localStorage.setItem("hosts", JSON.stringify(before));
                        myhosts = JSON.parse(localStorage.getItem("hosts"));
                      }}
                      class="w-48 ml-2 text-sm font-medium text-stone-900 text-stone-300 p-2 rounded shadow-lg bg-emerald-600"
                    >
                      {host[1].friendlyname}
                    </button>
                  </div>
                {/each}
              {:catch ERROR_VAR}
                <b>Error {ERROR_VAR}</b>
              {/await}
            {/if}
          </span>
          <p class="text-sm text-stone-400">
            Please rest assured that this information is stored in your
            browser's localStorage. This never touches my servers.
          </p>
        </div>
        <div
          class="flex items-center justify-end p-6 border-t border-solid border-emeraldstone-200 rounded-b"
        >
          {#if content === "start"}
            <button
              class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              on:click={toggleModal}
            >
              Close
            </button>
          {/if}
          <button
            type="button"
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            on:click={() => {
              if (content === "start") {
                sessionStorage.removeItem("host");
                sessionStorage.setItem(
                  "host",
                  JSON.stringify({
                    url: api_url.replace(/\/$/, ""),
                    token: api_token,
                  })
                );
                content = "select-hosts";
              } else {
                toggleModal();
              }
            }}
          >
            {#if content === "start"}
              Continue
            {:else}
              Done
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
<main class="bg-stone-900 min-h-screen">
  <nav
    class="border-b-2 border-emerald-800 shadow-xl px-2 sm:px-4 py-2.5 rounded bg-stone-900"
  >
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <span
        class="flex flex-col self-center text-xl font-semibold whitespace-nowrap text-white p-0"
        >Wakinator<span class="text-stone-400 text-sm font-normal"
          >by <a class="hover:underline" href="https://github.com/Jontes-Tech"
            >Jonte</a
          ></span
        ></span
      >
      <button
        type="button"
        on:click={() => {
          content = "start";
          toggleModal();
        }}
        class="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-800"
        >Add Host</button
      >
    </div>
  </nav>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
  >
    {#each Object.entries(myhosts) as myhost}
      <div
        class="{editmode
          ? 'moveFromSideToSide'
          : ''} max-w-sm m-4 p-6 border rounded-lg shadow-md bg-stone-800 border-stone-700"
      >
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
          {myhost[1].friendlyname}
        </h5>
        <p class="mb-3 font-normal text-stone-400">
          {myhost[1].macadress}
        </p>
        {#if !editmode}
          <button
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-800"
          >
            Wake
          </button>
        {:else}
          <button
            on:click={() => {
              myhosts[myhost[0]] = undefined;
              localStorage.setItem("hosts", JSON.stringify(myhosts))
            }}
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-red-600 hover:bg-red-700 focus:ring-red-800"
          >
            Remove
          </button>
        {/if}
      </div>
    {/each}
  </div>
</main>
<footer
  class="p-4 rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 bg-stone-800"
>
  <span class="text-sm sm:text-center text-stone-400"
    >© 2023 The Wakinator Contributors
  </span>
  <ul class="flex flex-wrap items-center mt-3 text-sm text-stone-400 sm:mt-0">
    <li>
      <button on:click={() => (editmode = !editmode)} class="hover:underline"
        >Toggle Edit Mode</button
      >
    </li>
  </ul>
</footer>
