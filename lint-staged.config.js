export default {
  '**/*.{js,jsx,ts,tsx}': (filenames) => {
    const filesToLint = filenames.filter((file) => !file.endsWith('eslint.config.js'));
    const eslintCommand = filesToLint.length > 0 ? [`eslint --fix ${filesToLint.join(' ')}`] : [];
    return [...eslintCommand, `prettier --write ${filenames.join(' ')}`];
  },
};
