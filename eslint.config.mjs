import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()
/**
 * @type {import('antfu')}
 */
export default antfu(
  {
    jsonc: true,
    vue: true,
    jsx: true,
    autoRenamePlugins: true,
    rules: {
      'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
      'no-use-before-define': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'no-extend-native': 'off',
      'no-unexpected-multiline': 'off',
      'vue/jsx-uses-vars': 'error',
    },
    formatters: {
      html: true,
      css: true,
    },
    languageOptions: {
      globals: {
        $dialog: 'readonly',
        $message: 'readonly',
        $loadingBar: 'readonly',
      },
    },
  },
  ...compat.config({
    extends: ['./.eslintrc-auto-import.json'],
  }),
)
