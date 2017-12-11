import { createProgram, getCombinedModifierFlags, getJSDocTags, ModifierFlags, Node, SyntaxKind } from 'typescript'

export function parse(fileNames: string[], rootDir = __dirname) {

  // let a = readFileSync(resolve(rootDir, fileNames[0]), 'utf-8')
  // console.log(a)
  // let f = bParse(
  //   a,
  //   { plugins: ['typescript'], sourceType: 'module' }
  // )
  // console.log(f)

  let prog = createProgram(fileNames, { rootDirs: [rootDir] })
  prog.getSourceFiles().map(file => {
    file.forEachChild(node => {
      if (!isNodeExported(node)) {
        return
      }
        console.log(getJSDocTags(node))
    })
  //   file.statements.map(_ => {
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
  })
  return prog
}

function isNodeExported(node: Node): boolean {
  return (getCombinedModifierFlags(node) & ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === SyntaxKind.SourceFile)
}
