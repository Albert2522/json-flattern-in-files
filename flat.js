fs = require('fs');

if (process.argv.length !== 3) {
  throw "Please provide parent file path correctly";
}

let parent = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

class JsonFlattener {
  constructor() {
    this.flatFiles = {};
    this.flatJson = this.flatJson.bind(this);
  }

  getMeta(obj) {
    let result = { };
    Object.keys(obj).forEach(key => {
      if (key === "id" || key.startsWith("__")) {
        result[key] = obj[key];
      }
    })
    return result;
  }

  getSingular(string) {
    if (string.endsWith('s'))
      return string.slice(0, -1);
    return string;
  }

  flatJson(parent, parentMeta, path, depth) {
    let obj = {};
    Object.keys(parentMeta).forEach(key => {
      obj[key] = parentMeta[key];
    })
    Object.keys(parent).forEach(key => {
      if (typeof parent[key] !== 'object') {
        obj[key] = parent[key];
      }
    })
    let newMeta = this.getMeta(obj);
    let indexName = "_".repeat(depth + 1) + "index";

    Object.keys(parent).forEach(key => {

      if (Array.isArray(parent[key])) {
        parent[key].forEach((childKey, index) => {
          if (depth > 0)
            newMeta[indexName] = index;

          path.push(this.getSingular(key));
          this.flatJson(childKey, newMeta, path, depth + 1);
          if (depth > 0)
            delete newMeta[indexName];
          path.pop();
        })
        return;
      }

      if (typeof parent[key] === "object") {
        path.push(key);
        this.flatJson(parent[key], newMeta, path, depth);
        path.pop();
      }
    })
    let fileName = path.join('_');
    if (!this.flatFiles[fileName]) {
      this.flatFiles[fileName] = [ ];
    }
    this.flatFiles[fileName].push(obj);
  }

  saveFiles() {
    Object.keys(this.flatFiles).forEach(key => {
      if (key !== '' ) {
        fs.writeFileSync(`${key}.json`, JSON.stringify(this.flatFiles[key], null, 2) , 'utf-8');
      }
    });
  }
}

let jf = new JsonFlattener();
jf.flatJson(parent, {}, [], 0);
jf.saveFiles();
