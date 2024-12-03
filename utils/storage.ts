import { storage } from '@wxt-dev/storage';

export const localNotePosition =
  storage.defineItem<{ x: number; y: number }>("local:note-position");

export const localNoteContent =
  storage.defineItem<{title: string, note: string}>("local:note-content");