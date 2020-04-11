import * as fs from "fs"

export function replaceUrlInJsFile(filePath: string, urlReplaceString: string, url: string) {
    const fileAsString = fs.readFileSync(filePath, "utf-8");
    const updatedFileAsString = fileAsString.replace(urlReplaceString, url);
    const split = filePath.split("\\");
    const fileName = split.pop();
    const tmpFileName = `tmp-${fileName}`;
    const tmpFilePath = `${split.join("\\")}\\${tmpFileName}`;
    fs.writeFileSync(tmpFilePath, updatedFileAsString, "utf-8");
    return tmpFilePath;
  }