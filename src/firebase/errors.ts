/**
 * @fileoverview Defines custom error types for Firebase-related issues,
 * particularly for handling and displaying detailed Firestore permission errors.
 */

/**
 * Provides detailed context about a Firestore operation that was denied by security rules.
 * This information is used to construct a rich error message for debugging.
 */
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission-denied errors.
 * It formats the security rule context into a detailed, readable message
 * that can be displayed in the development overlay.
 */
export class FirestorePermissionError extends Error {
  constructor(context: SecurityRuleContext) {
    const deniedMessage = `
Firestore Security Rules denied the following request:
--------------------------------------------------
Operation: ${context.operation.toUpperCase()}
Path: /${context.path}
--------------------------------------------------
`;

    const dataMessage = context.requestResourceData
      ? `
With Request Data:
--------------------------------------------------
${JSON.stringify(context.requestResourceData, null, 2)}
--------------------------------------------------
`
      : '';

    const fullMessage = `${deniedMessage}${dataMessage}
Check your firestore.rules file to ensure this operation is allowed.
`;

    super(fullMessage);
    this.name = 'FirestorePermissionError';
  }
}
