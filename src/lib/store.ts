import { useSyncExternalStore } from "react";
import { SEED_HISTORY, type Analysis } from "./detector";

type State = {
  history: Analysis[];
  user: string | null;
};

let state: State = { history: SEED_HISTORY, user: null };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAppState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

export function addAnalysis(entry: Analysis) {
  state = { ...state, history: [entry, ...state.history] };
  emit();
}

export function signIn(email: string) {
  state = { ...state, user: email };
  emit();
}

export function signOut() {
  state = { ...state, user: null };
  emit();
}
