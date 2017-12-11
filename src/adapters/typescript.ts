import { parse as bParse } from 'babylon'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export function parse(fileNames: string[], rootDir = __dirname) {

  let a = readFileSync(resolve(rootDir, fileNames[0]), 'utf-8')
  console.log(a)
  let f = bParse(
    a,
    { plugins: ['typescript'], sourceType: 'module' }
  )
  debugger
  console.log(f)

  // let prog = ts.createProgram(fileNames, { rootDirs })
  // prog.getSourceFiles().map(_ => {
  //   _.statements.map(_ => {
  //     if (isExportDeclaration(_)) {
  //       console.log(_.exportClause, _.moduleSpecifier)
  //       debugger
  //       return
  //     }
  //     if (isNamedExports(_)) {
  //       console.log(_.elements)
  //       debugger
  //       return
  //     }
  //   })
  //   // prog.getTypeChecker().getExportsOfModule(_.getChildren()[0]._.moduleName)
  // })
  // return prog
}
