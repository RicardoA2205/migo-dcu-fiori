import fioriTools from '@sap-ux/eslint-plugin-fiori-tools';

export default [
    { ignores: ['dist/**', 'docs/**'] },
    ...fioriTools.configs.recommended
];
