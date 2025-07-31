// SPDX-License-Identifier: Apache-2.0

//
// Exported
//

export async function importFromDrop(transferList: DataTransferItemList): Promise<Map<string, string>> {

    // DataTransferItemList is reset immediately after drop callback termination
    // => we copy file system entries before going async
    const entries: Array<FileSystemEntry> = []
    for (const i of transferList) {
        const e = (i as DataTransferItem).webkitGetAsEntry()
        if (e !== null) {
            entries.push(e)
        }
    }

    const result = new Map<string, string>()
    await importEntries(entries, result)
    return Promise.resolve(result)
}

export async function importFromChooser(fileList: FileList): Promise<Map<string, string>> {
    const result = new Map<string, string>()
    for (const f of fileList) {
        await importFile(f, result)
    }
    return result
}


//
// Private (importEntries)
//

async function importEntries(entries: Array<FileSystemEntry>, output: Map<string, string>): Promise<void> {
    for (const e of entries) {
        await importEntry(e, output)
    }
}

async function importEntry(e: FileSystemEntry, output: Map<string, string>): Promise<void> {
    if (e.isFile) {
        const fileName = e.name
        const fullPath = e.fullPath
        const relativePath = fullPath.indexOf("/") == 0 ? fullPath.substring(1) : fullPath
        if (hasExtension(fileName, ".sol")) {
            const content = await asyncReadText(e as FileSystemFileEntry)
            output.set(relativePath, content)
        } else if (hasExtension(fileName, ".json")) {
            const content = await asyncReadText(e as FileSystemFileEntry)
            if (isJsonText(content)) {
                output.set(relativePath, content)
            }
        }
    } else if (e.isDirectory) {
        const d = e as FileSystemDirectoryEntry
        for (const c of await asyncReadEntries(d)) {
            const skip = c.name.startsWith(".") || c.name == "node_modules"
            if (!skip) {
                await importEntry(c, output)
            }
        }
    } else {
        console.log("FileImporter ignored unexpected FileSystemEntry subclass: " + typeof e)
    }
}


//
// Private (importFile)
//


async function importFile(f: File, output: Map<string, string>): Promise<void> {
    const fileName = f.name
    if (hasExtension(fileName, ".sol")) {
        const content = await asyncReadTextFromFile(f)
        output.set(fileName, content)
    } else if (hasExtension(fileName, ".json")) {
        const content = await asyncReadTextFromFile(f)
        if (isJsonText(content)) {
            output.set(fileName, content)
        }
    }
}

//
// Private
//


async function asyncReadText(e: FileSystemFileEntry): Promise<string> {

    return new Promise<string>((resolve, reject) => {
        e.file((file: File) => {
            resolve(file.text())
        }, (error: unknown) => {
            reject(error)
        })
    })
}

async function asyncReadTextFromFile(f: File): Promise<string> {
    return Promise.resolve(f.text())
}

async function asyncReadEntries(e: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
    let result: FileSystemEntry[] = [];
    return new Promise<FileSystemEntry[]>((resolve, reject) => {
        const reader = e.createReader()
        const readEntries = () => {
            reader.readEntries((files: FileSystemEntry[]) => {
                if (files.length >= 1) {
                    result = result.concat(files)
                    readEntries()
                } else {
                    resolve(result)
                }
            }, (reason: unknown) => {
                reject(reason)
            })
        }
        readEntries()
    })
}

function hasExtension(fileName: string, extension: string): boolean {
    const n = fileName.toLowerCase()
    const x = extension.toLowerCase()
    return n.lastIndexOf(x) == n.length - x.length
}

function isJsonText(content: string): boolean {
    let result: boolean
    try {
        JSON.parse(content)
        result = true
    } catch {
        result = false
    }
    return result
}
