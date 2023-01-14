<script lang="ts">
  import "./app.css";
  const params = new URLSearchParams(window.location.search);
  let showModal = params.get("showModal") ? true : false;
  let content = params.get("content");
  if (showModal && !content) content = "start";

  function toggleModal() {
    showModal = !showModal;
  }

  let fetchedData;

  let loadingstate = {};

  const getServers = async () => {
    const response = await fetch(
      JSON.parse(sessionStorage.getItem("host")).url +
        "/api/list/boxes?passwd=" +
        encodeURIComponent(JSON.parse(sessionStorage.getItem("host")).token),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    for (const key in result) {
      result[key].token = JSON.parse(sessionStorage.getItem("host")).token;
      result[key].url = JSON.parse(sessionStorage.getItem("host")).url;
    }
    const res = Object.entries(result);
    if (devMode) {
      console.log(res);
    }
    fetchedData = res;
    content = "select-hosts";
  };

  let api_token: string, api_url: string;

  import { hosts } from "./stores/hosts";

  import { devMode } from "./stores/settings";

  let editmode = false;

  function deleteProperty(key: string) {
    const newStore = { ...$hosts };
    delete newStore[key];
    hosts.set(newStore);
    added[key] = false;
  }

  function addKey(key: string, value: any) {
    const newStore = { ...$hosts, [key]: value };
    hosts.set(newStore);
    added[key] = true;
    console.log(added);
  }

  let konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let currentPosition = 0;

  window.addEventListener("keydown", (event) => {
    if (event.key === konamiCode[currentPosition]) {
      currentPosition++;

      if (currentPosition === konamiCode.length) {
        content = "secret-menu";
        showModal = true;
        currentPosition = 0;
      }
    } else {
      currentPosition = 0;
    }
  });

  let added = {};
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
          <h3 class="text-3xl font-semibold">
            {content === "start" || content === "select-hosts"
              ? "Add Host"
              : "Secret Jonte Menu"}
          </h3>
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
              <p>Click on the ones you would like to add.</p>
              {#each fetchedData as host}
                <div class="flex items-center mb-4">
                  <button
                    on:click={() => {
                      if (added[host[0]]) {
                        deleteProperty(host[0]);
                      } else {
                        addKey(host[0], host[1]);
                      }
                    }}
                    class={"w-48 ml-2 text-sm font-medium text-stone-300 p-2 rounded shadow-lg " +
                      (added[host[0]] ? "bg-emerald-600" : "bg-stone-700")}
                  >
                    {host[1].friendlyname}
                  </button>
                </div>
              {/each}
            {:else if content === "secret-menu"}
              <div>
                <button
                  on:click={() => {
                    addKey("rick-pc-" + Math.floor(Math.random() * 100), {
                      friendlyname: "Rick's PC",
                      macadress: "41-53-54-4C-45-59",
                      port: 9,
                      token: "not-telling-you",
                      url: "https://og.ax",
                    });
                  }}
                  class="w-48 ml-2 mb-2 text-sm font-medium text-stone-300 p-2 rounded shadow-lg bg-emerald-600"
                  >Add Dummy Data</button
                >
                <button
                  on:click={() => {
                    devMode.update((d) => !d);
                  }}
                  class={"w-48 ml-2 mb-4 text-sm font-medium text-stone-300 p-2 rounded shadow-lg " +
                    ($devMode ? "bg-emerald-600" : "bg-stone-700")}
                  >Toggle Dev Mode</button
                >
              </div>
            {/if}
          </span>
          {#if content !== "secret-menu"}
            <p class="text-sm text-stone-400">
              Please rest assured that this information is stored in your
              browser's localStorage. This never touches my servers.
            </p>
          {/if}
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

                getServers();
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
          editmode = false;
          content = "start";
          toggleModal();
        }}
        class="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-800"
        >Add Host</button
      >
    </div>
  </nav>
  {#if Object.keys($hosts).length !== 0}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      {#each Object.entries($hosts) as myhost}
        <div
          class="{editmode
            ? 'moveFromSideToSide'
            : ''} max-w-sm m-4 p-6 border rounded-lg shadow-md bg-stone-800 border-stone-700"
        >
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
            {myhost[1].friendlyname}
          </h5>
          <p class="mb-3 font-normal text-stone-400">
            {myhost[1].macadress} : {myhost[1].port}
          </p>
          {#if !editmode}
            <button
              on:click={() => {
                loadingstate[myhost[0]] = "Loading";
                fetch(myhost[1].url + "/api/wake", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    passwd: myhost[1].token,
                    target: myhost[0],
                  }),
                })
                  .then((res) => {
                    if (res.status === 200) {
                      loadingstate[myhost[0]] = "Success";
                      setTimeout(() => {loadingstate[myhost[0]] = "Wake"},2000);
                    } else {
                      loadingstate[myhost[0]] = "Error: "+res.status;
                    }
                  })
                  .catch((err) => {
                    loadingstate[myhost[0]] = "Error";
                  });
              }}
              class={"inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none "+(loadingstate[myhost[0]] === "Loading" ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-800" : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-800")}
            >
              {loadingstate[myhost[0]] || "Wake"}
            </button>
          {:else}
            <button
              on:click={() => {
                deleteProperty(myhost[0]);
              }}
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-red-600 hover:bg-red-700 focus:ring-red-800"
            >
              Remove
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div
      class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12"
    >
      <h1
        class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
      >
        <span
          class="text-transparent font-extrabold bg-clip-text bg-gradient-to-br from-emerald-400 to-green-300"
          >Wake on Wan</span
        > has Never Been Easier
      </h1>
      <p class="text-gray-400">
        Hello, friend! This is a simple web app that allows you to securely wake
        your devices from anywhere in the world, using Wake on Lan. To get
        started, click the <strong>Add Host</strong> button in the top right corner.
      </p>
    </div>
  {/if}
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
