import fs from 'fs-extra'

// 读取JSON文件内容，如果文件不存在则返回一个空对象
export function readJSONFile<T = any>(filePath: string): Record<string, T> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    return {}
  }
}

// 写入JSON文件内容
export function writeJSONFile(
  filePath: string,
  data: Record<string, any>
): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}
