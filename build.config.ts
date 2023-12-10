import type { BuildEntry } from 'unbuild'
import { defineBuildConfig } from 'unbuild'

const cjsBuild: BuildEntry = {
  builder: 'mkdist',
  input: 'src',
  outDir: 'dist',
  format: 'cjs',
  ext: 'js'
}

export default defineBuildConfig({
  entries: [cjsBuild],
  clean: true,
  declaration: true,
  failOnWarn: false
})
