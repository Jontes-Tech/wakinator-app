import { writable } from "svelte/store";

interface Host {
  friendlyname: string;
  macadress: string;
  port: number;
  token: string;
  url: string;
}

interface Hosts {
  [key: string]: Host;
}

export const hosts = writable<Hosts>(
  JSON.parse(localStorage.getItem("hosts")) || ""
);

hosts.subscribe((value) => (localStorage.hosts = JSON.stringify(value)));
