import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss, // Použití ESM syntaxe
    autoprefixer,
  ],
}
