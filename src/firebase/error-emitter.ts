/**
 * @fileoverview A simple, global event emitter for handling specific error types,
 * like Firestore permission errors, in a centralized way.
 */

import { EventEmitter } from 'events';

// The errorEmitter should be a singleton instance.
export const errorEmitter = new EventEmitter();
