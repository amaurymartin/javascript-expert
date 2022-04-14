// @ts-check
const { readFile } = require('fs/promises');
const { join } = require('path');

class Csv {
  static DEFAULT_OPTIONS = {
    maxLines: 3,
    columns: ['id', 'name', 'role', 'age']
  }

  static async toJson(filePath) {
    const content = await Csv.getContent(filePath);

    const validation = Csv.isValid(content);
    if (!validation.valid) throw new Error(validation.message);

    return Csv.parseToJson(content);
  }

  static async getContent(filePath) {
    // const filename = join(__dirname, filePath);

    return (await readFile(filePath)).toString('utf-8');
  }

  static isValid(content, options = Csv.DEFAULT_OPTIONS) {
    const [headers, ...lines] = content.split('\n');

    if (options?.columns?.join(',') !== headers) {
      return { valid: false, message: 'File headers are invalid!' };
    } else if (lines.length < 1 || lines.length > 4) {
      return { valid: false, message: 'File length are invalid!' };
    }

    return { valid: true };
  }

  static async parseToJson(content) {
    const [headers, ...lines] = content.split('\n');

    return lines.map(line => {
      let user = {};

      headers.split(',').map((header, index) => {
        user[header] = line.split(',')[index]
      });

      return user;
    });
  }
}

module.exports = Csv;
